import Module from "./str/Module.js";
import Dictionary from "./wordParticiple.js";
export default class KnowledgeGraph {
    constructor() {
        this.input = []//0 三元组表
        this.output = []//0 module
        this.TriadsList = []
        this.dictionary = new Dictionary()
        this.scenes="" //“”：默认场景    “空字符串”：空字符串      “多一个参数”：新引进参数 
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
    filterWithScenes(...args) {//(scenes1, word1, scenes2,word2, scenes3, word3,[mask])
        let Triads=[]
        if (this.scenes === '') {//全匹配（默认）
            Triads = this.TriadsList.filter(Triad => {
                let stat = true
                for (let i = 0; i < 6; i++) {
                    stat = stat && (Triad[i] === args[i])
                }
                return stat 
            })
        }
        if (this.scenes === '空字符串') {
            Triads = this.TriadsList.filter(Triad => {
                let stat=true
                for (let i = 0; i < 6; i++) {
                    if (args[i] !== '') {//匹配非空字符串
                        stat = stat && (Triad[i] === args[i])
                    }
                }
                return stat 
            })
        }
        if (this.scenes === '多一个参数') {
            let mask = args[6]
            Triads = this.TriadsList.filter(Triad => {
                let stat = true
                for (let i = 0; i < 6; i++) {
                    if (mask[i] === true) {//匹配mask中为真的位置
                        stat = stat && (Triad[i] === args[i])
                    }
                }
                return stat 
            })
        }
        return Triads 
    }
    filter1(scenes, word) {
        let HeaderTriads=this.TriadsList.filter(Triad => {
            return (Triad[0] === scenes) && (Triad[1] === word)
        })
        let Tail = this.TriadsList.filter(Triad => {
            return (Triad[4] === scenes) && (Triad[5] === word)
        })
        
        return HeaderTriads.concat(Tail);
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