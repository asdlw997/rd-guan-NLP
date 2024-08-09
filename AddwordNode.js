import Dictionary from "./Dictionary.js"
export default class Addword{
    constructor() {
        this.input = []//0 新加词信息列表 1 词典领域(可传入空领域)
        this.output = []//0 词典领域
        this.dictionary = new Dictionary()
    }
    run() {
        this.dictionary.fromDomain(this.input[1]);
        this.input[0].map((woldFullInfo) => {
            this.dictionary.addWoldFullInfo_1part1methodObj_WithScenes(...woldFullInfo)
        })
        this.output[0] = this.dictionary.toDomain();
    }
}