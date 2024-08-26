import KnowledgeGraph from "./KnowledgeGraph.js"
export default class DimensionValidation {
    constructor() {
        this.knowledgeGraph = new KnowledgeGraph()
        this.dimensionNamespace = '维度领域'

        this.instantiationType = '实例化类型' //实例化类型 对应的文本
    }
    depthDetection(knowledgeGraph, name, type) {
        let depth=1
        let nameSet=new Set([name])
        let flag = true
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        do {
            let nextLevelSet=new Set()
            nameSet.forEach(name => {
                let triads
                triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, name, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, type)
                if (triads.length === 0) {
                    flag = false
                    return
                }
                triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, name, this.dimensionNamespace, '连接', this.dimensionNamespace, '')
                if (triads.length === 0) {
                    flag=false
                    return  
                }

                const linkSet = new Set(triads.map((triad => { return triad[5] })).flat());
                triads = []

                linkSet.forEach(link => {
                    triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, '连接下游', this.dimensionNamespace, ''))
                })
                triads.map((triad => { return triad[5] })).flat().forEach(element => {
                    nextLevelSet.add(element);
                });
                
                
            })
            if (flag) depth = depth + 1
            
            nameSet = nextLevelSet
        } while (flag)
        knowledgeGraph.scenes = originalScenes
        return depth
    }
    generalcheck(knowledgeGraph) {
        let stat=true
        stat = stat && this.checkingLinkofDimensions(knowledgeGraph)
        stat = stat && this.checkingDimensionofLinks(knowledgeGraph)
        stat = stat && this.checkDimensionNumbersForDimension(knowledgeGraph)

        stat = stat && this.checkingLinkofWords(knowledgeGraph)
        stat = stat && this.checkingWordofLinks(knowledgeGraph)
        stat = stat && this.checkDimensionNumbersForWord(knowledgeGraph)
        let res=[]
        if (stat) {
            res[0] = this.multiplicationCheckForDimension(knowledgeGraph)
            res[1] = this.mappingCheckForDimension(knowledgeGraph)
        }
        return [stat ,...res]
    }
    mappingCheckForDimension(knowledgeGraph) {
        let dimensionSet = this.findDimensionSet(knowledgeGraph)
        let resultWordSet = new Set()
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = []
        let mappingWord = new Set()
        dimensionSet.forEach(dimension => {
            triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, dimension, this.dimensionNamespace, '映射', this.dimensionNamespace, '')
            if (triads.length===0)return
            if (mappingWord.has(triads[0][5])) {
                resultWordSet.add(triads[0][5])
            } else {
                mappingWord.add(triads[0][5])
            }
        })
        
        knowledgeGraph.scenes = originalScenes
        return resultWordSet
    }
    multiplicationCheckForDimension(knowledgeGraph) {
        let dimensionSet = this.findDimensionSet(knowledgeGraph)
        let resultdimensionSet=new Set()
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        dimensionSet.forEach(dimension => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, dimension, this.dimensionNamespace, '维度数字', this.dimensionNamespace, '')
            let dimensionNumber = Number(triads[0][5])
            triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, dimension, this.dimensionNamespace, '连接', this.dimensionNamespace, '')
            if (triads.length === 0) return//没有连接的不验证

            const linkSet = new Set(triads.map((triad => { return triad[5] })).flat());
            triads = []
            linkSet.forEach(link => {
                triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, '连接下游', this.dimensionNamespace, ''))
            })
            const linkDimensionSet = new Set(triads.map((triad => { return triad[5] })).flat());
            triads = []
            let product = 1
            linkDimensionSet.forEach(linkDimension => {
                triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, linkDimension, this.dimensionNamespace, '维度数字', this.dimensionNamespace, '')
                product = product * Number(triads[0][5])
            })
            if (dimensionNumber !== product) {
                resultdimensionSet.add(dimension)
            }
            
        })
        knowledgeGraph.scenes = originalScenes
        return resultdimensionSet
    }
    checkingLinkofDimensions(knowledgeGraph) {
        let dimensionSet = this.findDimensionSet(knowledgeGraph)
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = []
        dimensionSet.forEach(dimension => {
            triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, dimension, this.dimensionNamespace, '连接', this.dimensionNamespace, ''))
        })
        
        const linkSet = new Set(triads.map((triad => { return triad[5] })).flat()); 
        let stat = true
        linkSet.forEach(link => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '维度连接')
            if (triads.length === 0) {
                stat=false
            }
        })
        knowledgeGraph.scenes = originalScenes
        return stat
    }
    checkingDimensionofLinks(knowledgeGraph) {
        let linKSet = this.findDimensionLinkSet(knowledgeGraph)
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = []
        linKSet.forEach(link => {
            triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, '连接上游', this.dimensionNamespace, ''))
            triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, '连接下游', this.dimensionNamespace, ''))
        })
        const dimensionSet = new Set(triads.map((triad => { return triad[5] })).flat());

        let stat = true
        dimensionSet.forEach(dimension => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, dimension, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '维度')
            if (triads.length === 0) {
                stat = false
            }
        })
        knowledgeGraph.scenes = originalScenes
        return stat
    }
    checkDimensionNumbersForDimension(knowledgeGraph) {
        let dimensionSet = this.findDimensionSet(knowledgeGraph)
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'

        let stat = true
        dimensionSet.forEach(dimension => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, dimension, this.dimensionNamespace, '维度数字', this.dimensionNamespace, '')
            if (triads.length === 0) {
                stat = false
            }
        })
        knowledgeGraph.scenes = originalScenes
        return stat
    }
    checkingLinkofWords(knowledgeGraph) {
        let wordSet = this.findWordSet(knowledgeGraph)
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = []
        wordSet.forEach(word => {
            triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, word, this.dimensionNamespace, '连接', this.dimensionNamespace, ''))
        })

        const linkSet = new Set(triads.map((triad => { return triad[5] })).flat());
        let stat = true
        linkSet.forEach(link => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '词连接')
            if (triads.length === 0) {
                stat = false
            }
        })
        knowledgeGraph.scenes = originalScenes
        return stat
    }
    checkingWordofLinks(knowledgeGraph) {
        let wordLinkSet = this.findWordLinkSet(knowledgeGraph)
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = []
        wordLinkSet.forEach(link => {
            triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, '连接上游', this.dimensionNamespace, ''))
            triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, '连接下游', this.dimensionNamespace, ''))
        })
        const wordSet = new Set(triads.map((triad => { return triad[5] })).flat());

        let stat = true
        wordSet.forEach(word => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, word, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '词')
            if (triads.length === 0) {
                stat = false
            }
        })
        knowledgeGraph.scenes = originalScenes
        return stat
    }
    checkDimensionNumbersForWord(knowledgeGraph) {
        let wordSet = this.findWordSet(knowledgeGraph)
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'

        let stat = true
        wordSet.forEach(dimension => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, dimension, this.dimensionNamespace, '维度数字', this.dimensionNamespace, '')
            if (triads.length === 0) {
                stat = false
            }
        })
        knowledgeGraph.scenes = originalScenes
        return stat
    }

    findDimensionSet(knowledgeGraph) {
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, '', this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '维度')
        knowledgeGraph.scenes = originalScenes
        const dimensionSet = new Set(triads.map((triad => { return triad[1] })).flat()); 
        return dimensionSet
    }
    findDimensionLinkSet(knowledgeGraph) {
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, '', this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '维度连接')
        knowledgeGraph.scenes = originalScenes
        const dimensionLinkSet = new Set(triads.map((triad => { return triad[1] })).flat());
        return dimensionLinkSet
    }
    findWordSet(knowledgeGraph) {
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, '', this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '词')
        knowledgeGraph.scenes = originalScenes
        const WordSet = new Set(triads.map((triad => { return triad[1] })).flat());
        return WordSet
    }
    findWordLinkSet(knowledgeGraph) {
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, '', this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '词连接')
        knowledgeGraph.scenes = originalScenes
        const WordLinkSet = new Set(triads.map((triad => { return triad[1] })).flat());
        return WordLinkSet
    }
    validation(wordList, threeDimensions) {
        let wordBaseList=[]
        wordList.forEach(word => {
            wordBaseList.push(this.primeFactors(word[1]))
        })
        let threeDimensionsBaseList = []
        threeDimensions.forEach(dimension => {
            threeDimensionsBaseList.push(this.primeFactors(dimension[1]))
        })
        if (!this.areAllElementsInNestedList(wordBaseList, threeDimensionsBaseList)) {
            return false
        }
        if (!this.basicDimensionDefinitionCheck(wordList, threeDimensionsBaseList)) {
            return false
        }
        return true
    }
    validation1(wordList, threeDimensions) {
        let wordBaseList = []
        wordList.forEach(word => {
            wordBaseList.push(this.primeFactors(word[1]))
        })
        const baseDimensionsSet = new Set(threeDimensions.map(relation => { return [relation[1], relation[3]] }).flat());
        debugger
    }
    productVerification(lists) {
        for (let list of lists) {
            let product = 1
            for (let i = 3; i < list.length; i=i+2) {
                product = product * list[i]
            }
            if (list[1] !== product) {
                return false
            }
            
        }
        return true
    }
    primeFactors(n) {
        const factors = [];

        // 处理 2 这个质数
        while (n % 2 === 0) {
            factors.push(2);
            n = Math.floor(n / 2);
        }

        // 处理其他质数
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            while (n % i === 0) {
                factors.push(i);
                n = Math.floor(n / i);
            }
        }

        // 如果 n 是一个质数且大于 2
        if (n > 2) {
            factors.push(n);
        }

        return factors;
    }
    basicDimensionDefinitionCheck(wordList, threeDimensionsBaseList) {

        const wordSet = new Set(wordList.map(word => { return word[1] }).flat());
        const dimensionsBaseSet = new Set(threeDimensionsBaseList.flat());
        for (let dimensionsBase of dimensionsBaseSet) {
            if (!wordSet.has(dimensionsBase)) {
                return false;
            }
        }
        return true;
    }
    areAllElementsInNestedList(nestedList1, nestedList2) {
        // 将 nestedList2 扁平化为一维数组，并存储到 Set 中
        const set = new Set(nestedList2.flat());

        // 遍历 nestedList1 并检查所有元素是否都存在于 Set 中
        for (let sublist of nestedList1) {
            for (let element of sublist) {
                if (!set.has(element)) {
                    return false; // 如果有任意一个元素不在 set 中，返回 false
                }
            }
        }

        return true; // 如果所有元素都在 set 中，返回 true
    }
}