import { Pipe, PipeTransform } from '@angular/core';
import {BigNumber} from 'bignumber.js'

@Pipe({
    name: 'kilo'
})
//交易页大于1000时显示k
export class KiloPipe implements PipeTransform {

    transform(number:any) {
        if(isNaN(parseFloat(number))){
            return number;
        }{
            if(parseFloat(number)<1000){
                return number;
            }else{
                return new BigNumber(number).shiftedBy(-3).toFixed(1,1).toString() + 'k';
            }
        }
    }
}
