import DimensionValidation from "./dimensionValidation.js";

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
let resList = []
resList.push(dimensionValidation.validation(wordList1, threeDimensions1))
resList.push(dimensionValidation.validation(wordList1, threeDimensions2))
resList.push(dimensionValidation.validation(wordList2, threeDimensions2))
console.log(resList)
debugger
