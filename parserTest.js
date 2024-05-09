import RulesSplit from "./RulesSplitNode.js"
import Yacc from "./YaccNode.js"
let rulesSplit = new RulesSplit();
console.log(rulesSplit.rules)
//console.log(JSON.stringify(rulesSplit.rules[2], null, 2))
let yacc = new Yacc();
const wordsIds1 = [{ type: '名词', data: 'A' }, { type: '的', data: '的' }, { type: '名词', data: 'B' }]; 
const wordsIds2 = [{ type: '动词', data: '删除' }, { type: '名词', data: '节点A' }];
const wordsIds3 = [{ type: '把', data: '把' }, { type: '名词', data: '节点A' }, { type: '动词', data: '删除' }];
const wordsIds4 = [{ type: '名词', data: '节点A' }, { type: '和', data: '和' }, { type: '名词', data: '节点B' }];
const wordsIds5 = [{ type: '动词', data: '删除' }, { type: '名词', data: '节点A' },{ type: '符号', data: '。' }];
const wordsIds6 = [{ type: '名词', data: '节点A' }, { type: '名词', data: '节点B' }];
const tree = yacc.run(wordsIds5, rulesSplit.rules);
console.log(tree) 
console.log(JSON.stringify(tree,null,2)) 
