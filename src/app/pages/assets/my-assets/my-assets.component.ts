import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MetamaskService} from "../../../service/metamask.service";
import {AssetService} from "../../../service/asset.service";
import {SymbolService} from "../../../service/symbol.service";
import {AssetInterface} from "../../../interface/asset.interface";
import {SymbolInterface} from "../../../interface/symbol.interface";
import {DialogController} from "../../../controller/dialog.controller";
import {DepositComponent} from "../../../components/deposit/deposit.component";
import {WithdrawComponent} from "../../../components/withdraw/withdraw.component";
import {Subscription} from "rxjs/Subscription";

import BigNumber from "bignumber.js";

@Component({
    templateUrl: './my-assets.component.html',
    styleUrls: ['./my-assets.component.scss']
})
export class AssetsComponent implements OnInit {

    /*-----Data Part-----*/

    // loading
    loadingFlag: boolean = true;
    //资产数据
    assetListData: Array<AssetInterface> = [];
    assetListShowData: Array<AssetInterface> = [];
    //交易对数据
    symbolListData: Array<SymbolInterface> = [];
    symbolListTradeData: Array<SymbolInterface> = [];
    //currency subscribe对象
    currencySubscribe: Subscription;
    //当前货币单位
    currency: string;
    //ETH与当前选定法币汇率
    exchangeRate = {
        ETH: 0
    };
    //全部资产
    totalETH: number = -1;
    //隐藏全部资产标记
    isTotalHide: boolean = true;
    //搜索
    tokenName: string = '';
    //隐藏余额为0标记
    isHide: boolean = false;
    //是否第一次查询
    isFirst: boolean = true;

    //interval们
    intervalFlag: boolean = true;
    rootrexBalanceInterval: any;
    legalInterval: any;

    /*-----Constructor Part-----*/

    constructor(private router: Router,
                public assetService: AssetService,
                private symbolService: SymbolService,
                public metamaskService: MetamaskService,
                private dialogCtrl: DialogController) {
    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        setTimeout(() => {
            this.init();
        }, 500);
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
        this.closeInterval();
        this.closeSocket();
        this.unsubscribeCurrency();
    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getSymbolList();
        this.getExchangeRateByLegalCurrency('ETH', this.assetService.getCurrency());
        this.subscribeCurrency();
    }

    //获取交易对列表
    getSymbolList() {
        this.symbolService.fetchSymbolList('').subscribe(res => {
            this.symbolListData = res.data.result;
            this.symbolListTradeData = res.data.result;
            this.getMyAssetList();
        });
    }

    //获取总资产隐藏状态
    getAssetHidenStatus() {
        this.isTotalHide = this.assetService.getAssetHidenStatus() == 'hide';
    }

    //获取小额资产隐藏状态
    getSmallAmountAssetHidenStatus() {
        this.isHide = this.assetService.getSmallAmountAssetHidenStatus() == 'hide';
    }

    //设置隐藏状态
    setAssetHideStatus() {
        this.isTotalHide = !this.isTotalHide;
        this.assetService.setAssetHidenStatus(this.isTotalHide ? 'hide' : 'show');
    }

    //获取我的资产列表
    getMyAssetList() {
        if (this.metamaskService.isLogin()) {
            this.loadingFlag = true;
            this.assetListShowData = [];
            this.assetService.fetchMyAssetList(this.metamaskService.getDefaultAccount()).subscribe(res => {
                this.getAssetHidenStatus();
                this.getSmallAmountAssetHidenStatus();
                this.loadingFlag = false;
                this.assetListData = res.data.result.map(data => {
                    return {
                        address: data.address,
                        tokenName: data.tokenName,
                        tokenAmount: new BigNumber(data.tokenAmount).toFixed(8, 1),//余额
                        frozenAmount: new BigNumber(data.frozenAmount).toFixed(8, 1),//冻结余额
                        totalAmount: this.calculatorValue(data.tokenAmount, data.frozenAmount, data.tokenName).toString(),
                        decimal: data.decimal,
                        walletBalance: '0',//钱包余额
                        isRefresh: false,
                        logo: data.logo,
                        limitApprove: data.limitApprove,
                        tradeList: this.symbolListTradeData.filter(r => {
                            return r.tokenName === data.tokenName;
                        }),
                        isExpand: false
                    }
                });
                this.assetListShowData = this.assetListData;
                this.onTokenNameOrIsHideChange();
                this.calculatorTotalAsset();
                this.updateRootrexBalance();
                if (this.isFirst) {
                    this.getAllTokenBalance(false);
                    this.getSymbolUpdate();
                    this.isFirst = false;
                }
            })
        } else {
            // this.metamaskService.unlogin();
        }
    }

    //更新余额
    updateRootrexBalance() {
        if (this.intervalFlag) {
            if (this.metamaskService.getDefaultAccount()) {
                this.assetService.fetchMyAssetList(this.metamaskService.getDefaultAccount()).subscribe(res => {
                    if (res && res.data && res.data.result && res.data.result.length) {
                        for (let i of this.assetListData) {
                            for (let j of res.data.result) {
                                if (i.tokenName === j.tokenName) {
                                    i.tokenAmount = new BigNumber(j.tokenAmount).toFixed(8, 1);
                                    i.frozenAmount = new BigNumber(j.frozenAmount).toFixed(8, 1);
                                    i.totalAmount = this.calculatorValue(i.tokenAmount, i.frozenAmount, i.tokenName).toString();
                                }
                            }
                        }
                    }
                    this.sort(this.assetService.getColumn());//重新获取到数据后排序
                    this.rootrexBalanceInterval = setTimeout(() => {
                        this.updateRootrexBalance();
                    }, 30000)
                })
            } else {

            }
        }
    }

    //获取交易对更新信息
    getSymbolUpdate() {
        this.symbolService.fetchSymbolListUpdate(res => {
            for (let i of this.symbolListData) {
                if (i.tokenName === res.tokenName && i.baseName === res.baseName) {
                    i.price = res.price;
                }
            }
            this.calculatorTotalAsset();
        })
    }

    //订阅currency变动
    subscribeCurrency() {
        this.currency = this.assetService.getCurrency();
        this.currencySubscribe = this.assetService.getCurrencyObservable().subscribe(res => {
            this.currency = res.currency;
            this.getExchangeRateByLegalCurrency('ETH', this.currency);
        })
    }

    //取消订阅currency变动
    unsubscribeCurrency() {
        this.currencySubscribe && this.currencySubscribe.unsubscribe && this.currencySubscribe.unsubscribe();
    }

    //计算价值
    calculatorValue(volume1: string, volume2: string, assetName: string) {
        let volume: number = new BigNumber(volume1).plus(new BigNumber(volume2)).toNumber();
        if (assetName === 'ETH') {
            return volume;
        } else {
            //获取所有token为assetName的交易对
            let symbol1 = this.symbolListData.filter(data => {
                return data.tokenName === assetName;
            });
            if (symbol1.length) {
                //获取所有token为assetName且base为ETH的交易对
                let symbol2 = symbol1.filter(data => {
                    return data.baseName === 'ETH';
                })[0];
                if (symbol2) {//如果有assetName/ETH交易对
                    return new BigNumber(volume.toString()).multipliedBy(new BigNumber(symbol2.price)).toNumber();
                } else {//如果没有assetName/ETH交易对
                    let symbol3 = this.symbolListData.filter(data => {
                        return symbol1.filter(d => {
                            return d.baseName === data.tokenName && data.baseName === 'ETH' && d.tokenName === assetName;
                        })
                    })[0];
                    if (symbol3) {
                        return new BigNumber(volume.toString()).multipliedBy(new BigNumber(symbol3.price)).multipliedBy(new BigNumber(symbol1.filter(data => {
                            return data.baseName === symbol3.tokenName;
                        })[0].price)).toNumber();
                    } else {
                        return 0;
                    }
                }
            } else {
                return 0;
            }
        }
    }

    //计算总资产
    calculatorTotalAsset() {
        this.totalETH = 0;
        for (let i of this.assetListData) {
            this.totalETH = new BigNumber(this.totalETH.toString()).plus(new BigNumber(this.calculatorValue(i.tokenAmount, i.frozenAmount, i.tokenName).toString())).toNumber()
        }
    }

    //搜索关键字或是否隐藏变化后
    onTokenNameOrIsHideChange() {
        this.assetListShowData = this.assetListData.filter(data => {
            return data.tokenName.toLocaleLowerCase().indexOf(this.tokenName.toLocaleLowerCase()) !== -1;
        }).filter(data => {
            return this.isHide ? new BigNumber(data.totalAmount).isGreaterThanOrEqualTo(0.001) : data;
        });
        this.sort(this.assetService.getColumn());//获取到数据后排序
        this.assetService.setSmallAmountAssetHidenStatus(this.isHide ? 'hide' : 'show');
    }

    //获取我所有token的余额
    getAllTokenBalance(event) {
        if (this.metamaskService.isLogin()) {
            for (let i of this.assetListData) {
                this.getTokenBalance(this.metamaskService.getDefaultAccount(), i)
            }
            if (event) {
                event.stopPropagation();
            }
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取我某个token的余额
    getTokenBalance(address: string, asset: AssetInterface) {
        asset.isRefresh = true;
        if (asset.tokenName === 'ETH') {
            this.metamaskService.getBalance(address, res => {
                asset.isRefresh = false;
                this.setTokenBalance(asset.tokenName, res.toString())
            })
        } else {
            this.metamaskService.getBalanceByContractAndAddress(address, asset.address, parseInt(asset.decimal), res => {
                asset.isRefresh = false;
                this.setTokenBalance(asset.tokenName, res.toString())
            });
        }
    }

    //获取并设置ETH与法币汇率
    getExchangeRateByLegalCurrency(currency: string, targetCurrency: string) {//cny&usd
        this.symbolService.fetchExchangeRateByLegalCurrency(currency).subscribe(res => {
            //待优化
            this.exchangeRate.ETH = new BigNumber(res.data.ETH.rates.filter(data => {
                return data.code === targetCurrency
            })[0].rate || 0).toNumber();
            if(this.intervalFlag){
                this.legalInterval = setTimeout(()=>{
                    this.getExchangeRateByLegalCurrency('ETH', this.assetService.getCurrency());
                },5000)
            }
        })
    }

    //设置钱包余额
    setTokenBalance(tokenName: string, balance: string) {
        for (let i of this.assetListData) {
            if (i.tokenName === tokenName) {
                i.walletBalance = new BigNumber(balance).toFixed(8, 1);
            }
        }
        this.onTokenNameOrIsHideChange();
    }

    //排序
    sortBy(column: string) {
        this.assetService.setAsc((this.assetService.getColumn() != column) ? false : !this.assetService.getAsc());
        this.assetService.setColumn(column);
        this.sort(column);
    }

    private sort(column: string) {
        this.assetListShowData.sort((pre, next) => {
            let result: boolean;
            if (column == 'tokenName') {
                result = pre[column] > next[column];
            } else {
                result = new BigNumber(pre[column]).isGreaterThan(new BigNumber(next[column])) || (new BigNumber(pre[column]).isEqualTo(new BigNumber(next[column])) && pre['tokenName'] > next['tokenName']);
            }
            // if(pre['tokenName']==='ETH'){
            //     return -1;
            // }else if (result) {
            if (result) {
                return this.assetService.getAsc() ? 1 : -1;
            } else {
                return this.assetService.getAsc() ? -1 : 1;
            }
        })
    }

    //去交易
    gotoTrade(tokenName: string, baseName: string) {
        if (tokenName !== 'ETH') {
            this.router.navigateByUrl('trade/' + tokenName + '_' + baseName);
        }
    }

    //充值
    onDepositClick(token: AssetInterface) {
        if (this.metamaskService.isLogin()) {
            this.dialogCtrl.createFromComponent(DepositComponent, {
                tokenName: token.tokenName,
                tokenWei: token.decimal,
                tokenContract: token.address,
                limitApprove: token.limitApprove,
                callback: () => {
                    setTimeout(() => {
                        this.getTokenBalance(this.metamaskService.getDefaultAccount(), token);
                    }, 5000);
                }
            });
        } else {
            this.metamaskService.unlogin();
        }
    }

    //提现
    onWithdrawClick(token: AssetInterface) {
        if (this.metamaskService.isLogin()) {
            this.dialogCtrl.createFromComponent(WithdrawComponent, {
                tokenName: token.tokenName,
                tokenWei: token.decimal,
                tokenContract: token.address,
                callback: () => {
                    setTimeout(() => {
                        this.getTokenBalance(this.metamaskService.getDefaultAccount(), token);
                    }, 5000);
                }
            });
        } else {
            this.metamaskService.unlogin();
        }
    }

    //关闭Socket
    closeSocket() {
        this.symbolService.closeSymbolSocket();
    }

    //关闭interval
    closeInterval() {
        this.intervalFlag = false;
        clearInterval(this.rootrexBalanceInterval);
        clearInterval(this.legalInterval);
    }

}
