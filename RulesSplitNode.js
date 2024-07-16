

const yaccSrc =`


program
      : statement_list                         {tree = stack.objs[0]}
		;

statement_list
      : statement_list statement               {return new TreeNode ('STMT_LIST', 1,2)}
      |                                        {return new TreeNode ('EMPTY_STMT')}
      ;


statement           
  : 符号                            {return new TreeNode ('EMPTY_STMT')}
  | 动作B                        {return new TreeNode ('statement_动作A',1)}
  | 结构C                        {return new TreeNode ('statement_结构A',1)}
  | error 符号                      {return new TreeNode ('ERROR_STMT')}
      ;
结构C
 : 结构B                             {return new TreeNode ('结构B',1)} 
 | 动词B 结构B                        {return new TreeNode ('动词名词',1,2)}
 | 把 结构B 动词B                     {return new TreeNode ('把名词动词',2,3)}
 | 把 结构B 动词B 到 结构B                {return new TreeNode ('把名词动词到名词',2,3,5)}     
;
结构B                                                             
 : 名词A                             {return new TreeNode ('名词A',1)} 
 | 结构A                             {return new TreeNode ('结构A',1)} 
 | 结构A 和 结构A                     {return new TreeNode ('和结构',1,3)} 
;
结构A
 : 名词A 的 名词A                     {return new TreeNode ('的名词',1, 3)}  
;
名词A                                                             
  : 名词A 名词                       {return new TreeNode ('多属性名词',1, 2)} 
  | 名词                             {return new TreeNode ('名词',1)}
      ;

动词B
  : 动词A                             {return new TreeNode ('动词A',1)}
  | 动词A 和 动词A                    {return new TreeNode ('和动词',1,3)} 
      ;     
动词A
  : 动词                              {return new TreeNode ('动词',1)}
      ;
`
const yaccSrc2 = `


program
      : statement_list                         {tree = stack.objs[0]}
		;

statement_list
      : statement_list statement               {return new TreeNode ('STMT_LIST', 1,2)}
      |                                        {return new TreeNode ('EMPTY_STMT')}
      ;


statement
  : 符号                            {return new TreeNode ('EMPTY_STMT')}
  | 动作B                        {return new TreeNode ('statement_动作A',1)}
  | 结构C                        {return new TreeNode ('statement_结构A',1)}
  | error 符号                      {return new TreeNode ('ERROR_STMT')}
      ;

结构C
 : 结构B                             {return new TreeNode ('结构B',1)} 
 | 动词B 结构B                        {return new TreeNode ('动词名词',1,2)}
 | 把 结构B 动词B                     {return new TreeNode ('把名词动词',2,3)}
 | 把 结构B 动词B 到 结构B                {return new TreeNode ('把名词动词到名词',2,3,5)}     
;
结构B                                                             
 : 结构A                             {return new TreeNode ('结构A',1)}
 | 名词A                             {return new TreeNode ('名词A',1)}
 | 结构A 和 结构A                     {return new TreeNode ('和结构',1,3)} 
;
结构A
 : 名词A 的 结构A                     {return new TreeNode ('的名词',1, 3)}
 | 名词A                              {return new TreeNode ('名词A',1)}
;
名词A                                                             
  : 名词 名词A                    {return new TreeNode ('多属性名词',1, 2)}
  | 名词                             {return new TreeNode ('名词',1)}
      ;

动词B
  : 动词A                             {return new TreeNode ('动词A',1)}
  | 动词A 和 动词A                    {return new TreeNode ('和动词',1,3)} 
      ;     
动词A
  : 动词                              {return new TreeNode ('动词',1)}
      ;
`
const yaccSrc3 = `


program
      : statement_list                         {tree = stack.objs[0]}
		;

statement_list
      : statement statement_list              {return new TreeNode ('STMT_LIST', 1,2)}
      | statement                               {return new TreeNode ('STMT', 1,2)}
      ;


statement           
  :                                        {return new TreeNode ('EMPTY_STMT')}
  | 符号                            {return new TreeNode ('EMPTY_STMT')}
  | 动作B                        {return new TreeNode ('statement_动作A',1)}
  | 结构C                        {return new TreeNode ('statement_结构A',1)}
  | error 符号                      {return new TreeNode ('ERROR_STMT')}
      ;
结构C
 : 结构B                             {return new TreeNode ('结构B',1)} 
 | 动词B 结构B                        {return new TreeNode ('动词名词',1,2)}
 | 把 结构B 动词B                     {return new TreeNode ('把名词动词',2,3)}
 | 把 结构B 动词B 到 结构B                {return new TreeNode ('把名词动词到名词',2,3,5)}     
;
结构B                                                             
 : 结构A                             {return new TreeNode ('结构A',1)}
 | 名词A                             {return new TreeNode ('名词A',1)}
 | 结构A 和 结构A                     {return new TreeNode ('和结构',1,3)} 
;
结构A
 : 名词A 的 结构A                     {return new TreeNode ('的名词',1, 3)}
 | 名词A                              {return new TreeNode ('名词A',1)}
;
名词A                                                             
  : 名词 名词A                    {return new TreeNode ('多属性名词',1, 2)}
  | 名词                             {return new TreeNode ('名词',1)}
      ;

动词B
  : 动词A                             {return new TreeNode ('动词A',1)}
  | 动词A 和 动词A                    {return new TreeNode ('和动词',1,3)} 
      ;     
动词A
  : 动词                              {return new TreeNode ('动词',1)}
      ;
`

export default class RulesSplit{
    constructor(src){

        //if (typeof (d) == "undefined") { src = yaccSrc }
        src = yaccSrc2
        this.split(src)
    }





    split(src){
      let rules=  src.split(/\n*;\n*/)
        this.rules = new Array();
        if(rules[rules.length-1]==""){
            rules.length=rules.length-1;
        }
       for(let  i=0;i<rules.length;i++){
            let rule=  rules[i].split(/\n*:\n*/);
            let ruleList=rule[1].split('|')

           if(ruleList[0]==""){
               ruleList.shift()
           }
           let ruleLists=new Array();
            for(let n=0;n<ruleList.length;n++){
               let obj= ruleList[n].replace(/^\s+|\s+$/g, '')
                let ws = obj.indexOf("{");

               let zrules=obj.substring(0,ws).split(/\s+/)
                if(zrules[zrules.length-1]==""){
                   zrules.pop();
                }
                zrules.push(obj.substring(ws))
                ruleLists.push(zrules)
            }

           this.rules.push({id:rule[0].replace(/[\r\n ]/g,""),rules:ruleLists})
       }

    }


}
