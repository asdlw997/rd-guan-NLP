import Module from "./str/Module.js";
import Unit from "./str/Unit.js";
import Dictionary from "./Dictionary.js"
export default class KnowledgeGraph {
    constructor() {
        this.input = []//0 三元组表 1 词典领域
        this.output = []//0 module 1 词典领域
        this.TriadsList = []
        this.dictionary = new Dictionary()
        this.scenes="" //“”：默认场景    “空字符串”：空字符串      “多一个参数”：新引进参数 
    }
    setDictionary(dictionary) {
        this.dictionary = dictionary;//复制引用！！！
    }
    run() {
        this.dictionary.fromDomain(this.input[1]);
        this.input[0].map((Triad) => {
            this.addTriad(...Triad)
        })
        this.output[0] = this.toModule()
        this.output[1] = this.dictionary.toDomain()
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
    addTriadList(triadList) {
        triadList.forEach(triad => {
            this.addTriad(...triad)
        })
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
    combine(TriadsList) {
        this.addTriadList(TriadsList)
    }
    toModule() {
        let scenesId
        let datamodule = new Module();
        this.TriadsList.forEach(Triad => {
            scenesId = this.getLegalId(datamodule)
            datamodule.list.push(new Unit( scenesId, Triad[0], Triad[1], Triad[2]))
            scenesId = this.getLegalId(datamodule)
            datamodule.list.push(new Unit(scenesId, Triad[3], Triad[4], Triad[5]))
        })
        return datamodule;
    }
    fromModule(datamodule) {
        let triadsList = []
        
        let sortedUnits = this.sortAndTraverseById(datamodule)
        this.processOddAndEvenPairs(sortedUnits, (oddItem, evenItem) => {
            triadsList.push([oddItem[1], oddItem[2], oddItem[3], evenItem[1], evenItem[2], evenItem[3]])
        })
        return triadsList
    }
    processOddAndEvenPairs(items,func) {
        let i = 0;

        while (i < items.length) {
            // 处理id是奇数的元素
            if (items[i][0] % 2 !== 0) {
                const oddItem = items[i];
                let evenItem = null;

                // 检查下一个元素是否存在且为偶数
                if (i + 1 < items.length && items[i + 1][0] % 2 === 0) {
                    evenItem = items[i + 1];
                    items.splice(i, 2);  // 移除奇数和偶数元素
                } else {
                    items.splice(i, 1);  // 仅移除奇数元素
                }

                // 处理奇数和偶数元素
                func(oddItem, evenItem)
            } else {
                i++;  // 当前元素不是奇数，继续下一个
            }
        }

        return items;
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
            obj = datamodule.list.find(unit => {
                return (unit.list[0] === i);
            });
        } while (obj !== undefined)
        return i;
    }
    sortAndTraverseById(module) {
        let sortedUnits = module.list.sort((a, b) => a.list[0] - b.list[0]);
        sortedUnits = sortedUnits.map(unit => {
            return unit.list
        })
        return sortedUnits
    }
}