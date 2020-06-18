import { Pipe, PipeTransform } from '@angular/core';
import {BigNumber} from 'bignumber.js'

@Pipe({
    name: 'deepMerge'
})
export class DeepMergePipe implements PipeTransform {

    transform(number:any) {
        let _number:number = parseInt(number || '0');
        return new BigNumber(1).shiftedBy(_number).toFixed();
    }
}
