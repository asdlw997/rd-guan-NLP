import Module from "./str/Module.js";
import Dictionary from "./wordParticiple.js";
export default class KnowledgeGraph {
    constructor() {
        this.input = []//0 三元组表
        this.output = []//0 module
        this.TriadsList = []
        this.dictionary = new Dictionary()
    }
    setDictionary(dictionary) {
        this.dictionary = dictionary;//复制引用！！！
    }
    addTriad(scenes1, word1, scenes2, word2, scenes3, word3) {
        if (this.dictionary === undefined) {
            return;//无词典情况
        }
        let is = false;
        if (!this.dictionary.isWordHasScenes(scenes1, word1)) {
            this.dictionary.addWoldFullInfo_1part1methodObj_WithScenes(word1, null, null, null, scenes1, null)
        }
        if (!this.dictionary.isWordHasScenes(scenes2, word2)) {
            this.dictionary.addWoldFullInfo_1part1methodObj_WithScenes(word2, null, null, null, scenes2, null)
        }
        if (!this.dictionary.isWordHasScenes(scenes3, word3)) {
            this.dictionary.addWoldFullInfo_1part1methodObj_WithScenes(word3, null, null, null, scenes3, null)
        }
        this.TriadsList.push([scenes1, word1, scenes2,word2, scenes3, word3])
    }
    toModule() {
        let scenesId
        let datamodule = new Module();
        this.TriadsList.forEach(Triad => {
            scenesId = getLegalId(datamodule)
            this.TriadsList.push([scenesId, Triad[0], Triad[1], Triad[2]])
            scenesId = getLegalId(datamodule)
            this.TriadsList.push([scenesId, Triad[3], Triad[4], Triad[5]])
        })
        return datamodule;
    }
    fromModule(datamodule) {

    }
    isTriadExist(scenes1, word1, scenes2, word2, scenes3, word3) {
        return this.TriadsList.some(Triad => {
            return ((Triad[0] === scenes1) &&
                (Triad[1] === word1) &&
                (Triad[2] === scenes2) &&
                (Triad[3] === word2) &&
                (Triad[4] === scenes3) &&
                (Triad[5] === word3)) 
        })
    }
    getLegalId(datamodule) {
        let i = 0;
        let obj;
        do {
            i++;
            obj = datamodule.data.find(unit => {
                return (unit[0] === i);
            });
        } while (obj !== undefined)
        return i;
    }
}