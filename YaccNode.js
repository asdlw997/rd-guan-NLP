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
        this.terminalSet = ['名词', '的', '和', '动词', '符号']
        this.isdetectLeftRecursion=true //是否检测左递归
        this.embeddedLevels = 0//当前嵌套等级
        this.embeddedLevelsLimit = 20//嵌套等级限制
    }


    run() {
        stack.tem = new Array()
        stack.objs = new Array()

        stack.tems = new Array();
        stack.words = new Array();
        stack.n = 0;
        this.ruleStack = this.input[1];
        this.wordsIds = this.input[0];
        let ruleStack = this.input[1];
        let wordsIds = this.input[0];
        if (this.isdetectLeftRecursion) {
            if (this.LeftRecursionDetection(this.ruleStack)) {//左递归检测
                return '文法出现左递归'
            }
            
        }
        
        let obj = this.ergodicRules()
        stack.tem.push(obj);
        for (; stack.n < wordsIds.length;) {//似乎一次循环会分析一个statement

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
    LeftRecursionDetection(ruleStack) {
        let LeftRecursion = false
        //用广度优先算法遍历文法的第一个非终结符，直到出现终结符，返回所有的终结符和非终结符。
        ruleStack.forEach(obj => {
            let idList = [obj.id]
            let idListNew = []
            do {

                idList.forEach(id => {//把idList中的每个id对应的rules加入idListNew中
                    let rules=[]
                    let obj = ruleStack.find(obj => {//找到id对应的obj
                        return obj.id === id
                    })
                    idListNew.push(...this.firsts(obj.rules))//把id对应的rules加入idListNew中
                })
                if (idListNew.includes(obj.id)) {//发生左递归
                    LeftRecursion=true
                }
                idList = idListNew.slice()
                idListNew=[]
            } while (!LeftRecursion && idListNew.length>0)
        })
        return LeftRecursion;
    }
    firsts(rules) {//返回文法组的第一个非终结符组
        let res=[]
        rules.forEach(rule => {
            if (rule.length > 1 ) {//文法中至少有1个符号
                if (!this.terminalSet.includes(rule[0])) {//第一个是非终结符
                    res.push(rule[0]);
                }
            }
        })
        return res
    }
    /**
     * 语法分析 从下往上 查找
     * @returns {string}
     */
    ergodicRules(){
        let isWordFront=false; //是否递进
        let beiObj = ""

        if(this.ruleStack.length<1){
            return "";
        }
        for (let i = this.ruleStack.length; i > 0; i--) {//外层从下到上
            let rules=this.ruleStack[i-1];//取出一组文法
            for (let n = 1; n <= rules.rules.length; n++){ //内层从下到上
                let rule = rules.rules[n - 1];//取出一组文法 的一条
               let isz=0;
                for(let l=0;l<rule.length-1;l++) { //从左到右
                    let is=isz>stack.tem.length-1&&rule.length-1>stack.tem.length&&stack. words.length>0//条件
                    if(is){
                        if(isWordFront===false){
                            beiObj= JSON.parse(JSON.stringify(stack));
                        }
                        isWordFront=true;
                        this. wordFront()
                    }
                    if(rule[l]==stack.tem[l]){//匹配
                        isz++;
                    }else {


                        if ((isz > 0) && (isz > l - 1) && (l < rule.length - 1) ) {//这条文法有一部分匹配
                            this.embeddedLevels = 0;//初始化递归层数
                            let  obj= this. embedded2(l,rule[l]);//递归为了判断接下来的词中，是否有符合rule[l]作为文法左值的情况
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
    embedded(index,type){//没被用过
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
    statementRun() {//没被用过

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
    wordDelFront(index) {//把stack.tem和stack.objs中前index个分别加入到stack.tems和stack.words后
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
    wordReFront(index) {//将stack.tems和stack.words的第index个分别加入到stack.tem和stack.objs前
        //同时将stack.tems和stack.words的第index个后的舍去
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
    wordFront(){//新读入一个词

        if(stack.n>this.wordsIds.length-1) return false;
        stack.tem.push( this.wordsIds[stack.n].type) 
        stack.objs.push(this.wordsIds[stack.n].data)
        stack.n++
        return true
    }

    /**
     * 从上向下 递归
     * @param type
     * @returns {*}
     */
    topToBottom(type) {//type必须是文法中的左值
        //console.log(type)
        //console.log(stack.tem)
        if (type == '名词A') {
            //debugger
        }
        if (this.embeddedLevels > this.embeddedLevelsLimit) {
            //debugger
        }
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


        for (let n = 1; n <= rulez.length;n++){//内层从下向上!
            let rule=rulez[n-1];//取出一组文法 的一条
            let isz=0;
            for(let l=0;l<rule.length-1;l++){//从左到右
                if (isz > stack.tem.length - 1 && rule.length - 1 > stack.tem.length) {//isWordFront条件
                    if(isWordFront===false){
                        beiObj= JSON.parse(JSON.stringify(stack));
                    }
                    isWordFront = true;
                    let isReadSuccess = this.wordFront()
                    if (!isReadSuccess) {
                        continue
                    }
                    //console.log('read word')
                }

                if(rule[l]==stack.tem[l]&&l<stack.tem.length){//判断tem中是否有
                    isz++;
                }else {
                    if (/*type != rule[l]  &&*/ (l < stack.tem.length) && (this.embeddedLevels <= this.embeddedLevelsLimit)) {//匹配
                        let is=  this.embedded2(l,rule[l])//递归为了判断接下来的词中，是否有符合rule[l]作为文法左值的情况
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

    embedded2(index, type) {
        this.embeddedLevels++
        let temLength =stack.tem.length


        let reIndex= this. wordDelFront(index)
        let obj=this.topToBottom(type)
        this.wordReFront(reIndex)//恢复现场
        if(obj==null){
           debugger
        }
        this.embeddedLevels--
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

