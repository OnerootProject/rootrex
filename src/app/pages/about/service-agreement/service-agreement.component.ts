import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    templateUrl: './service-agreement.component.html',
    styleUrls: ['./service-agreement.component.scss']
})
export class ServiceAgreementComponent implements OnInit {

    /*-----Data Part-----*/

    /*-----Constructor Part-----*/

    constructor(private router: Router) {
    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        this.init();
    }

    //After Mounted
    ngAfterViewInit() {
        document.documentElement.scrollTop = 0;
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

}
