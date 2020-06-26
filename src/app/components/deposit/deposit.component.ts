import {Component, OnInit, Input} from '@angular/core';
import {DepositDialogConfigInterface} from "../../controller/dialog.controller";

import {MetamaskService} from "../../service/metamask.service";
import {AssetService} from "../../service/asset.service";
import {RootrexService} from "../../service/rootrex.service";
import {DialogController} from "../../controller/dialog.controller";
import {PopupController} from "../../controller/popup.controller";
import {TranslateService} from "@ngx-translate/core";

import BigNumber from "bignumber.js";
import {environment} from "../../../environments/environment";

@Component({
    templateUrl: 'deposit.component.html',
    styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: DepositDialogConfigInterface;//各配置项信息
    @Input() onDialogClose: Function;//必留参数

    fadeFlag: string = 'fadeIn';

    //钱包余额
    balanceMetamask: string = '-1';
    //交易所余额
    balanceRootrex: string = '-1';
    //充值金额
    depositNumber: string;
    //gas价格
    gasPrice: string = '0';
    //gas费
    gasFee: number = 0;
    //充值时gas的range值 0.00-1.00
    rangeValue: number = 0.01;
    //钱包余额不足错误标记
    balanceError: boolean = false;
    //metamask-auth dialog
    metamaskAuthorizeDialog: any;
    //current network
    currentNetwork: string = environment.config.ethNetwork;
    loadingFlag: boolean = true;

    /*-----Constructor Part-----*/

    constructor(private metamaskService: MetamaskService,
                private assetService: AssetService,
                private rootrexService: RootrexService,
                private dialogCtrl: DialogController,
                private popupCtrl: PopupController,
                private translate: TranslateService) {

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
        this.getMetamaskBalance();
        this.getRootrexBalance(this.config.tokenName);
        this.getGasPrice();
    }

    //获取账户余额
    getMetamaskBalance() {
        this.loadingFlag = true;
        if (this.metamaskService.isLogin()) {
            if (this.config.tokenName === 'ETH') {
                this.metamaskService.getBalance(this.metamaskService.getDefaultAccount(), balance => {
                    this.loadingFlag = false;
                    this.balanceMetamask = balance;
                    this.checkBalance();
                });
            } else {
                this.metamaskService.getBalanceByContractAndAddress(this.metamaskService.getDefaultAccount(), this.config.tokenContract, parseInt(this.config.tokenWei), balance => {
                    this.balanceMetamask = balance;
                    this.loadingFlag = false;
                    this.checkBalance();
                })
            }
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取交易所余额
    getRootrexBalance(tokenName: string) {
        if (this.metamaskService.isLogin()) {
            this.assetService.fetchMyAssetList(this.metamaskService.getDefaultAccount()).subscribe(res => {
                this.balanceRootrex = res.data.result.filter(data => {
                    return data.tokenName === tokenName
                })[0].tokenAmount;
                this.checkBalance();
            });
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取Gas费用
    getGasPrice() {
        this.rootrexService.fetchGasPrice().subscribe(res => {
            this.gasPrice = new BigNumber(res.data.gasPrice || 0).shiftedBy(-9).toString();
            this.rangeValue = new BigNumber(this.gasPrice).dividedBy(100).toNumber();
        });
    }

    //计算Gas价格 公式与获取Gas费用相反
    calculatorPrice() {
        if(this.rangeValue<=0.3){
            return parseInt(new BigNumber(this.rangeValue).multipliedBy(100).toFixed(0, 2));
        }else if(this.rangeValue<=0.5){
            return parseInt(new BigNumber(this.rangeValue).multipliedBy(350).minus(75).toFixed(0,2));
        }else{
            return parseInt(new BigNumber(this.rangeValue).multipliedBy(2000).minus(900).toFixed(0,2));
        }
    }

    //计算Gas费
    calculatorGas() {
        return new BigNumber(this.calculatorPrice()).dividedBy(1000000000).multipliedBy(this.config.tokenName === 'ETH' ? 60000 : 250000).toFixed(8);//50000 100000:充值时固定gas limit
    }

    //检查余额
    checkBalance() {
        if (this.depositNumber) {
            this.balanceError = !((new BigNumber(this.depositNumber || '0').isLessThanOrEqualTo(new BigNumber(this.balanceMetamask || '0'))) && new BigNumber(this.depositNumber || '0').isGreaterThanOrEqualTo(new BigNumber(0)));
        }
    }

    //输入限制 onkeydown
    onInputKeyDown(event) {
        let inputKey = (event && event.key) || '0';
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '。', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].indexOf(inputKey) === -1) {
            event.preventDefault();
            return;
        }
    }

    //输入限制 ngModelChange
    onModelChange(event) {
        event = event.replace('。', '.');//将中文。转换为英文.
        event = event.replace(/[^\d\.]/g, '');
        event === '.' ? event = '' : '';
        //去除多余的小数点
        let _split = event.split(".");
        if (_split.length && _split.length > 2) {//如果无法分割或者分割出的结果小于等于2,则不需要分割
            let tempStr = "";
            for (let i in _split) {
                tempStr += _split[i];
                i == '0' ? tempStr += "." : "";
            }
            event = tempStr;
        }
        //判断小数点后的长度,并做限制
        let _float = event.split(".");
        if (_float.length && _float.length === 2) {
            _float[0] === '' ? _float[0] = '0' : '';
            event = _float[0] + "." + _float[1].slice(0, 8)
        }
        let _this = this;
        setTimeout(() => {
            _this.depositNumber = event;
        }, 0)
    }

    //点击钱包余额时,赋值
    setDepositAmount() {
        if (this.balanceMetamask && this.balanceMetamask != '-1') {
            this.depositNumber = new BigNumber(this.balanceMetamask).toFixed(8, 1);
        }
    }

    //点击充值时
    onDepositClick() {
        if (this.metamaskService.isLogin()) {
            if(this.currentNetwork==='Main'?this.metamaskService.checkNetwork():!this.metamaskService.checkNetwork()){
                if (!this.balanceError && this.depositNumber && !new BigNumber(this.depositNumber).isLessThanOrEqualTo(0)) {
                    this.onThisDialogClose();
                    //要检测gas是否足够
                    this.metamaskService.getBalance(this.metamaskService.getDefaultAccount(), balance => {
                        if (new BigNumber(balance).isLessThan(new BigNumber(this.calculatorGas()))) {
                            this.popupCtrl.create({
                                message: this.translate.instant('Asset.NotEnoughEthInWalletAndDepositFailed'),
                                during: 3000
                            });
                        } else {
                            if (this.config.tokenName === 'ETH' && new BigNumber(this.depositNumber).isGreaterThanOrEqualTo(new BigNumber(this.balanceMetamask).minus(new BigNumber(this.calculatorGas())))) {
                                //如果充值ETH,要预留出GAS
                                this.depositNumber = new BigNumber(this.balanceMetamask).minus(this.calculatorGas()).toString();
                            }
                            //充值逻辑
                            this.rootrexService.deposit(this.metamaskService.getDefaultAccount(), new BigNumber(this.depositNumber).toNumber(), this.config.tokenName, this.config.limitApprove, parseInt(this.config.tokenWei), this.config.tokenContract, this.calculatorPrice(), res => {
                                this.onDepositCallback(res);
                            });
                        }
                    });
                }
            }else{
                //TODO alert error
            }
        } else {
            this.metamaskService.unlogin();
        }
    }

    //充值后回调
    onDepositCallback(res) {
        if (res) {
            let dialogObject = this.dialogCtrl.create({
                title: this.translate.instant('Asset.DepositSuccessful'),
                content: this.translate.instant('Asset.DepositCallbackContent'),
                buttons: [{
                    text: this.translate.instant('Common.Ok'),
                    color: 'normal',
                    handle: () => {
                        this.dialogCtrl.destroy(dialogObject);
                    }
                }]
            })
        } else {
            this.popupCtrl.create({
                message: this.translate.instant('Asset.DepositFailed'),
                during: 3000
            });
        }
    }

    //关闭弹窗
    onThisDialogClose() {
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function () {
            _this.onDialogClose();
        }, 250)//小于300
    }

}
