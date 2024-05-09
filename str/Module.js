import Unit from "./Unit.js";


/**
 * 块 多行组成一个块
 */
export default class Module{
    constructor(){
        this.list=[];
    }
    size(){
        return this.list.length;
    }
    find(n){
        let res=this.list[n-1];
        if(res){
            return res;
        }
        return null;
    }
    save(n,data){
        this.list[n]=data;
    }
    addData(fileId,moduleId,unitId,data){
        if(unitId!=null){
            return   this.list[unitId]=data;
        }else {
            let index=this.list.length;
            this.list.push(data)
            return index;
        }
    }
    saveData(fileId,moduleId,unitId,data){
        if(unitId!=null){
            if(!this.list[moduleId]){
                this.list[moduleId]=new Unit();
            }

            return  this.list[moduleId].saveData(fileId,moduleId,unitId,data);
        }else {
            this.list[moduleId]=data;
        }
    }

    findData(fileId,moduleId,unitId,func){
        let _this=this;
        if(unitId!=null){
            return this.list[moduleId].findData(fileId,moduleId,unitId,func);
        }
        if(func){
            return func(fileId,moduleId,unitId,_this);
        }
        return this.list[moduleId];
    }


    /**
     通过 固定位置的值 判断是否存在列表里面，
     获取行号
     */
    findUnitNo(id,name,value,type){
        let maps=[id,name,value,type];
        let keys=[]
        let res=[];
        if(id){
            keys.push(1)
        }
        if(name){
            keys.push(2)
        }
        if(value){
            keys.push(3)
        }
        if(type){
            keys.push(4)
        }

        for(let i=0;i<this.list.length;i++){
            let unit= this.list[i];
            let isNub=0;
            for(let n=0;n<keys.length;n++){
                let key=keys[n];
                if( unit.isValue(key,maps[key-1]) ){
                    isNub++;
                }
            }
            if(isNub == keys.length){
               return  i;
            }
        }

        return res;

    }

    /**
     通过 固定位置的值 判断是否存在列表里面，并返回
     */
    isUnits(id,name,value,type){
        let maps=[id,name,value,type];
        let keys=[]
        let res=[];
        if(id){
            keys.push(1)
        }
        if(name){
            keys.push(2)
        }
        if(value){
            keys.push(3)
        }
        if(type){
            keys.push(4)
        }

        for(let i=0;i<this.list.length;i++){
            let unit= this.list[i];
            let isNub=0;
            for(let n=0;n<keys.length;n++){
                let key=keys[n];
                if( unit.isValue(key,maps[key-1]) ){
                    isNub++;
                }
            }
            if(isNub == keys.length){
                res.push(unit)
            }
        }

        return res;

    }

    addUnit(data){
        this.list.push(data);
    }
    //编码
    encoded(){
        let _this=this;
        if(  this.list.length==0){
            return "";
        }
        let res=""
        for(let i=0;i<_this.list.length;i++){
            let unit =_this.list[i].encoded();
            res+=unit+'b'
        }
        return res.substr(0,res.length-1)
    }
    //解码
    decode(words){
        let list =words.split("b")
        for(let l=0;l<list.length;l++){
            let unit=new Unit();

            unit.decode(list[l])
            this.list.push(unit);
        }

    }
}
