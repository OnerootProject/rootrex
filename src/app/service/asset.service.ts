import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Api} from "../util/api.util";

import {ResponseArrayInterface, ResponseInterface} from "../interface/response.interface";
import {AssetInterface, AssetHistoryInterface, WithdrawFeeInterface} from "../interface/asset.interface";
import {Subject} from "rxjs/Subject";
import {PaginatorApiInterface, PaginatorInterface} from "../interface/paginator.interface";
import {PaginatorService} from "./paginator.service";

@Injectable()
export class AssetService {

    /*-----Data Part-----*/

    //当前货币
    currency: Subject<any> = new Subject<any>();

    /*-----Constructor Part-----*/

    constructor(private api: Api,
                private http: HttpClient,
                private paginatorService: PaginatorService
    ) {

    }

    /*-----Methods Part-----*/

    //设置当前货币
    setCurrency(currency: string) {
        localStorage.setItem('current-currency', currency);
        this.currency.next({currency: currency});
    }

    //获取当前货币观察对象
    getCurrencyObservable(): Observable<any> {
        return this.currency.asObservable();
    }

    //获取系统语言判断当前货币
    getCurrency(){
        let explorer = navigator.language || navigator['userLanguage'];
        let langExplorer = explorer.substr(0,2);
        let currency = localStorage.getItem('current-currency');
        if(langExplorer == 'zh'){
            return currency ? currency : 'CNY';
        }else if(langExplorer == 'en'){
            return currency ? currency : 'USD';
        }else if(langExplorer == 'ko'){
            return currency ? currency : 'KRW';
        }else{
            return currency ? currency : 'USD';
        }
    }
    //获取当前货币符号
    getSymbolCurrency(){
        if(this.getCurrency()== 'KRW'){
            return this.currency ? '₩' : this.currency;
        }else if(this.getCurrency() == 'USD'){
            return this.currency ? '$' : this.currency;
        }else if(this.getCurrency() == 'CNY'){
            return this.currency ? '¥' : this.currency;
        }else{
            return this.currency ? '$' : this.currency;
        }
    }


    // 查看我的所有币种资产列表
    fetchMyAssetList(account: string): Observable<ResponseArrayInterface<AssetInterface>> {
        return this.http.get<ResponseArrayInterface<AssetInterface>>(this.api.asset.getMyAssetList.replace("{account}", account).replace("{all}", "1"));
    }

    // 查看我的资产历史列表
    fetchMyAssetHistory(account: string, tokenName: string,currentPage:number,pageSize:number): Observable<ResponseArrayInterface<AssetHistoryInterface>> {
        let page: PaginatorInterface = {
            currentPage: currentPage,
            pageSize: pageSize,
            totalPage: 0,
            totalRow: 0
        };
        let pageApi: PaginatorApiInterface = this.paginatorService.paginatorToApi(page);
        return this.http.get<ResponseArrayInterface<AssetHistoryInterface>>(this.api.asset.getMyAssetHistory.replace("{account}", account).replace("{tokenName}", tokenName).replace("{offset}",pageApi.offset.toString()).replace("{limit}",pageApi.limit.toString()));
    }

    //获取提现最小额度
    fetchWithdrawFee(tokenName:string): Observable<ResponseInterface<WithdrawFeeInterface>>{
        return this.http.get<ResponseInterface<WithdrawFeeInterface>>(this.api.asset.getWithdrawFee.replace("{tokenName}",tokenName))
    }

    //设置当前资产隐藏状态
    setAssetHidenStatus(status:string){
        localStorage.setItem('asset-hiden-status',status);
    }

    //获取当前资产隐藏状态
    getAssetHidenStatus(){
        return localStorage.getItem('asset-hiden-status') || 'show';
    }

    //设置当前小额资产隐藏状态
    setSmallAmountAssetHidenStatus(status:string){
        localStorage.setItem('small-amount-asset-hiden-status',status);
    }

    //获取当前小额资产隐藏状态
    getSmallAmountAssetHidenStatus(){
        return localStorage.getItem('small-amount-asset-hiden-status') || 'show';
    }

    //获取资产的Column: 币种 钱包余额 ROOTREX余额 ROOTREX冻结余额 价值
    getColumn(){
        let column = localStorage.getItem('AssetColumn');
        return column ? column : 'tokenName';
    }

    //设置资产的Column: 币种 钱包余额 ROOTREX余额 ROOTREX冻结余额 价值
    setColumn(column: string){
        localStorage.setItem('AssetColumn', column);
    }

    //获得资产的Column的排序
    getAsc(){
        let marketAsc = localStorage.getItem('AssetAsc');
        return marketAsc == 'yes'
    }

    //设置资产的Column的排序
    setAsc(ascTrue: boolean){
        localStorage.setItem('AssetAsc', ascTrue ? "yes" : "no");
    }

}
