import Domain from "./str/Domain.js";
import Module from "./str/Module.js";
export default class SetOperator {
    constructor() {
        this.input = []//0 抽象语法树1 1 抽象语法树2
        this.output = []//0 集合操作后的抽象语法树
    }
    intersection(domain1, domain2) {
        //交集
        let rootList1, rootList2, resRootList
        rootList1 = this.toElements(domain1)
        rootList2 = this.toElements(domain2)
        resRootList = [rootList1[0],
            rootList1[1].filter(unitId1 => {//在第一个domain1中寻找
                return rootList2[1].some(unitId2 => {//在第二个domain1至少存在一个
                    return this.compareElements([rootList1[0], unitId1], [rootList2[0], unitId2], domain1, domain2)//两个树完全匹配的
                })
            })//
        ]
        //注意:Id为手动添加，可能不满足Domain的基本假设
        let resDomain = new Domain();
        resDomain.list[resRootList[0]] = new Module();
        resRootList[1].map(unitId1 => {

            resDomain.list[resRootList[0]].list[unitId1] = domain1.list[resRootList[0]].list[unitId1];
            this.domainAddTree(resDomain, [resRootList[0], unitId1], domain1);
        })
        //debugger
        return resDomain;
    }
    union(domain1, domain2) {
        //并集
        let rootList1, rootList2, resRootList
        rootList1 = this.toElements(domain1)
        rootList2 = this.toElements(domain2)
        resRootList = [rootList1[0],
        rootList1[1].filter(unitId1 => {//在第一个domain1中寻找
            return rootList2[1].some(unitId2 => {//在第二个domain1至少存在一个
                return !this.compareElements([rootList1[0], unitId1], [rootList2[0], unitId2], domain1, domain2)//不是 两个树完全匹配的
            })
        })//
        ]

        //注意:Id为手动添加，可能不满足Domain的基本假设
        let resDomain = new Domain();
        resDomain.list[resRootList[0]] = new Module();
        resRootList[1].map(unitId1 => {

            resDomain.list[resRootList[0]].list[unitId1] = domain1.list[resRootList[0]].list[unitId1];
            this.domainAddTree(resDomain, [resRootList[0], unitId1], domain1);
        })
        //加入domain2
        resDomain.list[rootList2[0]] = new Module();
        rootList2[1].map(unitId2 => {

            resDomain.list[rootList2[0]].list[unitId2] = domain2.list[rootList2[0]].list[unitId2];
            this.domainAddTree(resDomain, [rootList2[0], unitId2], domain2);
        })
        //debugger
        return resDomain;
    }
    difference(domain1, domain2) {
        //差集
        let rootList1, rootList2, resRootList
        rootList1 = this.toElements(domain1)
        rootList2 = this.toElements(domain2)
        resRootList = [rootList1[0],
        rootList1[1].filter(unitId1 => {//在第一个domain1中寻找
            return rootList2[1].every(unitId2 => {//在第二个domain1所有都
                return !this.compareElements([rootList1[0], unitId1], [rootList2[0], unitId2], domain1, domain2)//不是 两个树完全匹配的
            })
        })//
        ]
        //注意:Id为手动添加，可能不满足Domain的基本假设
        let resDomain = new Domain();
        resDomain.list[resRootList[0]] = new Module();
        resRootList[1].map(unitId1 => {

            resDomain.list[resRootList[0]].list[unitId1] = domain1.list[resRootList[0]].list[unitId1];
            this.domainAddTree(resDomain, [resRootList[0], unitId1], domain1);
        })
        //debugger
        return resDomain;
    }
    domainAddTree(domain, elements,treeDomain) {//未包含根的unit和module
        let isLastBit1, nowUnit, moduleId, unitIndex, bitIndex, level, stack = []
        bitIndex = 0
        moduleId = elements[0]
        unitIndex = elements[1]
        do {
            if (unitIndex < treeDomain.find(moduleId).list.length) {
                nowUnit = treeDomain.find(moduleId).list[unitIndex];
            }
            else {
                break;
            }
            isLastBit1 = !(nowUnit.list[bitIndex + 1] !== undefined && nowUnit.list[bitIndex + 1] !== '')
            if (!isLastBit1) {//不是unit中最后一个有效数据

                level = treeDomain.find(moduleId).list[unitIndex].list[3];

                stack.push([moduleId, unitIndex, bitIndex + 1, level])//下次访问下一位
                moduleId = nowUnit.list[bitIndex];
                unitIndex = 1;
                bitIndex = 0;

            }
            
            if (isLastBit1) {//unit中最后一个有效数据
                //记录id
                if (domain.list[moduleId] === undefined) {
                    domain.list[moduleId] = treeDomain.find(moduleId);
                }
                
                [moduleId, unitIndex, bitIndex, level] = stack.pop();

            }



        } while (stack.length > 0)
    }

    toElements(domain) {
        let keys = Object.keys(domain.list)//获取根Id 依赖key顺序 不好
        let rootId = keys[1]
        let rootModule = domain.find(rootId)

        let unitIds=Array.from({ length: rootModule.list.length-1 }, (_, i) => i + 1);
        return [rootId,unitIds]
    }
    compareElements(elements1, elements2, domain1, domain2) {
        let stat=true
        let isLastBit1,nowUnit, moduleId, unitIndex, bitIndex, level, stack = []
        let isLastBit2,nowUnit2, moduleId2, unitIndex2, bitIndex2, level2, stack2 = []
        bitIndex = 0
        bitIndex2=0
        moduleId = elements1[0]
        unitIndex = elements1[1]
        moduleId2 = elements2[0]
        unitIndex2 = elements2[1]
        do {
            if ( unitIndex<domain1.find(moduleId).list.length ) {
                nowUnit = domain1.find(moduleId).list[unitIndex];
            }
            else {
                break;
            }
            if (unitIndex2 < domain2.find(moduleId2).list.length) {
                nowUnit2 = domain2.find(moduleId2).list[unitIndex2];
            }
            else {
                stat = false
                break;
            }
            isLastBit1 = !(nowUnit.list[bitIndex + 1] !== undefined && nowUnit.list[bitIndex + 1] !== '')
            isLastBit2 = !(nowUnit2.list[bitIndex2 + 1] !== undefined && nowUnit2.list[bitIndex2 + 1] !== '')
            if (!isLastBit1) {//不是unit中最后一个有效数据
                
                level = domain1.find(moduleId).list[unitIndex].list[3];
                //level2 = domain2.find(moduleId2).list[unitIndex2].list[3];
                
                stack.push([moduleId, unitIndex, bitIndex + 1, level])//下次访问下一位
                //stack2.push([moduleId2, unitIndex2, bitIndex2 + 1, level2])//下次访问下一位
                //初始化
                moduleId = nowUnit.list[bitIndex];
                unitIndex = 1;
                bitIndex = 0;

                //moduleId2 = nowUnit2.list[bitIndex2];
                //unitIndex2 = 1;
                //bitIndex2 = 0;

            }
            if (!isLastBit2) {//不是unit中最后一个有效数据

                level2 = domain2.find(moduleId2).list[unitIndex2].list[3];

                stack2.push([moduleId2, unitIndex2, bitIndex2 + 1, level2])//下次访问下一位
                //初始化

                moduleId2 = nowUnit2.list[bitIndex2];
                unitIndex2 = 1;
                bitIndex2 = 0;

            }
            if (isLastBit1 || isLastBit2) {//至少有一个树需要访问根节点
                if (isLastBit1 !== isLastBit2) {//如果不是两个树同时访问根节点
                    stat = false
                    break
                }
                if (nowUnit.list[bitIndex] !== nowUnit2.list[bitIndex2] || bitIndex !== bitIndex2) {//对比有效数据，和树分叉的数量
                    stat = false
                    break;
                }
            }
            if (isLastBit1) {//unit中最后一个有效数据
                //记录id
                
                [moduleId, unitIndex, bitIndex, level] = stack.pop();
                //[moduleId2, unitIndex2, bitIndex2, level2] = stack2.pop();

            }

            
            if (isLastBit2) {//unit中最后一个有效数据
                //记录id
                [moduleId2, unitIndex2, bitIndex2, level2] = stack2.pop();

            }

        } while (stack.length > 0 && stack2.length > 0)
        if (stack.length > 0 || stack2.length > 0) {//有树没有遍历完
            stat = false
        }
        return stat
    }
   
}
