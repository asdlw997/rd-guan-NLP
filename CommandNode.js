import Module from "./str/Module.js"; import Unit from "./str/Unit.js"; import Domain from "./str/Domain.js";    export default class Command {     constructor() {         this.input = []//0 处理后的语法树的domain         this.output=[]//0 指令列表      }     run() {         let domain1 = this.input[0]         let rootId = 2         let res=[]         let resList = []         let moduleId, unitIndex, bitIndex, level, stack = [], statsList;         let bitValue         for (let i = 1; i < domain1.find(rootId).list.length; i++) {             res = []             moduleId = rootId;             unitIndex = i;             bitIndex = 0;              do {                 if (domain1.find(moduleId).list.length > unitIndex) {                     bitValue = domain1.find(moduleId).list[unitIndex].list[bitIndex];                 }                 else {                     break;                 }                 if (bitValue !== 0) {                     level = domain1.find(moduleId).list[unitIndex].list[3];                     stack.push([moduleId, unitIndex, bitIndex + 1, level])//下次访问下一位                     //初始化                     moduleId = bitValue;                     unitIndex = 1;                     bitIndex = 0;                  }                 else {                     if (bitIndex === 0) {                         let bit3 = domain1.find(moduleId).list[unitIndex].list[3]                         if (bit3 !== '0') {                             res.push(domain1.find(moduleId).list[unitIndex].list[3]);                         }                         [moduleId, unitIndex, bitIndex, level] = stack.pop();                     } else {                         [moduleId, unitIndex, bitIndex, level] = stack.pop();                     }                 }              } while (stack.length > 0)             if (res.length !== 0) resList.push(res);         }         this.output[0]=resList     } }  