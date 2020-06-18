import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Api } from "../util/api.util";
import { ResponseArrayInterface, ResponseInterface } from "../interface/response.interface";
import { AmountInterface } from "../interface/amount.interface";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
@Injectable()
export class AmountService {
    /*-----Data Part-----*/
    
    /*-----Constructor Part-----*/
    constructor(private api: Api, private http: HttpClient) {
    }
    /*-----Methods Part-----*/
    //获取手续费
    fetchAmount(appid: any):Observable<ResponseInterface<any>>{
        return this.http.get<ResponseArrayInterface<AmountInterface>>(this.api.amount.getAmount.replace("{appid}", appid));
    }
}