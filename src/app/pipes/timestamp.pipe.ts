import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
    name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

    transform(timestamp:any, format:string = 'MM/DD HH:mm') {
        if(isNaN(parseInt(timestamp))){
            return '-'
        }else{
            return moment.unix(parseInt(timestamp)).format(format);
        }
    }
}
