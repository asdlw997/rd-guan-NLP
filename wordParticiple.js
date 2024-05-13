import Module from "./str/Module.js";
import Unit from "./str/Unit.js";
import Domain from "./str/Domain.js";



export default class Dictionary {//词典
    constructor(data, partSpeech, methodObj) {
        this.data = data.slice();
        this.partSpeech = partSpeech.slice();
        this.methodObj = methodObj.slice();
    }
    listWord(src, nodeId, func) {//对每一个词字符串调用 funcCallback()
        let node=this.data.find((obj) => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[0]] === nodeId)
        })
        if (node !== undefined) {
            const keys = Object.keys(node);
            
            src += this.findCharacterById(node[keys[1]])
            if (node[keys[3]] ===true) {
                func(src, node[keys[0]]);//(字符串,wordId)
            }
        }
        let obj = this.data.filter((obj) => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[2]] === nodeId && obj[keys[3]] !== null);
        });
        if (obj !== undefined) {
            obj.map((_obj) => {
                let _keys = Object.keys(_obj);
                this.listWord(src, _obj[_keys[0]], func)
            })
        }
    }


    combine(dictionary) {
        dictionary.listWord("", null, (word, wordId) => {
            //this.addWord(word);
            let partWordList = dictionary.findPartWordList(wordId);
            let methodObjList = dictionary.findMethodObjList(wordId);
            for (let i = 0; i < partWordList.length; i++) {
                const element1 = partWordList[i];
                for (let j = 0; j < methodObjList[i].length; j++) {
                    const element2 = methodObjList[i][j];
                    let markMethodObj = dictionary.findmarkMethodObj(wordId, element1, element2);
                    this.addWoldFullInfo_1part1methodObj(word, element1, element2, markMethodObj)
                }
            }
        })
    
    }
    toDomain() {
        let ModuleTree = new Module();
        this.data.map((obj) => {
            let list = Object.values(obj);
            let unit = new Unit(...list);
            ModuleTree.addUnit(unit);
        })
        let ModulePartSpeech = new Module();
        this.partSpeech.map((obj) => {
            let list = Object.values(obj);
            let unit = new Unit(...list);
            ModulePartSpeech.addUnit(unit);
        })
        let ModuleMethodObj = new Module();
        this.methodObj.map((obj) => {
            let list = Object.values(obj);
            let unit = new Unit(...list);
            ModuleMethodObj.addUnit(unit);
        })
        let domain = new Domain();
        domain.addModule(ModuleTree);
        domain.addModule(ModulePartSpeech);
        domain.addModule(ModuleMethodObj);
        return domain;
    }
    fromDomain(domain) {
        let keys=["a","b","c","d"]
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
             return (obj[keys[1]] === character) && (obj[keys[3]]===null); // 检查第二个键的值是否等于character的字
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
        let partobj= this.partSpeech.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === wordId) && (obj[keys[2]] === part)
        })
        let partid;
        if (partobj !== undefined) {
            const keys = Object.keys(partobj); // 获取对象的键数组
            partid=partobj[keys[0]]
        }
        let methodObjobj= this.methodObj.find(obj => {
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
    
    getLegalId(datalist) {
        let i = 0;
        let obj;
        do{ 
            i++;
            obj = datalist.find(obj => {
                const keys = Object.keys(obj); // 获取对象的键数组
                return (obj[keys[0]] === i);
            });
        } while (obj!==undefined)
        return i;
    }
    addWord(word) {
        let nowNodeId = null;
        let lastNodeId = null;
        let characterId = null;
        let character = "";
        for (let i = 0; i < word.length; i++) {
            character = word[i]
            characterId = this.findCharacterId(character)
            if (characterId === null) {
                characterId = this.getLegalId(this.data);
            this.data.push({ a: characterId, b: character, c: null, d: null })
            }
            nowNodeId = this.findNextNodeId(character, nowNodeId)


            if (nowNodeId === null) {
                nowNodeId = this.getLegalId(this.data);
                this.data.push({ a: nowNodeId , b: characterId, c: lastNodeId, d: i == word.length-1 })
            }
            lastNodeId = nowNodeId;
        }
        return nowNodeId;
    }
    addWoldFullInfo(word, part, methodObj, markMethodObj) {
        let wordId = this.addWord(word);
        
        let obj =this.partSpeech.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === wordId) && (obj[keys[2]] === part)
        })
        let partSpeechId;
        let methodObjId;
        if (obj === undefined) {
            partSpeechId = this.getLegalId(this.partSpeech);
            this.partSpeech.push({ a: partSpeechId, b: wordId, c: part, d: null })
        } else { 
            const keys = Object.keys(obj); // 获取对象的键数组
            partSpeechId = obj[keys[0]];
        }

        
        obj =this.methodObj.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[3]] === partSpeechId) && (obj[keys[1]] === methodObj)
        })
        if (obj === undefined) {
            methodObjId = this.getLegalId(this.methodObj);
            this.methodObj.push({ a: methodObjId, b: methodObj, c: markMethodObj, d: partSpeechId });
        } else {
            //如果词性有相同方法或对象 则不重复
        }
    }
    addWoldFullInfo_1part1methodObj(word, part, methodObj, markMethodObj) {//一个词性对应一种方法或对象
        let wordId = this.addWord(word);

        let obj = this.partSpeech.find(obj => {
            const keys = Object.keys(obj); // 获取对象的键数组
            return (obj[keys[1]] === wordId) && (obj[keys[2]] === part)
        })
        let partSpeechId;
        let methodObjId;
        if (obj === undefined) {
            partSpeechId = this.getLegalId(this.partSpeech);
            this.partSpeech.push({ a: partSpeechId, b: wordId, c: part, d: null })
            obj = this.methodObj.find(obj => {
                const keys = Object.keys(obj); // 获取对象的键数组
                return (obj[keys[3]] === partSpeechId) && (obj[keys[1]] === methodObj)
            })
            if (obj === undefined) {
                methodObjId = this.getLegalId(this.methodObj);
                this.methodObj.push({ a: methodObjId, b: methodObj, c: markMethodObj, d: partSpeechId });
            } else {
                //如果词性有相同方法或对象 则不重复添加
            }
        } else {
            //如果词性存在 不覆盖
        }


        
    }
}

export class Tokenizer {
    constructor() {
        this.input = [];//inputId说明,  0:str(字符串) 1:domain(词典) 
        this.output = [];//outputId说明 0:result(分词结果)
        this.dictionary = undefined;
        this.data = [];
        this.partSpeech = [];
        this.methodObj = [];
    }

    formNoWordStr(noWordStr) {//不在词典的词的输出格式
        return [noWordStr, "名词"];
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
                if (this.isWordEnd(nodeId)) {
                    word = _str + character;
                    wordEndIndex = nowIndex;
                    wordId = nodeId;
                } else {
                    _str += character;
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
        this.output[0] = this.splitString(this.input[0]);
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
