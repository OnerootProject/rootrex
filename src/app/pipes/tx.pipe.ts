import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tx'
})
export class TxPipe implements PipeTransform {

    transform(tx:string,type:number=1) {
        if(type===1){
            return tx.length>30?(tx.substr(0,15)+'...'+tx.substr(tx.length-15)):tx;
        }else{
            return tx.length>8?tx.substr(0,8)+'...':tx;
        }
    }
}
