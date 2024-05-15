/**
 * 语法分析
 */
let stack={};

 stack. tem=new Array()
 stack. objs=new Array()

 stack. tems=new Array();
 stack. words=new Array();
 stack.n=0;

 let tree;
let pointer=new Array();
 let pointerN=new Array();
export default class Yacc{ 
    constructor(wordsIds ){ 
        //debugger
        this. sentence=new Array();

        this.root = 0;
        this.input = [];//inputId说明,  0:wordsIds(分词结果) 1:ruleStack(文法) 
        this.output = [];//outputId说明 0:tree(语法树)
    }


    run(){
        this.ruleStack = this.input[1];
        this.wordsIds = this.input[0];
        let ruleStack = this.input[1];
        let wordsIds = this.input[0];
        let obj=this.ergodicRules()
        stack.tem.push(obj);
        for( ; stack.n< wordsIds.length; ){

            stack.tem.push( wordsIds[stack.n].type)
            stack.objs.push(wordsIds[stack.n].data)
            stack.n++
           let obj=this.ergodicRules()
            stack.tem.push(obj);

            if(obj ==""){
                stack.tem.pop()
            }
        }
        this.ergodicRules()
        this.output[0] = tree;
        return tree;
    }

    /**
     * 语法分析 从下往上 查找
     * @returns {string}
     */
    ergodicRules(){
        let isWordFront=false; //是否递进
        let beiObj=""
        if(this.ruleStack.length<1){
            return "";
        }
        for(let i=this.ruleStack.length;i>0;i--){
            let rules=this.ruleStack[i-1];
            for(let n=rules.rules.length;n>0;n--){
               let rule=rules.rules[n-1];
               let isz=0;
                for(let l=0;l<rule.length-1;l++){
                    let is=isz>stack.tem.length-1&&rule.length-1>stack.tem.length&&stack. words.length>0
                    if(is){
                        if(isWordFront===false){
                            beiObj= JSON.parse(JSON.stringify(stack));
                        }
                        isWordFront=true;
                        this. wordFront()
                    }
                    if(rule[l]==stack.tem[l]){
                        isz++;
                    }else {


                        if(isz>0&&isz>l-1&&l<rule.length-1){
                          let  obj= this. embedded2(l,rule[l]);
                          if(obj!==false){
                              stack.tem.push(obj)
                          }
                            if(rule[l]==stack.tem[l]){
                                isz++;
                            }
                        }
                    }

                }
                if(isz==rule.length-1&&isz==stack.tem.length){
                   let obj= eval("( function ()"+rule[rule.length-1]+")()")
                    let objs2= obj
                    return rules.id;
                     ;
                }else  if(isWordFront) {
                    stack= JSON.parse(JSON.stringify(beiObj));
                }
            }
        }
        return "";
    }

    /**
     *  嵌套 匹配
     * 把前面的数据保存到栈里面；
     * @param index
     * @param type
     */
    embedded(index,type){
        let reIndex= this. wordDelFront(index)
        if(type=="statement"){
            if(stack.n>=this.wordsIds.length){
                this.wordReFront(reIndex)//恢复现场
                return;
            }
            this.statementRun();
            this.wordReFront(reIndex)//恢复现场
            return;
        }


        let obj=this.topToBottom(type)
        if(obj==false){
            this.wordReFront(reIndex)//恢复现场
            return ;
        }
        stack.tem.push(obj);
        if(obj ==""){
            stack.tem.pop()
        }
        this.wordReFront(reIndex)//恢复现场
        return obj;

    }
    statementRun(){

        let obj2=this.ergodicRules()
        stack.tem.push(obj2);

        if(obj2 ==""){
            stack.tem.pop()
        }
        if(obj2=="statement"){
            return obj2;
        }
        for( ; stack.n< this.wordsIds.length-1; ){
            stack.n++
            stack.tem.push( this.wordsIds[stack.n].type)
            stack.objs.push(this.wordsIds[stack.n].data)

            let obj=this.ergodicRules()
            stack.tem.push(obj);

            if(obj ==""){
                stack.tem.pop()
            }
            if(obj=="statement"){
                return obj;
            }
        }
    }






    /**
     * 把前面的词组放临时栈里面
     * @param index
     */
    wordDelFront(index){
        let temz=new Array();
        let objsz=new Array();
        for(let i=0;i<index;i++){
            temz.push(stack.tem.shift())
            objsz.push(stack.objs.shift())
        }
        stack.tems.push(temz)
        stack.words.push(objsz)
        return stack.words.length-1
    }
    /**
     * 恢复前面的词组
     * @param index
     */
    wordReFront(index){
        let temz=stack.tems[index];
        let objsz= stack.words [index];
        for(;stack.words.length>index;){
            stack.words.pop()
            stack.tems.pop()
        }

        temz.push(...stack.tem)
        objsz.push(...stack.objs)
        stack.tem=temz
        stack.objs=objsz
        return;
    }

    /**
     * 文字递进
     */
    wordFront(){

        if(stack.n>this.wordsIds.length-1) return;
        stack.tem.push( this.wordsIds[stack.n].type) 
        stack.objs.push(this.wordsIds[stack.n].data)
        stack.n++

    }

    /**
     * 从上向下 递归
     * @param type
     * @returns {*}
     */
    topToBottom(type){
        let rulez;
        let isWordFront=false; //是否递进
        let beiObj=""
        for(let n=0;n<this.ruleStack.length;n++){
            let rules=this.ruleStack[n]
            if(rules.id==type){
                rulez=rules.rules;
                break
            }
        }

        if(typeof(rulez) == "undefined"){
            return false;
        }


        for(let n=rulez.length;n>0;n--){
            let rule=rulez[n-1];
            let isz=0;
            for(let l=0;l<rule.length-1;l++){
                if(isz>stack.tem.length-1&&rule.length-1>stack.tem.length){
                    if(isWordFront===false){
                        beiObj= JSON.parse(JSON.stringify(stack));
                    }
                    isWordFront=true;
                    this. wordFront()
                }

                if(rule[l]==stack.tem[l]&&l<stack.tem.length){
                    isz++;
                }else {
                    if(type != rule[l]&&l<stack.tem.length){
                        let is=  this.embedded2(l,rule[l])
                        if(is!==false){
                            stack.tem.push(is)
                        }
                    }

                    if(rule[l]==stack.tem[l]){
                        isz++;
                    }
                }

            }

            if(isz==rule.length-1&&isz==stack.tem.length){
                this.create(rule[rule.length-1])
                return type;
                ;
            }else if(isWordFront) {
                stack= JSON.parse(JSON.stringify(beiObj));
            }

        }
        return false;

    }

    embedded2(index,type){
        let temLength =stack.tem.length


        let reIndex= this. wordDelFront(index)
        let obj=this.topToBottom(type)
        this.wordReFront(reIndex)//恢复现场
        if(obj==null){
           debugger
        }
        return  obj

    }

    create(rule){
        let obj= eval("( function ()"+rule+")()");
    }
}


class   TreeNode {
    constructor(type, ...args){
        this.type=type;
        this.data=new Array();
      //  stack.next=stack.objs[0]
        for(let i=0;i<args.length;i++){
            this.data.push(stack.objs[args[i]-1])

        }

        stack.tem=new Array();
        stack.objs=new Array();
        stack.objs.push(this)

    }
 }

