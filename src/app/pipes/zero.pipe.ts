import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'zero'
})
export class ZeroPipe implements PipeTransform {

    transform(number: any) {
        return parseFloat(number) >=0 ? number : '-';
    }
}
