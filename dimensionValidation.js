import KnowledgeGraph from "./KnowledgeGraph.js"
export default class DimensionValidation {
    constructor() {
        this.knowledgeGraph = new KnowledgeGraph()
        this.dimensionNamespace = '维度领域'

        this.instantiationType = '实例化类型' //实例化类型 对应的文本
        this.isPriorityWork=false
    }
    score(knowledgeGraph, name, type) {
        let info =this.depthDetection(knowledgeGraph, name, type)
        const thresholdA = 2, thresholdB = 2;
        const penaltyA = info[0] > thresholdA ? Math.pow(info[0] - thresholdA, 2) : 0;
        const penaltyB = info[1] > thresholdB ? Math.pow(info[1] - thresholdB, 2) : 0;
        
        const totalPenalty = 0.05 * penaltyA + 0.05 * penaltyB;
        
        const score = Math.max(0, 1 - totalPenalty);

        return score;
    }
    compare(knowledgeGraph1, knowledgeGraph2, name) {
        let uniqueSet1 = new Set()
        let uniqueSet2 = new Set()
        this.compareEmbed(knowledgeGraph1, knowledgeGraph2, name, uniqueSet2)
        this.compareEmbed(knowledgeGraph2, knowledgeGraph1, name, uniqueSet1)
        return [uniqueSet1, uniqueSet2]
    }
    compareEmbed(knowledgeGraph1, knowledgeGraph2, name,  uniqueSet2) {
        
        const children2 = this.getNextLevelDimensions(knowledgeGraph2, name);
        
        this.compareInfo(knowledgeGraph1, knowledgeGraph2, name, uniqueSet2)
        for (const child of children2) {
            this.compareEmbed(knowledgeGraph1, knowledgeGraph2, child, uniqueSet2);
        }
        
    }
    compareInfo(knowledgeGraph1, knowledgeGraph2, name, uniqueSet) {
        if (uniqueSet === undefined) {
            uniqueSet=new Set()
        }
        let originalScenes1 = knowledgeGraph1.scenes
        let originalScenes2 = knowledgeGraph2.scenes
        knowledgeGraph1.scenes = '空字符串'
        knowledgeGraph2.scenes = '空字符串'
        let triads1, triads2
        triads1 = knowledgeGraph1.filterWithScenes(this.dimensionNamespace, name, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '')
        triads2 = knowledgeGraph2.filterWithScenes(this.dimensionNamespace, name, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '')
        knowledgeGraph1.scenes = originalScenes1
        knowledgeGraph2.scenes = originalScenes2
        if (triads1.length === 0 && triads2.length === 1) {
            uniqueSet.add(name)
        }
        if (triads1.length === 0 || triads2.length === 0) {
            return false
        }
        return true
    }
    depthDetection(knowledgeGraph, name, type) {
        let info = this.computeTreeMetrics(knowledgeGraph, name)
        return [info.depth,info.maxChildren]
    }
    computeTreeMetrics(knowledgeGraph,node) {
        if (!node) {
            return { depth: 0, maxChildren: 0 };
        }
        
        const children = this.getNextLevelDimensions(knowledgeGraph,node);
        
        if (children.length === 0) {
            return { depth: 1, maxChildren: 0 };
        }
        
        let maxChildDepth = 0;
        let maxChildCount = children.length;

        for (const child of children) {
            const childMetrics = this.computeTreeMetrics(knowledgeGraph, child);
            maxChildDepth = Math.max(maxChildDepth, childMetrics.depth);
            maxChildCount = Math.max(maxChildCount, childMetrics.maxChildren);
        }
        
        return {
            depth: maxChildDepth + 1,
            maxChildren: maxChildCount
        };
    }

    getNextLevelDimensions(knowledgeGraph, name) {
        let originalScenes = knowledgeGraph.scenes
        knowledgeGraph.scenes = '空字符串'
        let triads
        triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, name, this.dimensionNamespace, this.instantiationType, this.dimensionNamespace, '')
        if (triads.length === 0) {
            return []
        }
        triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, name, this.dimensionNamespace, '连接', this.dimensionNamespace, '')
        if (triads.length === 0) {
            return []
        }
        let linkSet= new Set()
        triads.forEach(triad => {
            let triads = knowledgeGraph.filterWithScenes(this.dimensionNamespace, triad[5], this.dimensionNamespace, '优先级', this.dimensionNamespace, '')
            if (triads.length === 0) {
                return linkSet.add(triad[5])
            } else if (triads[0][5] === '低' && this.isPriorityWork===true) {
                return 
            }
            return linkSet.add( triad[5])
        });
        triads = []

        linkSet.forEach(link => {
            triads.push(...knowledgeGraph.filterWithScenes(this.dimensionNamespace, link, this.dimensionNamespace, '连接下游', this.dimensionNamespace, ''))
        })
        knowledgeGraph.scenes = originalScenes
        let res = (triads.map(triad => { return triad[5] })).flat()
        return res
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