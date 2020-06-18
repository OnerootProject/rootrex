import {Pipe, PipeTransform} from '@angular/core';
import {BigNumber} from "bignumber.js";
// {{  xxx | percent:x?:y? }}
// x:小数点保留位数 默认:2位
// y:大于0时是否显示'+'号 true:显示 false:不显示 默认:true
// 例:{{ '0.387' | percent:2:true}} => 变为百分比并在大于0时显示+号 = +38.70%
@Pipe({
    name: 'percent'
})
export class PercentPipe implements PipeTransform {

    transform(input: any, decimal: number = 2, showSymbol: boolean = true) {
        if(input){
            let percentFloat = parseFloat(input);
            if (percentFloat > 0 && showSymbol) {
                return ('+' + new BigNumber(percentFloat).toFixed(decimal,0) + '%').replace(',', '');
            } else {
                return (new BigNumber(percentFloat).toFixed(decimal,0) + '%').replace(',', '');
            }
        }else{
            return '0.00%';
        }

    }
}
