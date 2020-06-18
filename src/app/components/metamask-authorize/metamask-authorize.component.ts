import {Component, OnInit, Input} from '@angular/core';
import {MetamaskAuthorizeInterface} from "../../controller/dialog.controller";

@Component({
    templateUrl: 'metamask-authorize.component.html',
    styleUrls: ['./metamask-authorize.component.scss']
})
export class MetamaskAuthorizeComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: MetamaskAuthorizeInterface;//各配置项信息
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

    //关闭窗口时
    onThisDialogClose(){
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function(){
            _this.onDialogClose();
        },250)//小于300
    }


}
