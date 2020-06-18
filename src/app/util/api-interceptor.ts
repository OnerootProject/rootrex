import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {MetamaskService} from "../service/metamask.service";
import {environment} from "../../environments/environment";

@Injectable()

export class ApiInterceptor implements HttpInterceptor {
    constructor(private metamaskService: MetamaskService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newHeader;
        let newReq;
        if (req.url.indexOf('/api/v2') !== -1) {
            newHeader = req.headers.set("Address", this.metamaskService.getDefaultAccount()).set("Appid", environment.config.appID.toString()).set("Client-Version", environment.config.version + "-Web").set("Client-Type", "1");
            newReq = req.clone({headers: newHeader});
        } else {
            newReq = req;
        }
        return next.handle(newReq).catch((error, caught) => {
            console.log("Error Occurred");
            console.log(error);
            return Observable.throw(error);
        }) as any;
    }
}