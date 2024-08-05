import Module from "./str/Module.js";
import Unit from "./str/Unit.js";
import Domain from "./str/Domain.js";
export default class SyntaxTree {
    constructor() {
        this.input = []//0 tree
        this.output = []//0 处理后的domain
        this.EMPTY_STMT = 'EMPTY_STMT'//空
        this.terminalSet = ['名词', '的', '和', '动词', '符号']//终结符集合
    }
    run() {
        let concreteSyntaxTree=this.input[0]
        let SyntaxTreeList = this.Convert2SyntaxTree(concreteSyntaxTree) 
        let domain =this.toDomain(SyntaxTreeList)
        this.output[0] = domain
    }
    Convert2SyntaxTree(concreteSyntaxTree) {

        return this.embedded('', concreteSyntaxTree)

    }
    toDomain(SyntaxTreeList) {
        let listTypeDomain = this.tolistTypeDomain(SyntaxTreeList)
        let domain = new Domain();
        listTypeDomain.forEach(listTypeModule => {
            let module=new Module()
            
            listTypeModule.forEach(listTypeUnit => {
                module.addUnit(new Unit(...listTypeUnit))
            })
            domain.addModule(module)
        })
        return domain
    }
    fromDomain(domain) {
        let listTypeDomain = this.domain2listTypeDomain(domain)
        let SyntaxTreeListList=[]
        let root = listTypeDomain.find(listTypeModule => {
            return (listTypeModule[0][2] === 0)
        })
        function embedded(listTypeModule, lastTreeNode) {
            let treeNode = []
            let [moduleId, moduleMark, lastmodule] = listTypeModule[0]
            treeNode.push(moduleMark)
            lastTreeNode.push(treeNode)
            if (!this.terminalSet.includes(moduleMark)) {//非终结符
                for (let i = 1; i < listTypeModule.length; i++) {
                    let listTypeUnit = listTypeModule[i]
                    let [nextModuleId, nextModuleMark] = listTypeUnit
                    let nextlistTypeModule=listTypeDomain.find(listTypeModule => {
                        return listTypeModule[0][0]===nextModuleId
                    })
                    embedded.call(this, nextlistTypeModule, treeNode)
                    
                }
            }
            else {
                treeNode.push(listTypeModule[1])
            }
        }
        embedded.call(this, root, SyntaxTreeListList)
        let SyntaxTreeList = SyntaxTreeListList[0]
        //debugger
        return SyntaxTreeList
    }
    domain2listTypeDomain(domain) {
        let listTypeDomain=[]
        for (let id = 2; id <= domain.current_id; id++) {
            let listTypeModule=[]
            let module = domain.list[id]
            listTypeDomain.push(listTypeModule)
            module.list.forEach(unit => {
                let listTypeUnit=[]
                listTypeUnit = unit.list.filter(bit => {
                    return bit!==''
                })
                listTypeModule.push(listTypeUnit)
            })
        }
        return listTypeDomain
    }
    tolistTypeDomain(SyntaxTreeList) {
        let listTypeDomain =[]
        function getId(listTypeDomain) {
            let id 
            for (id = 1; id <= listTypeDomain.length; id++) {
                if (!listTypeDomain.some(listTypeModule => {
                    return listTypeModule[0][0] === id;
                })) {
                    break;
                }
            }
            return id
        }
        function embedded(list,lastModuleId) {
            let moduleMark = list[0]
            let moduleId = getId(listTypeDomain)
            let listTypeModule = []
            listTypeDomain.push(listTypeModule)
            listTypeModule.push([moduleId, moduleMark, lastModuleId]);
            if (!this.terminalSet.includes(moduleMark)) {//非终结符
                for (let i = 1; i < list.length; i++) {
                    let obj = list[i]
                    let [nextModuleId, nextModuleMark] = embedded.call(this, obj, moduleId)
                    listTypeModule.push([nextModuleId, nextModuleMark]);
                }
            }
            else {
                listTypeModule.push([list[1][0]])
            }
            return [moduleId, moduleMark]
        }
        embedded.call(this,SyntaxTreeList,0)
        return listTypeDomain
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
}