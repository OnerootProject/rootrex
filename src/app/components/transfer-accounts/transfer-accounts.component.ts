import {Component, OnInit, Input} from '@angular/core';

@Component({
    templateUrl: 'transfer-accounts.component.html',
    styleUrls: ['./transfer-accounts.component.scss']
})
export class TransferAccountsComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() onDialogClose: Function;//必留参数

    fadeFlag: string = 'fadeIn';

    rangeValue:number;//range当前值 0.00-1.00
    balanceError:boolean=false;//钱包余额不足错误

    /*-----Constructor Part-----*/

    constructor(
       
    ) {

    }

    /*-----Lifecycle Park-----*/

    //Mounted
    ngOnInit() {
        this.init();
    }

    //After Mounted
    ngAfterViewInit() {

    }

    //Update
    ngAfterViewChecked() {

    }

    //Destroy
    ngOnDestroy() {

    }

    /*-----Methods Part-----*/

    //init
    init() {

    }

    //关闭窗口时
    onThisDialogClose(){
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function(){
            _this.onDialogClose();
        },250)//小于300
    }


}
