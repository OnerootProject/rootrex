import {Component, OnInit, Input} from '@angular/core';

import {PopupConfigInterface} from "../../controller/popup.controller";

@Component({
    templateUrl: 'popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: PopupConfigInterface;
    @Input() onPopupClick: Function;

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
        this.createFadeOutAnimation();
    }

    createFadeOutAnimation() {
        this.config.during = this.config.during || 3000;
        this.config.message = this.config.message || 'Popup Component by Zeero';

        if (this.config.during >= 300) {
            let _this = this;
            setTimeout(function () {
                _this.fadeFlag = 'fadeOut';
            }, this.config.during - 300);
        }
    }

    onThisPopupClick() {
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function(){
            _this.onPopupClick();
        },250);//小于300
    }

}
