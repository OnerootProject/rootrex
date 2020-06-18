import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    templateUrl: './privacy-statement.component.html',
    styleUrls: ['./privacy-statement.component.scss']
})
export class PrivacyStatementComponent implements OnInit {

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
