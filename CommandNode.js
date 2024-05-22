import Module from "./str/Module.js";
import Unit from "./str/Unit.js";
import Domain from "./str/Domain.js";
 


export default class Command {
    constructor() {
        this.input = []//0 处理后的语法树的domain
        this.output=[]//0 指令列表

    }
    run() {
        let domain1 = this.input[0]
        let rootId = 2
        let res=[]
        let resList = []
        let moduleId, unitIndex, bitIndex, level, stack = [], statsList;
        let bitValue, nowUnit
        let keys = Object.keys(domain1.list)//获取根Id 依赖key顺序 不好
        rootId=keys[1]
        for (let i = 1; i < domain1.find(rootId).list.length; i++) {
            res = []
            moduleId = rootId;
            unitIndex = i;
            bitIndex = 0;

            do {
                if (domain1.find(moduleId).list.length > unitIndex) {
                    nowUnit = domain1.find(moduleId).list[unitIndex];
                }
                else {
                    break;
                }
                if (nowUnit.list[bitIndex + 1] !== undefined && nowUnit.list[bitIndex + 1] !== '') {//不是unit中最后一个有效数据
                    level = domain1.find(moduleId).list[unitIndex].list[3];
                    stack.push([moduleId, unitIndex, bitIndex + 1, level])//下次访问下一位
                    //初始化
                    moduleId = nowUnit.list[bitIndex];
                    unitIndex = 1;
                    bitIndex = 0;

                }
                else {//unit中最后一个有效数据
                    if (bitIndex === 0) {
                        let bit0 = domain1.find(moduleId).list[unitIndex].list[0]
                        if (bit0 !== '0') {
                            res.push(domain1.find(moduleId).list[unitIndex].list[0]);
                        }
                        [moduleId, unitIndex, bitIndex, level] = stack.pop();
                    } else {
                        [moduleId, unitIndex, bitIndex, level] = stack.pop();
                    }
                }

            } while (stack.length > 0)
            if (res.length !== 0) resList.push(res);
        }
        this.output[0]=resList
    }
}

