import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Api} from "../util/api.util";

import {PaginatorService} from "./paginator.service";

@Injectable()
export class ExplorerService {

    /*-----Data Part-----*/

    /*-----Constructor Part-----*/

    constructor(private api: Api,
                private http: HttpClient,
                private paginatorService: PaginatorService,
                ) {

    }

    /*-----Methods Part-----*/

    send(title,options={}){
        console.log(window['Notification'])
        if(window['Notification']['permission']==='granted'){
            this.sendNotification(title,options);
        }else{
            window['Notification'].requestPermission(function (permission) {
                if (permission === "granted") {
                    this.sendNotification(title, options);
                }
            })
        }
    }

    //发送浏览器通知
    sendNotification(title,options={}){
        let notification = new window['Notification'](title,options);
    }





}
