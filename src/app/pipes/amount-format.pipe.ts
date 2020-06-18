import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'amountFormat'
})
export class AmountFormatPipe implements PipeTransform {

    transform(amount: any): string {
        let plusFlag:string = '';
        if(amount.toString().substr(0,1)==='+'){
            plusFlag='+';
        }
        amount = parseFloat(amount);
        if(amount < 1000) {
            return plusFlag+amount.toFixed(2);
        } else if(amount < 10000) {
            return plusFlag+amount.toFixed(1);
        } else {
            return plusFlag+amount.toFixed(0);
        }
    }
}
