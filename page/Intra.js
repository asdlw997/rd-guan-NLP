

/**
 *
 * 就是一万个比特
 * 相互转换的一些方法
 *

 */
export default class Intra {





    /**
     * 连接前
     * 连接中
     * 连接后
     *
     *   事件
     *
     */

    constructor(){
        let buff=new Uint8Array(1250);
        this.list=[buff]
        this.data={};
        this.handles = {};
    }


    outData(){
        let buff=[];
        for(let i=0;i<this.list.length;i++){
            buff.push(...this.list[i])
        }
        let res= new Uint8Array(buff);
        return res;
    }
    loadData(buff){
        let res;
        let dataBuff= new Uint8Array(buff);
        let length=0;
        if(dataBuff){
            res=[]
            while (dataBuff.byteLength-1250*length>0){
                let   temlBuff=new Uint8Array(1250);
                temlBuff .set(dataBuff.subarray(length*1250, length*1250+1250))
                res.push(temlBuff )
                length++;
            }
        }else {
            let   temlBuff=new Uint8Array(1250);
            res=[temlBuff]
        }
        this.list=res;
    }

    findLength(){
        return this.list.length;
    }

    static findIntra(){

        return new Intra();
    }

    static intraToIntras(intra){
        let res= new Array();
        for(let i=0;i<intra.list.length;i++){
            let intra=new Intra();
            intra.list[0]=intra.list[i];
            res.push(intra )
        }
        return res;
    }

    static intrasToIntra(intras){
        let intra=new Intra();
        intra.list= new Array();
        for(let i=0;i<intras.length;i++){
            intra.list.push(...intras[i].list)
        }
        return intra;
    }


    static intrasToBuff(intras){
        let res= new Array();
        for(let i=0;i<intras.length;i++){
            for(let l=0;l<intras[i].list.length;l++){
                res.push(...(intras[i].list[l]))
            }

        }
        let dataBuff= new Uint8Array(res);
        return dataBuff;
    }

    static buffToIntras(buff){
        let res= new Array();
        let dataBuff= new Uint8Array(buff);
        let length=0;
        if(dataBuff){
            while (dataBuff.byteLength-1250*length>0){
                let intra=new Intra();
                intra.list[0].set(dataBuff.subarray(length*1250, length*1250+1250))
                res.push(intra )
                length++;
            }
        }
        return res;
    }







    static txtToIntra(txt){
        let intra = new Intra();
        let buff=new TextEncoder().encode(txt);

        intra.loadData(buff);

        return intra;
    }



    intraToTxt(){
        let buff2 =this.outData()
        for(let i=buff2.length;i>1; i--){
            if(buff2[i-1]==0){
                buff2=  buff2 .subarray(0, i-1)
            }else {

                break
            }

        }

        let        res=new TextDecoder().decode(buff2);
        return res;


    }

}
