import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Api} from "../util/api.util";

import {ResponseArrayInterface, ResponseInterface} from "../interface/response.interface";
import {
    OrderInterface, OrderTradeInterface, PendingOrderInterface,
    PendingOrderResponseInterface, OrderDetailInterface, PendingOrderShowInterface
} from "../interface/rootrex.interface";
import {PaginatorInterface, PaginatorApiInterface} from "../interface/paginator.interface";

import {PopupController} from "../controller/popup.controller";
import {DialogController} from "../controller/dialog.controller";

import {PaginatorService} from "./paginator.service";
import {MetamaskService} from "./metamask.service";
import {LanguageService} from "./langulage.service";

import {MetamaskAuthorizeComponent} from "../components/metamask-authorize/metamask-authorize.component";

import BigNumber from "bignumber.js";
import {environment} from "../../environments/environment";

@Injectable()
export class RootrexService {

    /*-----Data Part-----*/

    webSocketPendingOrder: any;
    webSocketFinishedOrder: any;
    webSocketGasPrice: any;
    webSocketUser:any;

    //metamask-auth dialog
    metamaskAuthorizeDialog: any;

    R1: any;//从metamask.service获取的R1对象

    /*-----Constructor Part-----*/

    constructor(private api: Api,
                private http: HttpClient,
                private paginatorService: PaginatorService,
                private metamaskService: MetamaskService,
                private popupCtrl: PopupController,
                private dialogCtrl: DialogController,
                private translate: TranslateService,
                private languageService: LanguageService) {
        this.metamaskService.getR1((res) => {
            this.R1 = res;
        });
    }

    /*-----Methods Part-----*/

    //获取GasPrice
    fetchGasPrice() {
        return this.http.get<ResponseInterface<any>>(this.api.rootrex.getGasPrice);
    }

    //获取买卖单数据和深度图增量数据 打开并监听深度数据websocket,买入及卖出页面使用数据也是使用此接口数据
    fetchIncrementPendingOrderBySymbol(symbol: string,callbackOnOpen: Function, callbackOnMessage: Function, callbackOnClose: Function) {
        this.webSocketPendingOrder = new WebSocket(this.api.ws.getPendingOrderBySymbol.replace("{symbol}", symbol));
        this.webSocketPendingOrder.onopen = function(evt){
            callbackOnOpen(true);
        };
        this.webSocketPendingOrder.onmessage = function (evt) {
            let data: PendingOrderResponseInterface<any> = JSON.parse(evt.data);
            //开始整理socket数据
            let depthFormatData: PendingOrderShowInterface<PendingOrderInterface> = {
                buy: [],
                sale: [],
                version: data.v
            };
            //处理pending买卖单数据
            if(data && data.b && data.s){
                depthFormatData.buy = data.b.map(data => {
                    return {price: parseFloat(data.p), volume: parseFloat(data.ta), amount: 0, percent: 0}
                });
                depthFormatData.sale = data.s.map(data => {
                    return {price: parseFloat(data.p), volume: parseFloat(data.ta), amount: 0, percent: 0}
                });
                callbackOnMessage(depthFormatData);
            }
        };
        this.webSocketPendingOrder.onclose = function(evt){
            callbackOnClose(true);
        }
    }

    //关闭PendingSocket
    closePendingSocket() {
        this.webSocketPendingOrder && this.webSocketPendingOrder.close && this.webSocketPendingOrder.close();//如果已经打开连接，则关闭
    }

    //获取pending订单片量数据
    fetchPendingOrderBySymbol(symbol:string): Observable<ResponseInterface<PendingOrderResponseInterface<any>>>{
        return this.http.get<ResponseInterface<PendingOrderResponseInterface<any>>>(this.api.rootrex.getPendingOrderBySymbol.replace('{symbol}',symbol));
    }

    //获取当前交易对历史成交数据
    fetchFinishedOrderBySymbol(symbol: string, callback: Function) {
        this.webSocketFinishedOrder = new WebSocket(this.api.ws.getFinishedOrderBySymbol.replace("{symbol}", symbol));
        this.webSocketFinishedOrder.onmessage = function (evt) {
            let data = JSON.parse(evt.data);
            callback(data);
        };
    }

    //关闭FinishedSocket
    closeFinishedSocket() {
        this.webSocketFinishedOrder && this.webSocketFinishedOrder.close && this.webSocketFinishedOrder.close();//如果已经打开连接，则关闭
    }

    //获取订单状态及资产更新数据
    fetchOrderStatusOrAssetUpdate(account:string, callback: Function){
        this.webSocketUser = new WebSocket(this.api.ws.getOrderStatusOrAssetUpdate.replace('{account}',account));
        this.webSocketUser.onmessage = function(evt){
            let data = JSON.parse(evt.data);
            callback(data);
        }
    }

    //关闭订单状态及资产更新socket
    closeUserSocket(){
        this.webSocketUser && this.webSocketUser.close && this.webSocketUser.close();//如果已经打开连接，则关闭
    }

    //获取GasPrice和MinOrderLimit
    fetchGasPriceAndMinOrderLimit(callback:Function){
        this.webSocketGasPrice = new WebSocket(this.api.ws.getGasPriceAndMinOrderLimit);
        this.webSocketGasPrice.onmessage = function(evt){
            let data = JSON.parse(evt.data);
            callback(data);
        }
    }

    //关闭GasPrice和MinOrderLimit和socket
    closeGasPriceAndMinOrderLimitSocket(){
        this.webSocketGasPrice && this.webSocketGasPrice.close && this.webSocketGasPrice.close();
    }

    //获取我的订单列表
    fetchMyOrderList(account: string, symbol: string, status: number, currentPage: number, pageSize: number): Observable<ResponseArrayInterface<OrderInterface>> {
        let page: PaginatorInterface = {
            currentPage: currentPage,
            pageSize: pageSize,
            totalPage: 0,
            totalRow: 0
        };
        let pageApi: PaginatorApiInterface = this.paginatorService.paginatorToApi(page);
        return this.http.get<ResponseArrayInterface<OrderInterface>>(this.api.rootrex.getMyOrderList.replace("{account}", account).replace("{symbol}", symbol).replace("{status}", status.toString()).replace("{offset}", pageApi.offset.toString()).replace("{limit}", pageApi.limit.toString()));
    }

    //获取我的订单列表（订单页）
    fetchSearchOrderList(account: string, symbol: string, status: number, currentPage: number, pageSize: number): Observable<ResponseArrayInterface<OrderInterface>> {
        let page: PaginatorInterface = {
            currentPage: currentPage,
            pageSize: pageSize,
            totalPage: 0,
            totalRow: 0
        };
        let pageApi: PaginatorApiInterface = this.paginatorService.paginatorToApi(page);
        return this.http.get<ResponseArrayInterface<OrderInterface>>(this.api.rootrex.getSearchOrderList.replace("{account}", account).replace("{symbol}", symbol).replace("{status}", status.toString()).replace("{offset}", pageApi.offset.toString()).replace("{limit}", pageApi.limit.toString()));
    }

    //获取订单详情
    fetchOrderDetailById(id: string, symbol: string): Observable<ResponseInterface<OrderDetailInterface>> {
        return this.http.get<ResponseInterface<OrderDetailInterface>>(this.api.rootrex.getOrderDetailById.replace("{id}", id).replace("{symbol}", symbol));
    }

    //获取订单关联交易列表 0买 1卖
    fetchOrderTradeByHash(id: string, type: string, symbol: string, currentPage: number, pageSize: number): Observable<ResponseArrayInterface<OrderTradeInterface>> {
        let page: PaginatorInterface = {
            currentPage: currentPage,
            pageSize: pageSize,
            totalPage: 0,
            totalRow: 0
        };
        let pageApi: PaginatorApiInterface = this.paginatorService.paginatorToApi(page);
        return this.http.get<ResponseArrayInterface<OrderTradeInterface>>(this.api.rootrex.getOrderTradeByHash.replace("{id}", id).replace("{type}", type).replace("{symbol}", symbol).replace("{offset}", pageApi.offset.toString()).replace("{limit}", pageApi.limit.toString()))
    }

    //充值
    deposit(account: string, value: number, tokenName: string, limitApprove:string, wei: number, contract: string, gas: string, callback: Function) {
        if (tokenName === 'ETH') {//充值ETH
            let data = this.R1.deposit.getData({from: account, value: value});
            this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
                message: this.translate.instant('Asset.NowDeposit').replace('{value}', value).replace('{token}', tokenName),
                action: this.translate.instant('Asset.DepositTransaction')
            });
            this.metamaskService.sendTransaction('DepositETH',{
                from: account,
                to: this.R1.address,
                value: this.metamaskService.toWei(value),
                data: data,
                gasPrice: new BigNumber(gas).shiftedBy(9)
            }, (res) => {
                this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
                callback(res);
            })
        } else {
            this.popupCtrl.create({
                message: this.translate.instant('Asset.QueryQuota'),
                during: 800
            });
            this.metamaskService.getTokenApproveBalance(account, contract, res => {
                if (new BigNumber(res || 0).shiftedBy(-wei).isGreaterThanOrEqualTo(new BigNumber(value))) {
                    //如果额度够 直接充值
                    this.depositToken(account, value, tokenName, wei, contract, gas, callback);
                } else {
                    //如果额度不够 先增加额度
                    let dialog = this.dialogCtrl.create({
                        title: tokenName + this.translate.instant('Asset.Approve'),
                        content: this.translate.instant('Asset.ApproveDialog1') + '\n' +
                        this.translate.instant('Asset.ApproveDialog2').replace('{token}', tokenName).replace('{token}', tokenName) + '\n' +
                        this.translate.instant('Asset.ApproveDialog3'),
                        buttons: [
                            {
                                text: this.translate.instant('Asset.DenyAuth'),
                                color: 'red',
                                handle: () => {
                                    callback(false);
                                    this.dialogCtrl.destroy(dialog);
                                }
                            },
                            {
                                text: this.translate.instant('Asset.ApproveAuth'),
                                color: 'normal',
                                handle: () => {
                                    this.dialogCtrl.destroy(dialog);
                                    this.metamaskService.getTokenApproveData(this.metamaskService.getDefaultAccount(), contract, limitApprove=='0'?100000000000000:value, wei, res => {
                                        // this.metamaskService.getTokenApproveData(this.metamaskService.getDefaultAccount(), contract, 0, wei, res => {//赋予1的额度
                                        this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
                                            message: this.translate.instant('Asset.ApproveMessage').replace('{token}',tokenName),
                                            action: this.translate.instant('Asset.ApproveTransaction')
                                        });
                                        this.metamaskService.sendTransaction('ApproveDepositToken',{
                                            from: account,
                                            to: contract,
                                            value: 0,
                                            data: res,
                                            gasPrice: new BigNumber(gas).shiftedBy(9)
                                        }, re => {
                                            this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
                                            if (re) {
                                                this.popupCtrl.create({
                                                    message: this.translate.instant('Asset.ApproveSuccess'),
                                                    during: 3000
                                                });
                                                this.depositToken(account, value, tokenName, wei, contract, gas, callback);
                                            } else {
                                                callback(false);
                                            }
                                        })
                                    })
                                }
                            }
                        ]
                    });
                }
            });
        }
    }

    //充值Token
    depositToken(account: string, value: number, tokenName: string, wei: number, contract: string, gas: string, callback: Function) {
        let data = this.R1.depositToken.getData(contract, new BigNumber(value).multipliedBy(Math.pow(10, wei)).toString(), {from: account});
        this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
            message: this.translate.instant('Asset.NowDeposit').replace('{value}',value).replace('{token}',tokenName),
            action: this.translate.instant('Asset.DepositTransaction')
        });
        this.metamaskService.sendTransaction('DepositToken',{
            from: account,
            to: this.R1.address,
            value: 0,
            data: data,
            gasPrice: new BigNumber(gas).shiftedBy(9)
        }, res => {
            this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
            if (res) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }

    //提现
    withdraw(account: string, value: string, tokenInfo: any, callback: Function) {
        let nonce = new Date().getTime();
        let opts = {
            r1contract: environment.config.contract,
            user: account,
            token: tokenInfo.tokenContract,
            amount: value,
            nonce: nonce,
            wei: tokenInfo.tokenWei
        };
        let hash = this.metamaskService.soliditySha3(opts, 'withdraw');
        this.metamaskService.sign(account, hash.hash_sign, data => {
            let params = {
                address: account,
                amount: value,
                token: tokenInfo.tokenName,
                nonce: nonce,
                hash: hash.hash_origin,
                v: data.v,
                r: data.r,
                s: data.s,
                lang: this.languageService.get()
            };
            this.http.post<ResponseInterface<any>>(this.api.rootrex.withdraw, params).subscribe(res => {
                if (!res.code) {
                    callback(true)
                } else {
                    callback(false, res.message)
                }
            })
        }, err => {
            callback(false)
        });
    }

    //下单 type 0:买 1:卖
    order(account: string, tokenInfo: any, baseInfo: any, symbol: string, price: number, amount: number, type: number, callback: Function) {
        let nonce = new Date().getTime();
        let opts = {
            r1contract: environment.config.contract,
            tokenBuy: type === 0 ? tokenInfo : baseInfo,
            amountBuy: type === 0 ? new BigNumber(amount) : new BigNumber(price).multipliedBy(new BigNumber(amount)),
            tokenSell: type === 0 ? baseInfo : tokenInfo,
            amountSell: type === 0 ? new BigNumber(price).multipliedBy(new BigNumber(amount)) : new BigNumber(amount),
            baseToken: baseInfo.address,
            expires: 99999999,
            nonce: nonce,
            // feeToken: baseInfo.address
            feeToken: '0x0000000000000000000000000000000000000000'
        };
        let hash = this.metamaskService.soliditySha3(opts, 'order');
        this.metamaskService.sign(account, hash.hash_sign, data => {
            let params = {
                type: type,
                price: price,
                amount: amount,
                address: account,
                hash: hash.hash_origin,
                v: data.v,
                r: data.r,
                s: data.s,
                lang: this.languageService.get(),
                symbol: symbol,
                nonce: nonce,
                // feeToken: baseInfo.address
                feeToken: '0x0000000000000000000000000000000000000000',
                appid: environment.config.appID
            };
            this.http.post<ResponseInterface<any>>(this.api.rootrex.order, params).subscribe(res => {
                if (!res.code) {
                    callback(true)
                } else {
                    callback(false, res.message)
                }
            });
        }, err => {
            callback(false)
        })
    }

    //撤单
    withdrawal(account: string, symbol: string, id: number, callback: Function) {
        let nonce = new Date().getTime();
        let opts = {
            nonce: nonce
        };
        let hash = this.metamaskService.soliditySha3(opts, 'cancel');
        this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
            // message: '正在撤销' + symbol + '交易对下ID为' + id + '的委托',
            // action: '撤销交易'
            message: '',
            action: this.translate.instant('MetaMask.Sign')
        });
        this.metamaskService.sign(account, hash.hash_sign, data => {
            this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
            let params = {
                orderId: id,
                symbol: symbol,
                address: account,
                hash: hash.hash_origin,
                v: data.v,
                r: data.r,
                s: data.s,
                nonce: nonce,
                lang: this.languageService.get()
            };
            this.http.post<ResponseInterface<any>>(this.api.rootrex.cancel.replace("{id}", id.toString()), params).subscribe(res => {
                callback(res);
            })
        }, () => {
            this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
        })
    }

    //全部撤单
    cancelAll(account: string, symbol: string, callback: Function) {
        let nonce = new Date().getTime();
        let opts = {
            nonce: nonce
        };
        let hash = this.metamaskService.soliditySha3(opts, 'cancelAll');
        this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
            // message: '正在撤销' + (symbol ? (symbol + '交易对下') : '') + '全部委托',
            // action: '撤销交易'
            message: '',
            action: this.translate.instant('MetaMask.Sign')
        });
        this.metamaskService.sign(account, hash.hash_sign, data => {
            this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
            let params = {
                symbol: symbol,
                address: account,
                hash: hash.hash_origin,
                v: data.v,
                r: data.r,
                s: data.s,
                nonce: nonce,
                lang: this.languageService.get()
            };
            this.http.post<ResponseInterface<any>>(this.api.rootrex.cancelAll, params).subscribe(res => {
                callback(res);
            })
        }, () => {
            this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
        })
    }


}
