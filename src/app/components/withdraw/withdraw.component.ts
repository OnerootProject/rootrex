import {Component, OnInit, Input} from '@angular/core';
import {DialogController, DepositDialogConfigInterface} from "../../controller/dialog.controller";
import {MetamaskService} from "../../service/metamask.service";
import {AssetService} from "../../service/asset.service";
import {RootrexService} from "../../service/rootrex.service";
import {MetamaskAuthorizeComponent} from "../metamask-authorize/metamask-authorize.component";
import {PopupController} from "../../controller/popup.controller";
import {TranslateService} from "@ngx-translate/core";

import BigNumber from 'bignumber.js'

@Component({
    templateUrl: 'withdraw.component.html',
    styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: DepositDialogConfigInterface;//各配置项信息
    @Input() onDialogClose: Function;//必留参数

    fadeFlag: string = 'fadeIn';

    balanceMetamask: string = '-1';//钱包余额
    balanceRootrex: string = '-1';//交易所余额
    //提现金额
    withdrawNumber: string;
    //最小提现额
    minWithdrawAmount: string = '-1';
    balanceError: boolean = false;//钱包余额不足错误
    //metamask-auth dialog
    metamaskAuthorizeDialog: any;
    //interval flag
    intervalFlag: boolean = true;
    withdrawFeeInterval: any;
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
        this.clearInterval();
    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getMetamaskBalance();
        this.getRootrexBalance(this.config.tokenName);
        this.getWithdrawFee(this.config.tokenName);
    }

    //获取账户余额
    getMetamaskBalance() {
        if (this.metamaskService.isLogin()) {
            if (this.config.tokenName === 'ETH') {
                this.metamaskService.getBalance(this.metamaskService.getDefaultAccount(), balance => {
                    this.balanceMetamask = balance;
                    this.checkBalance();
                });
            } else {
                this.metamaskService.getBalanceByContractAndAddress(this.metamaskService.getDefaultAccount(), this.config.tokenContract, parseInt(this.config.tokenWei), balance => {
                    this.balanceMetamask = balance;
                    this.checkBalance();
                })
            }
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取交易所余额
    getRootrexBalance(tokenName: string) {
        this.loadingFlag = true;
        if (this.metamaskService.isLogin()) {
            this.assetService.fetchMyAssetList(this.metamaskService.getDefaultAccount()).subscribe(res => {
                this.loadingFlag = false;
                this.balanceRootrex = res.data.result.filter(data => {
                    return data.tokenName === tokenName
                })[0].tokenAmount;
            });
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取最小提现额
    getWithdrawFee(tokenName:string){
        this.assetService.fetchWithdrawFee(tokenName).subscribe(res=>{
            this.minWithdrawAmount = res.data.gasTokenFee;
            if(this.intervalFlag){
                this.withdrawFeeInterval = setTimeout(()=>{
                    this.getWithdrawFee(this.config.tokenName);
                },30000)
            }
        })
    }

    //检查余额
    checkBalance() {
        if(this.withdrawNumber){
            this.balanceError = !((new BigNumber(this.withdrawNumber || '0').isLessThanOrEqualTo(new BigNumber(this.balanceRootrex || '0'))) && new BigNumber(this.withdrawNumber || '0').isGreaterThanOrEqualTo(new BigNumber(0)));
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
            _float[0]===''?_float[0]='0':'';
            event = _float[0] + "." + _float[1].slice(0, 8);
        }
        let _this = this;
        setTimeout(() => {
            _this.withdrawNumber = event;
        }, 0)
    }

    //点击交易所余额时,赋值
    setWithdrawAmount(){
        if(this.balanceRootrex && this.balanceRootrex != '-1'){
            this.withdrawNumber = new BigNumber(this.balanceRootrex).toFixed(8,1);
        }
    }

    //点击提现按钮时
    onWithdrawClick() {
        if (this.metamaskService.isLogin()) {
            if (!this.balanceError && this.withdrawNumber && !new BigNumber(this.withdrawNumber).isLessThanOrEqualTo(0)) {
                if(new BigNumber(this.withdrawNumber).isLessThan(new BigNumber(this.minWithdrawAmount))){
                    this.popupCtrl.create({
                        message: this.translate.instant('Asset.MinWithdrawAmountError'),
                        during: 3000
                    })
                }else{
                    this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
                        message: this.translate.instant('Asset.NowWithdraw').replace('{value}',this.withdrawNumber).replace('{token}',this.config.tokenName),
                        action: this.translate.instant('Asset.WithdrawTransaction')
                    });
                    this.rootrexService.withdraw(this.metamaskService.getDefaultAccount(), this.withdrawNumber, this.config, (res, message = '') => {
                        //关闭metamask授权弹窗
                        this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
                        //如果充值成功 关闭本充值弹窗
                        this.onThisDialogClose();
                        //弱提示弹窗
                        this.popupCtrl.create({
                            message: res ? this.translate.instant('Asset.WithdrawSuccessful') : message !== '' ? message : this.translate.instant('Asset.WithdrawFailed'),
                            during: 3000
                        });
                    });
                }
            }
        } else {
            this.metamaskService.unlogin();
        }
    }

    //关闭对话框时
    onThisDialogClose() {
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function () {
            _this.onDialogClose();
        }, 250)//小于300
    }

    //
    clearInterval(){
        clearInterval(this.withdrawFeeInterval);
        this.intervalFlag = false;
    }

}
