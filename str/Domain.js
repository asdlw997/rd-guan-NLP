import Module from "./Module.js";
import Unit from "./Unit.js";
import Intra from "../page/Intra.js";

/**
 *  领域 多个块组成的
 *
 * 拥有基础的树形结构
 *
 */


export default class Domain {
    constructor(){
        this.index=1;
        this.indexList=[];
        this.dict=null;
        this. current_id = 1;
        let module=new Module();
        this.list={"1":module}

    }

    next_id(){
        this.current_id++;
        while (this.list[  this.current_id]){
            this.current_id++;
        }
        return this.current_id.toString();
    }





    /**
     *  转换成树
     * @param id
     * @returns {Array}
     */
    toTree(id){
        let module=   this.list[id]
        let res={};
        let unit= module.find(1);
        res.pid=    unit.find(1);
        res.type= this.dictId(unit.find(2));
        res.value= this.dictId(unit.find(3));
        res. name=this.dictId(unit.find(4));
        res.id=id;
        if(module.list.length>1){
            let children=[];
            for(let i=1;i<module.list.length;i++) {
                let units=   module.find(i+1);
                let resli=this.toTree( units.find(1))
                children.push(resli)
            }
            res. children=children
        }

        return res;

    }
    toTreeNum(id){
        let module=   this.list[id];
        if(!module){
            return
        }
        let res={};
        let unit= module.find(1);
        res.pid=    unit.find(1).toString();
        res.type= unit.find(2).toString();
        res.value= unit.find(3).toString();
        res. name=unit.find(4).toString();
        res.id=id;
        if(module.list.length>1){
            let children=[];
            for(let i=1;i<module.list.length;i++) {
                let units=   module.find(i+1);
                let resli=this.toTreeNum( units.find(1))
                children.push(resli)
            }
            res. children=children
        }

        return res;

    }



    /**
     *  加载 数据
     * @param data
     */
    loadData(intras){
        let _this=this;
        let units=[];
        let testNub="";
        this.list=[]
        let data=Intra.intrasToBuff(intras)
        for(let i=0;i<data.length;i++){
            let num=data[i].toString(2);
            let buffNum =  (Array(8).join(0) + num).slice(-8);
            let code0= parseInt(buffNum.substr(0,4),2).toString(16);
            let code1= parseInt(buffNum.substr(4,7),2).toString(16);
            testNub+=code0+code1
        }
        let list= testNub.split("c")
        let regex=/^[0]+/;
        if(list[list.length-1].toString().replace(regex,"")===""){
            list.length= list.length-1;
        }
        let headModule=    new Module();
        headModule.decode(list[0]);
        //索引
        let unit=headModule.find(1);
        this.current_id=unit.find(4);
        for (let i=1;i<headModule.list.length;i++){

            let unit2= headModule.find(i+1);

            let key=    unit2.find(4)
            let module=    new Module();
            module.decode(list[i]);
            this.list[key]=module;
        }

    }
    outData(){
        let _this=this;
        let res=""
        let buffList=[];
        let index=0;
        let headModule=new Module();
        headModule.addUnit(new Unit(_this.current_id))
        for(let key in _this.list){
            let unit =_this.list[key].encoded();
            res+=unit+'c'
            index++;
            headModule.addUnit(new Unit(index,key))
        }
        let headCode=headModule.encoded();
        res=headCode+'c'+res
        let dataList =res.split("");
        if(dataList.length%2==1){ //如果如果长度单数，则在最后补1
            dataList=["0",...dataList]
        }
        for(let i=0;i<dataList.length;i=i+2){
            let num1 = parseInt(dataList[i], 16).toString(2);
            let test1 =(Array(4).join(0) + num1).slice(-4)
            let num2 = parseInt(dataList[i+1], 16).toString(2);
            let test2 =(Array(4).join(0) + num2).slice(-4)
            let text = test1+test2;
            let intcode= parseInt(text,2)
            buffList.push( intcode)
        }

        let uint8Array = new Uint8Array(buffList);
        let intras=Intra.buffToIntras(uint8Array);
        return intras;
    }

    addModule(module){
        let id=this.next_id();
        this.list[id]=module;
        return id;
    }

    /**
     * 通过pid,添加下级 模块
     * @param row
     * @returns {string}
     */
    addModuleRow(pid,row){
        let id=this.next_id();
        let module1 = new Module();
        row.save(1,id);
        this.moduleAddUnit(pid,row);
        module1.addUnit(row)
        this.list[id]=row;
        return id;
    }

    find(n){
        let res=this.list[n];
        if(typeof(res )!=="undefined" ){
            return res;
        }
        return null;
    }


    /**
     * 判断类型
     * @param id
     * @param type
     * @returns {boolean}
     */
    isUnit(pid,id,name,value,type){
        let wordModule=    this.list[pid];
        if(!wordModule) return false;
        let list=  wordModule.isUnits(id,name,value,type);
        if(list.length>0){
            return true;
        }
        return false;
    }


    /**
     * 判断类型
     * @param id
     * @param type
     * @returns {boolean}
     */
    findUnit(pid,id,name,value,type){
        let wordModule=    this.list[pid];
        if(!wordModule){
            return [];
        }
        let list=  wordModule.isUnits(id,name,value,type);
        return list;
    }
    /**
     通过 固定位置的值 判断是否存在列表里面，
     获取行号
     */
    findUnitNo(id,name,value,type){
        let wordModule=    this.list[pid];
        if(!wordModule){
            return new Array()
        }
        let No=  wordModule.findUnitNo(id,name,value,type);
        return No;

    }



    saveUnit(pid,id,row){
        this.list[pid].list[id]=row;
    }
    // findUnit(pid,id){
    //     return  this.list[pid].list[id]
    // }
    moduleAddUnit(pid,row){
        this.list[pid].list.push(row);
        return this.list[pid].list.length-1;
    }
    moduleSaveUnit(pid,id,row){
        this.list[pid].list[id]=row;
    }

}
