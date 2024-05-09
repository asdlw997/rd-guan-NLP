
/**
 * 单元
 * 由四组数字组成
 *
 */
export default class Unit{
    constructor(a,b,c,d){
        if(typeof(a) == "undefined"){
            a="";
        }
        if(typeof(b) == "undefined"){
            b="";
        }
        if(typeof(c) == "undefined"){
            c="";
        }
        if(typeof(d) == "undefined"){
            d="";
        }
        this.list=[a,b,c,d];
        if(d==""){
            this.checkData();
        }
    }
    find(n){
        let res=this.list[n-1];
        if(typeof(res )!=="undefined" ){
            return res;
        }
        return "";
    }
    findData( fileId,moduleId,unitId,func){
        let _this=this;
        if(func){
            return func( fileId,moduleId,unitId,_this);
        }
        return this.list[unitId];

    }
    saveData(fileId,moduleId,unitId,data){
        this.list[unitId]=data;
    }
    save(n,data){
        this.list[n-1]=data;
    }

    checkData(){
        for(let i=2;0<=i;i--){
            if( typeof(this.list[i])!=="undefined" &&this.list[i] !== ''){
                this.list[3]=this.list[i];
                this.list[i]=0;
                return;
            }
        }
    }
    toString(){
        let res=[];
        for(let i=0;i<this.list.length;i++){
            if(this.list[i]!=null){
                res.push(this.list[i])
            }
        }
        return res.toString();
    }
    /**
     * 对比 如果相同返回 true
     * 忽略对比值前面的0
     * n 从1计数
     * @param n
     * @param data
     * @returns {boolean}
     */
    isValue(n,data){
        let d="";
        if(  typeof(data )!=="undefined" &&data !== null){
            d=data.toString();
        }
        let r="";
        if( typeof(this.list[n-1] )!=="undefined" &&this.list[n-1] !== null){
            r=   this.list[n-1] .toString();
        }
        if(d===r) return true;
        return false;

    }
    isZero(n){
        if(this.list[n-1]==0){
            return true
        }
        return  false;

    }
    //编码
    encoded(){
        let _this=this;
        if(  this.list.length==0){
            return "";
        }
        let res=""
        for(let i=0;i<_this.list.length;i++){
            if(typeof(this.list[i])!=="undefined" &&this.list[i] !== null){
                let unit =this.list[i].toString();
                res+=unit+'a'
            }

        }
        return res.substr(0,res.length-1)
    }
    //解码
    decode(words){
        let list =words.split("a")
        for(let l=0;l<list.length;l++){
            this.list[l]=list[l].toString();
        }
        if(this.list[3]==0){
            this.checkData();
        }
    }
}
