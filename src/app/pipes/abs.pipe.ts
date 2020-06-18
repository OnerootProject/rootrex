import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'abs'
})
export class AbsPipe implements PipeTransform {

    transform(number:string) {
        return Math.abs(parseInt(number));
    }
}
