import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Api} from "../util/api.util";
import {PaginatorService} from "./paginator.service";

import {ResponseArrayInterface, ResponseInterface} from "../interface/response.interface";
import {SymbolInterface, SymbolMarketInterface} from "../interface/symbol.interface";
import {PaginatorApiInterface, PaginatorInterface} from "../interface/paginator.interface";


@Injectable()
export class SymbolService {

    /*-----Data Part-----*/

    webSocketSymbolUpdate: any;

    /*-----Constructor Part-----*/

    constructor(private api: Api,
                private paginatorService: PaginatorService,
                private http: HttpClient) {

    }

    /*-----Methods Part-----*/

    //获取交易对收藏信息
    fetchSymbolFavorite(account:string){
        return this.http.get<ResponseArrayInterface<SymbolInterface>>(this.api.symbol.getSymbolFavoriteList.replace("{account}",account));
    }

    //获取交易对列表
    fetchSymbolList(baseToken: string,currentPage:number,pageSize:number): Observable<ResponseArrayInterface<SymbolInterface>> {
        let page: PaginatorInterface = {
            currentPage: currentPage,
            pageSize: pageSize,
            totalPage: 0,
            totalRow: 0
        };
        let pageApi: PaginatorApiInterface = this.paginatorService.paginatorToApi(page);
        return this.http.get<ResponseArrayInterface<SymbolInterface>>(this.api.symbol.getSymbolList.replace("{baseToken}", baseToken).replace("{offset}",pageApi.offset.toString()).replace("{limit}",pageApi.limit.toString()));
    }

    //通过websocket获取交易对数据更新
    fetchSymbolListUpdate(callback: Function) {
        this.webSocketSymbolUpdate = new WebSocket(this.api.ws.getAssetListUpdate);
        this.webSocketSymbolUpdate.onmessage = function (evt) {
            if(evt && evt.data){
                let data = JSON.parse(evt.data);
                callback(data);
            }
        };
    }

    //关闭交易对数据Socket
    closeSymbolSocket() {
        this.webSocketSymbolUpdate && this.webSocketSymbolUpdate.close && this.webSocketSymbolUpdate.close();
    }

    //获取BaseToken列表
    fetchBaseTokenList(): Observable<ResponseArrayInterface<string>> {
        return this.http.get<ResponseArrayInterface<string>>(this.api.symbol.getBaseTokenList);
    }

    //设置交易对收藏状态
    setSymbolFav(account: string, symbol: string, isFav: number): Observable<ResponseInterface<object>> {
        let params = {
            symbol: symbol,
            address: account,
            flag: isFav.toString()
        };
        return this.http.post<ResponseInterface<object>>(this.api.symbol.setSymbolFav,params);
    }

    //获取某交易对详情
    fetchSymbolDetailBySymbol(account: string, symbol: string): Observable<ResponseInterface<SymbolInterface>> {
        return this.http.get<ResponseInterface<SymbolInterface>>(this.api.symbol.getSymbolDetailBySymbol.replace("{symbol}", symbol));
    }

    //根据法币单位获取与ETH汇率
    fetchExchangeRateByLegalCurrency(currency: string): Observable<ResponseInterface<SymbolMarketInterface>> {
        return this.http.get<ResponseInterface<SymbolMarketInterface>>(this.api.symbol.getExchangeRateByLegalCurrency.replace("{currency}", currency));
    }

    //获取K线图筛选的时间
    supportedResolutions() {
        return this.http.get(this.api.rootrex.getSupportedResolutions);
    }

}
