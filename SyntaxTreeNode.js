export default class SyntaxTree{
    constructor() {
        this.input = []//0 tree
        this.output = []//0 处理后的domain
        this.EMPTY_STMT = 'EMPTY_STMT'//空
        this.terminalSet = ['名词', '的', '和', '动词', '符号']
    }
    Convert2SyntaxTree(concreteSyntaxTree) {

        return this.embedded('', concreteSyntaxTree)
        
    }
    embedded(lastType, concreteSyntaxTree) {

        if (!this.terminalSet.includes(concreteSyntaxTree.type)) {//非终结符
            let res = []
            if (concreteSyntaxTree.type !== lastType) {
                res.push(concreteSyntaxTree.type)
            }
            
            
            concreteSyntaxTree.data.forEach(obj => {
                if (obj.type === concreteSyntaxTree.type) {//直接递归
                    res.push(...this.embedded(concreteSyntaxTree.type, obj))
                } else {//无直接递归
                    if (obj.type !== this.EMPTY_STMT) {
                        res.push(this.embedded(concreteSyntaxTree.type, obj))
                    }
                }

            })
            
            
            return res
        }

        //终结符
        return [concreteSyntaxTree.type, concreteSyntaxTree.data]


    }
    Totriad(SPO) {
        let subjects = SPO[1], predicates = SPO[2], objects = SPO[3];
        let res=[]
        predicates.slice(1).forEach((P) => {//对每个谓语
            subjects.slice(1).forEach((S) => {
                objects.slice(1).forEach((O) => {
                    let log =''
                    S.slice(1).forEach((multiAttribute) => {
                        log+=this.mergeMultiAttribute(multiAttribute)
                    })
                    log +=P[1][0]
                    O.slice(1).forEach((multiAttribute) => {
                        log += this.mergeMultiAttribute(multiAttribute)
                    })
                    console.log(log)
                })
            })
            
        })
        return
    }
    serializationDNoun(DNoun) {//序列化 的名词
        let res = ''
        multiAttribute.slice(1).forEach((noun) => {
            res += noun[1][0]
        })
        return res
    }
    mergeMultiAttribute(multiAttribute) {//把多属性名词合并成一个
        let res=''
        multiAttribute.slice(1).forEach((noun) => {
            res+=noun[1][0]
        })
        return res
    }
}