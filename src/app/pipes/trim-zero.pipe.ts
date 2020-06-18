import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'trimZero'
})
export class TrimZeroPipe implements PipeTransform {

    transform(number: any) {
        return parseFloat(number);
    }
}
