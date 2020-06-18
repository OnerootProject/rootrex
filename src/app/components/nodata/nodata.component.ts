import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'nodata',
    templateUrl: 'nodata.component.html',
    styleUrls: ['./nodata.component.scss']
})
export class NoDataComponent implements OnInit {

    /*-----Data Part-----*/

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

}
