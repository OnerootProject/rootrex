import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js'

@Pipe({
    name: 'toFixed'
})
export class ToFixedPipe implements PipeTransform {

    transform(number:any,level:number=-1,mode:any=1) {
        //TODO level要对负数做支持 for trade页的深度合并
        let target;
        if(isNaN(parseFloat(number))){
            target=0;
        }else{
            target=number;
        }
        return level!==-1?new BigNumber(target).toFixed(level,mode):new BigNumber(target).toFixed();
    }
}
