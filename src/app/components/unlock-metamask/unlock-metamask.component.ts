import {Component, OnInit, Input} from '@angular/core';
import {DepositDialogConfigInterface} from "../../controller/dialog.controller";

@Component({
    templateUrl: 'unlock-metamask.component.html',
    styleUrls: ['./unlock-metamask.component.scss']
})
export class UnlockMetamaskComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: DepositDialogConfigInterface;//各配置项信息
    @Input() onDialogClose: Function;//必留参数

    fadeFlag: string = 'fadeIn';

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

    close(){
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function(){
            _this.onDialogClose();
        },250)//小于300
    }


}
