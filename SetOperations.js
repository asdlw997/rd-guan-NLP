import Domain from "./str/Domain.js";
export default class SetOperator {
    constructor() {
        this.input = []//0 抽象语法树1 1 抽象语法树2
        this.output = []//0 集合操作后的抽象语法树
    }
    run() {

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
        let nowUnit, moduleId, unitIndex, bitIndex, level, stack = []
        let nowUnit2, moduleId2, unitIndex2, bitIndex2, level2, stack2 = []
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
            if (nowUnit.list[bitIndex + 1] !== undefined && nowUnit.list[bitIndex + 1] !== '') {//不是unit中最后一个有效数据
                
                level = domain1.find(moduleId).list[unitIndex].list[3];
                level2 = domain2.find(moduleId2).list[unitIndex2].list[3];
                
                stack.push([moduleId, unitIndex, bitIndex + 1, level])//下次访问下一位
                stack2.push([moduleId2, unitIndex2, bitIndex2 + 1, level2])//下次访问下一位
                //初始化
                moduleId = nowUnit.list[bitIndex];
                unitIndex = 1;
                bitIndex = 0;

                moduleId2 = nowUnit2.list[bitIndex2];
                unitIndex2 = 1;
                bitIndex2 = 0;

            }
            else {//unit中最后一个有效数据
                //记录id
                if (nowUnit.list[bitIndex] !== nowUnit2.list[bitIndex2] || bitIndex !== bitIndex2) {//对比有效数据，和树分叉的数量
                    stat=false
                }
                [moduleId, unitIndex, bitIndex, level] = stack.pop();
                [moduleId2, unitIndex2, bitIndex2, level2] = stack2.pop();

            }

        } while (stack.length > 0)
        return stat
    }
   
}
