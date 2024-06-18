import Dictionary, { Tokenizer } from "./wordParticiple.js"
import Command from "./CommandNode.js"
import RulesSplit from "./RulesSplitNode.js"
import Yacc from "./YaccNode.js"
import Switch from "./SwitchNode.js"
import Unit from "./str/Unit.js";
import MatchCriteria from"./MatchCriteria.js"
let data = [];
let partSpeech = [];
let methodObj = [];
let res,tree1,tree2;
let module,domain;  

let testDictionary = new Dictionary();
testDictionary.addWoldFullInfo_1part1methodObj_WithScenes("节点A", "名词", null, null, "网页编程", "类");
debugger
testDictionary.addWoldFullInfo_1part1methodObj_WithScenes("节点B", "名词", "节点B(对象)", "O", null, null);
debugger
testDictionary.addWoldFullInfo_1part1methodObj_WithScenes("节点C", "名词", null, null, null, null);
debugger
testDictionary.addWoldFullInfo_1part1methodObj_WithScenes("节点D", "名词", "节点D(对象)", "O", "网页编程", "类");
debugger
testDictionary.addWoldFullInfo_1part1methodObj_WithScenes("节点D", "名词", "节点D(对象)", "O", "网页编程2", "类");
debugger
testDictionary.addWoldFullInfo_1part1methodObj_WithScenes("节点D", "名词", "节点D(对象)", "O", "网页编程", "类");
debugger

let dictionary = new Dictionary();
let woldFullInfo = [
    ["节点A", "名词", "节点A(对象)", "O"],
    ["节点B", "名词", "节点B(对象)", "O"],
    ["连接", "动词", "连接(方法)", "M"],
    ["连接", "动词", "连接(方法)", "O"],
    ["创建", "动词", "创建(方法)", "M"],
    ["删除", "动词", "删除(方法)", "M"],
    ["把", "把", "把结构", "C"],
    ["和", "和", "和结构", "C"],
    ["的", "的", "的结构", "C"],
    ["到", "到", "到结构", "C"],
    ["输入", "名词", "输入(对象)", "O"],
    ["输出", "名词", "输出(对象)", "O"],
    [",", "符号", ",结构", "C"],
    ["，", "符号", "，结构", "C"],
    ["。", "符号", "。结构", "C"]
]
dictionary.input[0] = woldFullInfo;
domain = new Domain();
dictionary.input[1] = domain;
/*
dictionary.addWoldFullInfo("节点A", "名词", "节点A(对象)", "O");
dictionary.addWoldFullInfo("节点B", "名词", "节点B(对象)", "O");
dictionary.addWoldFullInfo("连接", "动词", "连接(方法)", "M");
dictionary.addWoldFullInfo("连接", "动词", "连接(方法)", "O");
dictionary.addWoldFullInfo("创建", "动词", "创建(方法)", "M");
dictionary.addWoldFullInfo("删除", "动词", "删除(方法)", "M");
dictionary.addWoldFullInfo("把", "把", "把结构", "C");
dictionary.addWoldFullInfo("和", "和", "和结构", "C");
dictionary.addWoldFullInfo("的", "的", "的结构", "C");
dictionary.addWoldFullInfo("输入", "名词", "输入(对象)", "O");
dictionary.addWoldFullInfo("输出", "名词", "输出(对象)", "O");
dictionary.addWoldFullInfo(",", "符号", ",结构", "C");
dictionary.addWoldFullInfo("，", "符号", "，结构", "C");
dictionary.addWoldFullInfo("。", "符号", "。结构", "C");*/

dictionary.run()
let id = dictionary.findWordId('节点A')
//近义词
let matchCriteria = new MatchCriteria();
matchCriteria.input[0] = [['节点A', '节点B'], ['输入', '输出'], ['输出', '输入'], ['创建', '添加']];
matchCriteria.input[1] = dictionary;
module = matchCriteria.run()
debugger
res = matchCriteria.isSynonyms('节点A', '输入', module, dictionary);
res = matchCriteria.isSynonyms('输出', '输入', module, dictionary);
debugger
//Tokenizer节点
let tokenizer = new Tokenizer();
//"连接节点A的输入和节点B的输出，创建节点C。"
//tokenizer.input[0] = "节点A和节点B。";

tokenizer.input[0] = "创建节点A的输出。删除节点A。把节点A删除。";
tokenizer.input[1] = dictionary.output[0];

tokenizer.run();
res = JSON.stringify(tokenizer.output[0], null, 2);
console.log("\" ", tokenizer.input[0], "\"的分词结果是", res)

//debugger

//语法分析
let rulesSplit = new RulesSplit();
let yacc = new Yacc();
yacc.input[0] = tokenizer.output[0];
yacc.input[1] = rulesSplit.rules;
yacc.run();
console.log("语法树是",JSON.stringify(yacc.output[0], null, 2))

//处理语法树
let switch1 = new Switch();
switch1.input[0] = yacc.output[0]
switch1.run()
tree1 = switch1.output[0]
//重复流程
//创建节点B的输入。
tokenizer.input[0] = "删除节点A。创建节点A的输出。创建节点A的输入。";
tokenizer.run();
yacc.input[0] = tokenizer.output[0];
yacc.run();
switch1.input[0] = yacc.output[0]
switch1.run();
tree2 = switch1.output[0]
//debugger

//集合操作
import SetOperator from "./SetOperations.js"
let setOperator = new SetOperator()
setOperator.toElements(tree1)
//交集
domain = setOperator.intersection(tree2, tree1)
debugger
//并集
domain = setOperator.union(tree2, tree1)
debugger
//差集
domain = setOperator.difference(tree2, tree1)
debugger
domain = new Domain();
setOperator.domainAddTree(domain, [2, 2], tree1)
debugger
//转指令
let command = new Command();
command.input[0] = switch1.output[0]
command.run()
res = command.output[0]
console.log("转指令是", JSON.stringify(command.output[0], null, 2))
//debugger

//debugger
//词典转领域
import Domain from "./str/Domain.js";


domain = dictionary.toDomain();

//debugger
//测试节点合并
const func = (word, wordId) => { console.log(wordId, word); };//定义打印函数



let dictionary1 = new Dictionary();
dictionary1.addWoldFullInfo("节点A", "名词", "节点A(对象)", "O");
dictionary1.addWoldFullInfo("节点B", "名词", "节点B(对象)", "O");
dictionary1.addWoldFullInfo("节点C", "名词", "节点C(对象)", "O");
let dictionary2 = new Dictionary();
dictionary2.addWoldFullInfo("节点A", "名词", "节点A1(对象)", "O");
dictionary2.addWoldFullInfo("节点B", "动词", "节点B(方法)", "M");
dictionary2.addWoldFullInfo("节点C", "动词", "节点C(方法)", "M");
dictionary2.addWoldFullInfo("节点D", "名词", "节点D(对象)", "O");
console.log("词典1")
dictionary1.listWord("", null, func)
//debugger
dictionary1.combine(dictionary2);
console.log("词典合并后")
dictionary1.listWord("", null, func)

//debugger
let dictionary3=new Dictionary();
dictionary3.fromDomain(domain);
domain = new Domain();
dictionary3.fromDomain(domain);
//

debugger





