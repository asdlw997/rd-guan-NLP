import Dictionary from "./wordParticiple.js";
export default class TripleConverter {
    constructor() {
        this.linkingVerbSet = ['是'] //系动词集合
        this.instantiationType = '实例化类型' //实例化类型 对应的文本
        this.dictionary = new Dictionary()
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
}