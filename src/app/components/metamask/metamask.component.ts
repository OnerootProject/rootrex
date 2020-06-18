import {Component, OnInit, Input} from '@angular/core';
import {DepositDialogConfigInterface} from "../../controller/dialog.controller";

@Component({
    templateUrl: 'metamask.component.html',
    styleUrls: ['./metamask.component.scss']
})
export class MetamaskComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: DepositDialogConfigInterface;//各配置项信息
    @Input() onDialogClose: Function;//必留参数

    fadeFlag: string = 'fadeIn';
    currentSelectExplorer:string='chrome';

    /*-----Constructor Part-----*/

    constructor() {

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

    onThisDialogClose(){
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function(){
            _this.onDialogClose();
        },250)//小于300
    }

}
