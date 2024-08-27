import DimensionValidation from "./dimensionValidation.js";
import KnowledgeGraph from "./KnowledgeGraph.js"
import AddTriadList from './AddTriadListNode.js'
let res
let dimensionValidation = new DimensionValidation()
let wordList1 = [['A', 2],
    ['B', 3],
    ['C', 5],
    ['D', 7],
    ['E', 11],
    ['F', 15],
    ['G', 17],
    ['H', 33],
    ['I', 105]
]
let wordList2 = [['A', 2],
['C', 5],
['D', 7],
['E', 11],
['F', 15],
['G', 17],
['H', 33],
['I', 105]
]
let threeDimensions1 = [['维度A', 2],
    ['维度B', 3],
    ['维度C', 5],
]
let threeDimensions2 = [['维度A', 6],
['维度B', 85],
['维度C', 77],
]
let threeDimensions3 = [['维度A', 6, '维度', 3],
    ['维度A', 6, '维度', 2],
    ['维度B', 85, '维度', 5],
    ['维度B', 85, '维度', 17],
    ['维度C', 77, '维度', 7],
    ['维度C', 77, '维度', 11]
]
let threeDimensions4 = [['维度A', 6, '维度3', 3, '维度2', 2],
    ['维度B', 85, '维度5', 5, '维度17', 17],
    ['维度C', 77, '维度7', 7, '维度11', 11]
]
let knowledgeGraph1 = new KnowledgeGraph();
let knowledgeGraph2 = new KnowledgeGraph();
let knowledgeGraph3 = new KnowledgeGraph();
let knowledgeGraph4 = new KnowledgeGraph();
let addTriadList = new AddTriadList()
let TriadList1 = [['维度领域', '维度A', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度A', '维度领域', '维度数字', '维度领域', '6'],
    ['维度领域', '维度A', '维度领域', '连接', '维度领域', '连接维度AB'],
    ['维度领域', '维度A', '维度领域', '连接', '维度领域', '连接维度AC'],
    ['维度领域', '维度A', '维度领域', '映射', '维度领域', '词典维度A'],
    ['维度领域', '连接维度AB', '维度领域', '实例化类型', '维度领域', '维度连接'],
    ['维度领域', '连接维度AB', '维度领域', '连接上游', '维度领域', '维度A'],
    ['维度领域', '连接维度AB', '维度领域', '连接下游', '维度领域', '维度B'],
    ['维度领域', '连接维度AC', '维度领域', '实例化类型', '维度领域', '维度连接'],
    ['维度领域', '连接维度AC', '维度领域', '连接上游', '维度领域', '维度A'],
    ['维度领域', '连接维度AC', '维度领域', '连接下游', '维度领域', '维度C'],
    ['维度领域', '维度B', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度B', '维度领域', '维度数字', '维度领域', '3'],
    ['维度领域', '维度B', '维度领域', '映射', '维度领域', '词典维度B'],
    ['维度领域', '维度C', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度C', '维度领域', '维度数字', '维度领域', '3'],
    ['维度领域', '维度C', '维度领域', '映射', '维度领域', '词典维度B'],
];
let TriadList2 = [['维度领域', '词A', '维度领域', '实例化类型', '维度领域', '词'],
    ['维度领域', '词A', '维度领域', '维度数字', '维度领域', '35'],
    ['维度领域', '词A', '维度领域', '连接', '维度领域', '连接词AB'],
    ['维度领域', '词A', '维度领域', '连接', '维度领域', '连接词AC'],
    ['维度领域', '连接词AB', '维度领域', '实例化类型', '维度领域', '词连接'],
    ['维度领域', '连接词AB', '维度领域', '连接上游', '维度领域', '词A'],
    ['维度领域', '连接词AB', '维度领域', '连接下游', '维度领域', '词B'],
    ['维度领域', '连接词AC', '维度领域', '实例化类型', '维度领域', '词连接'],
    ['维度领域', '连接词AC', '维度领域', '连接上游', '维度领域', '词A'],
    ['维度领域', '连接词AC', '维度领域', '连接下游', '维度领域', '词C'],
    ['维度领域', '词B', '维度领域', '实例化类型', '维度领域', '词'],
    ['维度领域', '词B', '维度领域', '维度数字', '维度领域', '5'],
    ['维度领域', '词C', '维度领域', '实例化类型', '维度领域', '词'],
    ['维度领域', '词C', '维度领域', '维度数字', '维度领域', '7'],
];
let TriadList4 = [['维度领域', '维度A', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度A', '维度领域', '维度数字', '维度领域', '6'],
    ['维度领域', '维度A', '维度领域', '连接', '维度领域', '连接维度AB'],
    ['维度领域', '维度A', '维度领域', '连接', '维度领域', '连接维度AC'],
    ['维度领域', '维度A', '维度领域', '映射', '维度领域', '词典维度A'],
    ['维度领域', '连接维度AB', '维度领域', '实例化类型', '维度领域', '维度连接'],
    ['维度领域', '连接维度AB', '维度领域', '连接上游', '维度领域', '维度A'],
    ['维度领域', '连接维度AB', '维度领域', '连接下游', '维度领域', '维度B'],
    ['维度领域', '连接维度AC', '维度领域', '实例化类型', '维度领域', '维度连接'],
    ['维度领域', '连接维度AC', '维度领域', '连接上游', '维度领域', '维度A'],
    ['维度领域', '连接维度AC', '维度领域', '连接下游', '维度领域', '维度C'],
    ['维度领域', '维度B', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度B', '维度领域', '维度数字', '维度领域', '3'],
    ['维度领域', '维度B', '维度领域', '映射', '维度领域', '词典维度B'],
    ['维度领域', '维度B', '维度领域', '连接', '维度领域', '连接维度BD'],
    ['维度领域', '维度B', '维度领域', '连接', '维度领域', '连接维度BE'],
    ['维度领域', '维度C', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度C', '维度领域', '维度数字', '维度领域', '3'],
    ['维度领域', '维度C', '维度领域', '映射', '维度领域', '词典维度C'],
    ['维度领域', '连接维度BD', '维度领域', '实例化类型', '维度领域', '维度连接'],
    ['维度领域', '连接维度BD', '维度领域', '连接上游', '维度领域', '维度B'],
    ['维度领域', '连接维度BD', '维度领域', '连接下游', '维度领域', '维度D'],
    ['维度领域', '连接维度BD', '维度领域', '优先级', '维度领域', '低'],
    ['维度领域', '连接维度BE', '维度领域', '实例化类型', '维度领域', '维度连接'],
    ['维度领域', '连接维度BE', '维度领域', '连接上游', '维度领域', '维度B'],
    ['维度领域', '连接维度BE', '维度领域', '连接下游', '维度领域', '维度E'],
    ['维度领域', '连接维度BE', '维度领域', '优先级', '维度领域', '低'],
    ['维度领域', '维度D', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度D', '维度领域', '维度数字', '维度领域', '3'],
    ['维度领域', '维度D', '维度领域', '映射', '维度领域', '词典维度D'],
    ['维度领域', '维度E', '维度领域', '实例化类型', '维度领域', '维度'],
    ['维度领域', '维度E', '维度领域', '维度数字', '维度领域', '3'],
    ['维度领域', '维度E', '维度领域', '映射', '维度领域', '词典维度E'],
];

addTriadList.input[0] = TriadList1
addTriadList.run()
knowledgeGraph1.TriadsList=knowledgeGraph1.fromModule(addTriadList.output[0])
dimensionValidation.findDimensionSet(knowledgeGraph1)
dimensionValidation.findDimensionLinkSet(knowledgeGraph1)
dimensionValidation.checkingLinkofDimensions(knowledgeGraph1)
dimensionValidation.checkingDimensionofLinks(knowledgeGraph1)
dimensionValidation.checkDimensionNumbersForDimension(knowledgeGraph1)
dimensionValidation.multiplicationCheckForDimension(knowledgeGraph1)
dimensionValidation.mappingCheckForDimension(knowledgeGraph1)

debugger

addTriadList.input[0] = TriadList2
addTriadList.run()
knowledgeGraph2.TriadsList = knowledgeGraph2.fromModule(addTriadList.output[0])
dimensionValidation.findWordSet(knowledgeGraph2)
dimensionValidation.findWordLinkSet(knowledgeGraph2)
dimensionValidation.checkingLinkofWords(knowledgeGraph2)
dimensionValidation.checkingWordofLinks(knowledgeGraph2)
dimensionValidation.checkDimensionNumbersForWord(knowledgeGraph2)
debugger

let TriadList3 = [...TriadList1, ...TriadList2]
addTriadList.input[0] = TriadList3
addTriadList.run()
knowledgeGraph3.TriadsList = knowledgeGraph3.fromModule(addTriadList.output[0])

res = dimensionValidation.generalcheck(knowledgeGraph3)
debugger    

addTriadList.input[0] = TriadList4
addTriadList.run()
knowledgeGraph4.TriadsList = knowledgeGraph4.fromModule(addTriadList.output[0])
res = dimensionValidation.depthDetection(knowledgeGraph4, '维度A', '维度')
res = dimensionValidation.depthDetection(knowledgeGraph4, '维度B')
dimensionValidation.compareInfo(knowledgeGraph1, knowledgeGraph4, '维度A')
res = dimensionValidation.compare(knowledgeGraph1, knowledgeGraph3, '维度A')
debugger
res = dimensionValidation.compare(knowledgeGraph1, knowledgeGraph4, '维度A')

debugger

let resList = []
resList.push(dimensionValidation.validation(wordList1, threeDimensions1))
resList.push(dimensionValidation.validation(wordList1, threeDimensions2))
resList.push(dimensionValidation.validation(wordList2, threeDimensions2))

debugger
dimensionValidation.validation1(wordList1, threeDimensions3)
console.log(resList)
debugger
