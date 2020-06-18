import {Pipe, PipeTransform} from '@angular/core';
import BigNumber from 'bignumber.js'

@Pipe({
    name: 'finishAmount'
})
export class FinishAmountPipe implements PipeTransform {

    transform(amount: string) {
        let _amount = new BigNumber(amount).toNumber();
        let level:number = _amount >= 10000 ? 0 : _amount >= 1000 ? 1 : _amount >= 100 ? 2 : _amount >= 10 ? 3 : 4;
        return new BigNumber(Math.ceil(new BigNumber(amount).shiftedBy(level).toNumber())).shiftedBy(-level).toFixed(level,1);
    }
}
