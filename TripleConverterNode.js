import Dictionary from "./wordParticiple.js";
import KnowledgeGraph from "./KnowledgeGraph.js"
export default class TripleConverter {
    constructor() {
        this.linkingVerbSet = ['是'] //系动词集合
        this.instantiationType = '实例化类型' //实例化类型 对应的文本
        this.dictionary = new Dictionary()
        this.knowledgeGraph = new KnowledgeGraph()
        
    }
    setDictionary(dictionary) {
        this.dictionary = dictionary;//复制引用！！！
    }
    Totriad(SPO) {
        let subjects = SPO[1], predicates = SPO[2], objects = SPO[3];
        let res = []
        predicates.slice(1).forEach((P) => {//对每个谓语
            subjects.slice(1).forEach((S) => {
                objects.slice(1).forEach((O) => {
                    let leftNouns = S.slice(1).map((multiAttribute) => {
                        return this.mergeMultiAttribute(multiAttribute)
                    })
                    let rightNouns = O.slice(1).map((multiAttribute) => {
                        return this.mergeMultiAttribute(multiAttribute)
                    })
                    if (this.linkingVerbSet.includes(P[1][0])) {
                        res.push(...this.totriadLinkingVerb(leftNouns, rightNouns))
                    } else {
                        res.push(...this.totriadVerb(leftNouns, rightNouns, P[1][0]))
                    }
                })
            })

        })
        return res
    }
    totriadVerb(leftNouns, rightNouns, predicate) {
        let res = []
        let leftLonger = (leftNouns.length >= rightNouns.length)
        let A = leftNouns.shift()
        let B = leftNouns[0]
        while (leftNouns.length >= 1) {
            res.push([A, B, this.nameNewDNoun(A, B)])
            leftNouns.shift()
            A = this.nameNewDNoun(A, B)
            B = leftNouns[0]
        }
        let C = rightNouns.shift()
        let D = rightNouns[0]
        while (rightNouns.length >= 1) {

            res.push([C, D, this.nameNewDNoun(C, D)])
            rightNouns.shift()
            C = this.nameNewDNoun(C, D)
            D = rightNouns[0]
        }
        res.push([A, predicate, C])
        return res
    }
    totriadLinkingVerb(leftNouns, rightNouns) {

        let res = []
        let leftLonger = (leftNouns.length >= rightNouns.length)
        let A = leftNouns.shift()
        let B = leftNouns[0]
        while (leftNouns.length >= 2) {


            res.push([A, B, this.nameNewDNoun(A, B)])
            leftNouns.shift()
            A = this.nameNewDNoun(A, B)
            B = leftNouns[0]

        }

        let C = rightNouns.shift()
        let D = rightNouns[0]
        while (rightNouns.length >= 2) {


            res.push([C, D, this.nameNewDNoun(C, D)])
            rightNouns.shift()
            C = this.nameNewDNoun(C, D)
            D = rightNouns[0]

        }

        if (leftLonger) {
            if (D !== undefined) {
                res.push([C, D, this.nameNewDNoun(C, D)])
                res.push([A, B, this.nameNewDNoun(C, D)])
            } else {
                if (B !== undefined) {
                    res.push([A, B, C])
                } else {
                    res.push(this.nameAisC(A, C))
                }

            }

        } else {
            if (B !== undefined) {
                res.push([A, B, this.nameNewDNoun(A, B)])
                res.push([C, D, this.nameNewDNoun(A, B)])
            } else {
                res.push([C, D, A])
            }

        }
        return res
    }
    nameAisC(A, C) {
        let res = [A, this.instantiationType, C]
        return res
    }
    nameNewDNoun(A, B) {//为新词命名
        let res = A + '的' + B
        //可在这加入在知识图谱中查找相应属性值
        let originalScenes = this.knowledgeGraph.scenes;
        this.knowledgeGraph.scenes = '空字符串'
        let triads = this.knowledgeGraph.filterWithScenes('', A, '', B, '', '')
        if (triads.length > 0) {
            res = triads[0][5]//如果有多个结果 取第一个
        }
        this.knowledgeGraph.scenes = originalScenes
        return res
    }
    serializationDNoun(DNoun) {//序列化 的名词
        let res = ''
        multiAttribute.slice(1).forEach((noun) => {
            res += noun[1][0]
        })
        return res
    }
    mergeMultiAttribute(multiAttribute) {//把多属性名词合并成一个
        let res = ''
        multiAttribute.slice(1).forEach((noun) => {
            res += noun[1][0]
        })
        return res
    }
    confirmScene(tripleList) {

        let scenesList = tripleList.map(triple => {
            let set1 = new Set(this.dictionary.listWordScenes(triple[0]))
            let set2 = new Set(this.dictionary.listWordScenes(triple[1]))
            let set3 = new Set(this.dictionary.listWordScenes(triple[2]))

            const commonInAllThree = [...set1].filter(item => set2.has(item) && set3.has(item));
            if (commonInAllThree.length > 0) {
                return commonInAllThree[0];
            }

            // 如果没有三个集合共有的元素，则查找任意两个集合共有的元素
            const commonInSet1AndSet2 = [...set1].filter(item => set2.has(item));
            const commonInSet1AndSet3 = [...set1].filter(item => set3.has(item));
            const commonInSet2AndSet3 = [...set2].filter(item => set3.has(item));

            // 合并两个集合的交集结果，并去重
            const combinedTwoSetsCommon = new Set([
                ...commonInSet1AndSet2,
                ...commonInSet1AndSet3,
                ...commonInSet2AndSet3
            ]);
            if (combinedTwoSetsCommon.size > 0) {
                return [...combinedTwoSetsCommon][0];
            }
            return this.dictionary.defaultScenes
            
        })
        let res = []
        for (let i = 0; i < tripleList.length; i++) {
            res.push([scenesList[i], tripleList[i][0], scenesList[i], tripleList[i][1],scenesList[i], tripleList[i][2]])
        }  
        return res
    }
}