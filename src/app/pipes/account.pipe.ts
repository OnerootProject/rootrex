import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'account'
})
export class AccountPipe implements PipeTransform {

    transform(account:string) {
        return account.length>16?account.substring(0,8)+'...'+account.substring(account.length-8,account.length):account;
    }
}
