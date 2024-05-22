


import Module from "./str/Module.js";
import Unit from "./str/Unit.js";
import Domain from "./str/Domain.js";

export default class Switch{
    constructor(){
        this.domain= new Domain();
        this.input = []//0 tree
        this.output = []//0 处理后的domain
        this.usedId = 1;//为了避免重复id
    }
    /**
     * 输出树格式
     */
    findTree(){
      return    this.domain.findRun(1);
    }

    /**
     * 数组格式
     *
     */
    findArray(){
        return   this. domain.findRunData(11);
    }

    /**
     * 输出Phere格式
     */
    findPhere(){
        return this.domain;

    }

    run() {
        let tree = this.input[0]
        this.domain = new Domain();
        this.domain.current_id = this.usedId;//为了避免重复id
        this.genIntCode(tree)
        this.output[0] = this.domain;
        this.usedId = this.domain.current_id;//为了避免重复id
        
    }
    genIntCode ( tree)  {
            let  root = tree;
            let  blk1, blk2,cond, jump2else, thenpart, jump2end, elsepart, endif;
        let id1, id2, id3, module;
        switch (root.type)  {
            case 'STMT_LIST':
                blk1 =  this.genIntCode (root.data[0]);
                blk2 =this.genIntCode (root.data[1]);
                 this.domain.moduleAddUnit(blk1,new Unit(blk2,"1"));

                return blk1;

            case 'EMPTY_STMT':
                module= new Module();
                module.addUnit(new Unit("0"))
                id1=this.domain.addModule( module);
                return id1;
                break;
            case 'statement_名词A':
            case 'statement_结构A':
            case 'statement_动作A':
                 return this.genIntCode (root.data[0]);
                break;
            case '动词名词':
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                cond = this.genIntCode (root.data[1]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,cond,"2"))//2表示跟动词相关
                id1=this.domain.addModule( module);
                this.domain.moduleAddUnit(1,new Unit(id1))
                return id1;
                break;
            case '把名词动词':
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                cond = this.genIntCode (root.data[1]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,cond,"2"))
                id1=this.domain.addModule(  module);
                return id1;
                break;
            case '把名词动词到名词':
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                cond = this.genIntCode (root.data[1]);
                blk2 = this.genIntCode (root.data[2]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,cond,blk2,"2"))
                id1=this.domain.addData( module);
                this.domain.moduleAddUnit(1,new Unit(id1))
                return id1;
                break;
            case '名词A': //
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,"0"))
                id1 = this.domain.addModule( module);
                return id1;
                break;
            case '结构A': //
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);

                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,"0"))
                id1 = this.domain.addModule(module);
                return id1;
                break;
            case '和结构':
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                blk2 = this.genIntCode (root.data[1]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,blk2,"1"))
                id1 = this.domain.addModule( module);
                return id1;
                break;
            case '的名词': //
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                blk2 = this.genIntCode (root.data[1]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,blk2,"0"))
                id1 = this.domain.addModule( module);
                return id1;
                break;

            case '名词':
                module= new Module();
                blk1 = new Unit( root.data[0]);
                module.addUnit(new Unit('0'))
                module.addUnit(blk1)
                id1 = this.domain.addModule( module);
                return id1;
                break;
            case '多属性名词':
                blk1 = this.genIntCode (root.data[0]);
                blk2 = new Unit( root.data[1]);
                id1=this.domain.moduleAddUnit(blk1,blk2);
                return  blk1
                break;
            case '动词A': //
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,"1"))
                id1 = this.domain.addModule( module);
                return id1;
                break;
            case '和动词': //
                module= new Module();
                blk1 = this.genIntCode (root.data[0]);
                blk2 = this.genIntCode (root.data[1]);
                module.addUnit(new Unit('1'))
                module.addUnit(new Unit( blk1,"1"))
                module.addUnit(new Unit( blk2,"1"))
                id1 = this.domain.addModule( module);
                return id1;
                break;
            case '动词': //
                  module= new Module();
                blk1 = new Unit( root.data[0]);
                module.addUnit(new Unit('0'))
                module.addUnit(blk1)
                id1 = this.domain.addModule( module);
                return  id1
                break;

            default:
                break;

        }
    }


    concatenate (blk1, blk2)  {
        blk1.data.push(...blk2.data)
        return blk1;
    }
}
