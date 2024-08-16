export default class DimensionValidation {
    constructor() {

    }
    validation(wordList, threeDimensions) {
        let wordBaseList=[]
        wordList.forEach(word => {
            wordBaseList.push(this.primeFactors(word[1]))
        })
        let threeDimensionsBaseList = []
        threeDimensions.forEach(dimension => {
            threeDimensionsBaseList.push(this.primeFactors(dimension[1]))
        })
        if (!this.areAllElementsInNestedList(wordBaseList, threeDimensionsBaseList)) {
            return false
        }
        if (!this.basicDimensionDefinitionCheck(wordList, threeDimensionsBaseList)) {
            return false
        }
        return true
    }
    primeFactors(n) {
        const factors = [];

        // 处理 2 这个质数
        while (n % 2 === 0) {
            factors.push(2);
            n = Math.floor(n / 2);
        }

        // 处理其他质数
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
            while (n % i === 0) {
                factors.push(i);
                n = Math.floor(n / i);
            }
        }

        // 如果 n 是一个质数且大于 2
        if (n > 2) {
            factors.push(n);
        }

        return factors;
    }
    basicDimensionDefinitionCheck(wordList, threeDimensionsBaseList) {

        const wordSet = new Set(wordList.map(word => { return word[1] }).flat());
        const dimensionsBaseSet = new Set(threeDimensionsBaseList.flat());
        for (let dimensionsBase of dimensionsBaseSet) {
            if (!wordSet.has(dimensionsBase)) {
                return false;
            }
        }
        return true;
    }
    areAllElementsInNestedList(nestedList1, nestedList2) {
        // 将 nestedList2 扁平化为一维数组，并存储到 Set 中
        const set = new Set(nestedList2.flat());

        // 遍历 nestedList1 并检查所有元素是否都存在于 Set 中
        for (let sublist of nestedList1) {
            for (let element of sublist) {
                if (!set.has(element)) {
                    return false; // 如果有任意一个元素不在 set 中，返回 false
                }
            }
        }

        return true; // 如果所有元素都在 set 中，返回 true
    }
}