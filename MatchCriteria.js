import Dictionary from "./wordParticiple.js"
import Module from "./str/Module.js";
import Unit from "./str/Unit.js";
export default class MatchCriteria {
    constructor() {
        this.input = []//0 近义词表([[词A，词B],[...],...]) 1词典
        this.output = []//0 指令列表
        this.dictionary = new Dictionary();
        this.synonymsList = [];
    }
    run() {
        //把近义词表写入标准格式
        this.synonymsList = this.input[0]
        this.dictionary = this.input[1]
        let module = new Module();
        this.synonymsList.forEach(synonyms => {
            let wordIdA = this.dictionary.findWordId(synonyms[0])
            let wordIdB = this.dictionary.findWordId(synonyms[1])
            if (wordIdA === null) {
                this.dictionary.addWord(synonyms[0])
                wordIdA = this.dictionary.findWordId(synonyms[0])
            }
            if (wordIdB === null) {
                this.dictionary.addWord(synonyms[1])
                wordIdB = this.dictionary.findWordId(synonyms[1])
            }
            let dataId = this.getLegalId(module);
            if (wordIdA < wordIdB) {
                if (!module.list.some(unit => {
                    return unit.list[1] === wordIdA && unit.list[2] === wordIdB
                })) {
                    module.addUnit(new Unit(dataId, wordIdA, wordIdB))
                }
                
                
            } else {
                if (!module.list.some(unit => {
                    return unit.list[1] === wordIdB && unit.list[2] === wordIdA
                })) {
                    module.addUnit(new Unit(dataId, wordIdB, wordIdA))
                }
                
                
            }
            
            
        })
        return module;
    }
    getLegalId(module) {
        let i = 0;
        let obj;
        do {
            i++;
            obj = module.list.find(unit => {
                return (unit.list[0] === i);
            });
        } while (obj !== undefined)
        return i;
    }
}