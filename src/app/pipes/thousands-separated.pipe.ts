import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'thousandsSeparated'
})
export class ThousandsSeparatedPipe implements PipeTransform {

    transform(input: any): string {
        if(isNaN(parseFloat(input))){
            return '0';
        }else{
            return input.toString().replace(',', '');
        }
    }

}
