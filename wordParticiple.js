import Module from "./str/Module.js";
import Unit from "./str/Unit.js";
import Domain from "./str/Domain.js";

export default class Tokenizer {
    constructor() {
        this.input = [];//inputId说明,  0:str(字符串) 1:domain(词典) 
        this.output = [];//outputId说明 0:result(分词结果)
        this.dictionary = undefined;
        this.data = [];
        this.partSpeech = [];
        this.methodObj = [];
        this.defaultpartSpeech = '名词'             //默认词性
    }

    formNoWordStr(noWordStr) {//不在词典的词的输出格式
        return { type: this.defaultpartSpeech, data: noWordStr };
    }
    formWordStr(word, wordId) {//在词典的词的输出格式
        return {
            type: this.findPartWordList(wordId)[0],
            data: word
            /*,  methodObj:dictionary.findMethodObjList(wordInfos[1])[0] */
        }
    }
    fromDomain(domain) {
        let keys = ["a", "b", "c", "d"]
        let ModuleTree = domain.find(2);
        this.data = ModuleTree.list.map((unit) => {
            let list = unit.list.map((value, index) => [keys[index], value])
            return Object.fromEntries(list);
        })
        let ModulePartSpeech = domain.find(3);
        this.partSpeech = ModulePartSpeech.list.map((unit) => {
            let list = unit.list.map((value, index) => [keys[index], value])
            return Object.fromEntries(list);
        })
        let ModuleMethodObj = domain.find(4);
        this.methodObj = ModuleMethodObj.list.map((unit) => {
            let list = unit.list.map((value, index) => [keys[index], value])
            return Object.fromEntries(list);
        })
    }
    findLongestWord(str, startIndex) {
        let word = "";
        let wordId = null;
        let wordEndIndex = null;
        let _str = "";
        let nodeId = null;
        for (let nowIndex = startIndex; nowIndex < str.length; nowIndex++) {
            let character = str[nowIndex];
            nodeId = this.findNextNodeId(character, nodeId);
            if (nodeId === null) {
                break;
            } else {
                _str += character;
                if (this.isWordEnd(nodeId)) {
                    word = _str;
                    wordEndIndex = nowIndex;
                    wordId = nodeId;
                } 
            }
        }
        return [word, wordId, wordEndIndex];
    }

    findNextPartList(partOfLast2word, partPredictionList) {
        let partPrediction = partPredictionList.find(list => list[0] === partOfLast2word[0] && list[1] === partOfLast2word[1]);
        if (partPrediction === undefined) {
            return null;
        } 
        return partPrediction[2];//返回预测词性列表
    }

    findAWord(str, startIndex, result) {//返回[word, wordId, wordEndIndex(在字符串中)]
            return this.findLongestWord(str, startIndex);
    }
   
    splitString(str) {
        let nowIndex = -1;
        let noWordStr = "";
        let result = [];
        while (nowIndex < str.length) {
            nowIndex++;
            let character = str[nowIndex];
            if (this.isCharacterWordHead(character)) {
                let wordInfos = this.findAWord(str, nowIndex, result);
                if (wordInfos[1] !== null) {
                    if (noWordStr !== "") result.push(this.formNoWordStr(noWordStr));//
                    result.push(this.formWordStr(wordInfos[0],wordInfos[1]));

                    noWordStr = "";
                    nowIndex = wordInfos[2];
                }else {
                    noWordStr += character;
                }
            } else {
                noWordStr +=character;
            }
        }
        return result;
    }
    run() {
        this.fromDomain(this.input[1])
        this.output[0] = this.splitString(this.input[0])
    }
    findCharacterById(characterId) {
        let obj = this.data.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[0]] === characterId) && (obj[keys[3]] === null); // 检查第一个键的值是否等于characterId的字
        });
        if (obj !== undefined) {
            let keys = Object.keys(obj);
            return obj[keys[1]];
        }
        return null;
    }
    findCharacterId(character) {
        let obj = this.data.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === character) && (obj[keys[3]] === null); // 检查第二个键的值是否等于character的字
        });
        if (obj !== undefined) {
            let keys = Object.keys(obj);
            return obj[keys[0]];
        }
        return null;
    }
    findNextNodeId(character, nodeId) {
        let characterId = this.findCharacterId(character);
        let obj = this.data.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === characterId) && (obj[keys[2]] === nodeId);
        });
        if (obj !== undefined) {
            let keys = Object.keys(obj);
            return obj[keys[0]];
        }
        return null;
    }
    isWordEnd(nodeId) {
        let obj = this.data.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[0]] === nodeId) && (obj[keys[3]] !== null);
        });
        if (obj !== undefined) {
            let keys = Object.keys(obj);
            return obj[keys[3]];
        }
        //console.log("节点不存在");
        return null;
    }
    isCharacterWordHead(character) {
        let characterId = this.findCharacterId(character);
        if (characterId === null) return false;
        let obj = this.data.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === characterId) && (obj[keys[2]] === null && (obj[keys[3]] !== null));
        });
        if (obj !== undefined) {
            return true;
        }
        return false;
    }
    findPartWordList(wordId) {
        let obj = this.partSpeech.filter(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === wordId);
        });

        if (obj == undefined) {
            return null;
        }
        let result = obj.map(obj => {
            const keys = Object.keys(obj);
            return obj[keys[2]];
        });
        return result;
    }
    findmarkMethodObj(wordId, part, methodObj) {
        let partobj = this.partSpeech.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === wordId) && (obj[keys[2]] === part)
        })
        let partid;
        if (partobj !== undefined) {
            const keys = Object.keys(partobj); // 获取对象的键数组
            partid = partobj[keys[0]]
        }
        let methodObjobj = this.methodObj.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[3]] === partid) && (obj[keys[1]] === methodObj)
        })
        if (methodObjobj !== undefined) {
            const keys = Object.keys(methodObjobj); // 获取对象的键数组
            return methodObjobj[keys[2]]
        }



    }
    findMethodObj(partSpeechId) {
        let objs = this.methodObj.filter(obj => {//每个词性对应所有对象或方法
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[3]] === partSpeechId);
        });
        if (objs === []) {
            return null;
        }

        return objs.map(obj => {
            const keys = Object.keys(obj);
            return obj[keys[1]]
        });
    }
    findMethodObjList(wordId) {
        let obj = this.partSpeech.filter(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === wordId);
        });

        if (obj == undefined) {
            return null;
        }
        let result = obj.map(obj => {
            const keys = Object.keys(obj);
            return this.findMethodObj(obj[keys[0]]);
        });
        return result;
    }
}
