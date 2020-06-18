import {Component, OnInit, Input} from '@angular/core';
import {DialogConfigInterface} from "../../controller/dialog.controller";

@Component({
    templateUrl: 'dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: DialogConfigInterface;
    @Input() onDialogClose: Function;

    fadeFlag: string = 'fadeIn';

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

    onButtonClick(callback:Function){
        callback();
    }

    onThisDialogClose(){
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function(){
            _this.onDialogClose();
        },250)//小于300
    }


}
