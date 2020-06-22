import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from '@ngx-translate/core';
import {PopupController} from "../controller/popup.controller";
import {DialogController} from "../controller/dialog.controller";

import {soliditySha3} from 'web3-utils'
import BigNumber from "bignumber.js";
import {Buffer} from 'buffer'
import {sha3} from 'ethereumjs-util'

import {environment} from "../../environments/environment";
import {UnlockMetamaskComponent} from "../components/unlock-metamask/unlock-metamask.component";
import {MetamaskComponent} from "../components/metamask/metamask.component";
import {SystemService} from "./system.service";

@Injectable()
export class MetamaskService {

    // TODO 整个Service特别是在init的时候需要做同步和回调处理,否则会有坑,之后考虑重写吧

    /*-----Data Part-----*/

    web3: any;

    // R1_CONTRACT_ADDRESS: string = '0x21a511078c1b2524379C7D9cA1E9aCAeBc275eA4'; //old
    // R1_CONTRACT_ADDRESS: string = '0x97b2F257e51Da5bD16f6Ec34A575C366ffB745C2'; //old
    // R1_CONTRACT_ADDRESS: string = '0xcC6550451dAfA6029fE8350DD1F8758467b40790'; //old
    // R1_CONTRACT_ADDRESS: string = '0x466eAEd25b91AF487A08Ea8Dfe12701E22DCB035'; //old for test
    // R1_CONTRACT_ADDRESS: string = '0x49e0aa9f3697cA6Cc93De80098640AE4B1071962';

    R1_CONTRACT_ADDRESS = '';
    R1_CONTRACT_PATH: string = 'assets/r1ABI.json?v=' + environment.config.resourceVersion;
    R1: any;//R1协议对象

    ERC20_CONTRACT_PATH: string = 'assets/erc20ABI.json?v=' + environment.config.resourceVersion;

    /*-----Constructor Part-----*/

    constructor(
        private translate: TranslateService,
        private http: HttpClient,
        private popupCtrl: PopupController,
        private dialogCtrl: DialogController,
        private systemService: SystemService
    ) {
        this.init();
    }

    /*-----Methods Part-----*/

    init() {
        if (this.checkInstall()) {
            this.initWeb3();
        }
    }

    //检测用户是否安装了metamask插件:boolean chrome/firefox/opera
    checkInstall() {
        return typeof window['web3'] !== 'undefined';
    }

    //初始化Web3对象
    async initWeb3() {
        if (!this.web3) {
            if (window['ethereum']) {
                this.web3 = new window['Web3'](window['ethereum']);
                await window['ethereum'].enable();
                this.checkAccountChange();
            } else {
                this.web3 = new window['Web3'](window['web3'].currentProvider);
            }
        } else {
            // console.log('web3已存在');
        }
        // this.web3 = new window['Web3'](window['web3'].currentProvider);

    }

    //验证是否登录:boolean
    isLogin() {
        if (this.checkInstall()) {
            return this.web3.eth.accounts && this.web3.eth.accounts.length !== 0;
        } else {
            return false;
        }
    }

    //验证当前网络(是否为主网:boolean
    checkNetwork() {
        if (this.isLogin()) {
            return this.web3.version.network === "1";
        } else {
            return false;
        }
    }

    //获取默认账号/当前使用账号:string
    getDefaultAccount() {
        if (this.isLogin()) {
            return this.web3.eth.defaultAccount;
        } else {
            return '';
        }
    }

    //获取所有账号:Array<string>
    getAllAccounts() {
        if (this.isLogin()) {
            return this.web3.eth.accounts;
        } else {
            return []
        }
    }

    //验证是否是合法的钱包地址:boolean address:钱包地址
    isAddress(address: string) {
        return this.web3.isAddress(address);
    }

    //获取R1协议对象
    getR1(callback: Function) {
        if (this.checkInstall()) {
            this.http.get(this.R1_CONTRACT_PATH).subscribe((res) => {
                let abi = JSON.parse(JSON.stringify(res));
                this.systemService.fetchSystemSetting().subscribe(res => {
                    this.R1_CONTRACT_ADDRESS = res.data.contractAddress;
                    this.R1 = this.web3.eth.contract(abi).at(this.R1_CONTRACT_ADDRESS);
                    callback(this.R1);
                });
            });
        } else {

        }
    }

    //获取ERC20代币余额
    getBalanceByContractAndAddress(address: string, contract: string, wei: number, callback: Function) {
        this.http.get(this.ERC20_CONTRACT_PATH).subscribe(res => {
            let abi = JSON.parse(JSON.stringify(res)).abi;
            let erc20 = this.web3.eth.contract(abi).at(contract);
            erc20.balanceOf(address, (err, balance) => {
                let tokenBalance = balance.shift(-wei).toNumber();
                callback(tokenBalance);
            })
        })
    }

    //获取ERC20代币额度
    getTokenApproveBalance(address: string, contract: string, callback: Function) {
        this.http.get(this.ERC20_CONTRACT_PATH).subscribe(res => {
            let abi = JSON.parse(JSON.stringify(res)).abi;
            let erc20 = this.web3.eth.contract(abi).at(contract);
            erc20.allowance(address, this.R1_CONTRACT_ADDRESS, (err, res) => {
                callback(res.toString());
            })
        })
    }

    //获取ERC20代币充值批准
    getTokenApproveData(address: string, contract: string, amount: number, wei: number, callback: Function) {
        this.http.get(this.ERC20_CONTRACT_PATH).subscribe(res => {
            let abi = JSON.parse(JSON.stringify(res)).abi;
            let erc20 = this.web3.eth.contract(abi).at(contract);
            let data = erc20.approve.getData(this.R1_CONTRACT_ADDRESS, new BigNumber(amount).multipliedBy(Math.pow(10, wei)).toString(), {from: address});
            callback(data);
        })
    }

    //获取余额:number? address:钱包地址
    getBalance(address: string, callback: Function) {
        if (this.isLogin()) {
            this.web3.eth.getBalance(address, (err, balance) => {
                if (err) {
                    callback('');
                } else {
                    callback(this.web3.fromWei(balance, 'ether').toString())
                }
            })
        } else {
            callback('');
        }
    }

    //上链所需生成hash方法 TODO for metamask(web3 0.20) only!!!!!
    soliditySha3(opts: any, type: string) {
        let hash_origin;
        // let hash_sign;
        if (type === 'withdraw') {//提现
            opts.amount = new BigNumber(opts.amount).shiftedBy(opts.wei).toFixed();
            hash_origin = soliditySha3(opts.r1contract, opts.user, opts.token, opts.amount, opts.nonce, opts.channelFeeAccount, opts.channelId);
        } else if (type === 'order') {//下单
            opts.amountBuy = new BigNumber(opts.amountBuy).shiftedBy(opts.tokenBuy.wei).toFixed();
            opts.amountSell = new BigNumber(opts.amountSell).shiftedBy(opts.tokenSell.wei).toFixed();
            hash_origin = soliditySha3(opts.r1contract, opts.tokenBuy.address, opts.amountBuy, opts.tokenSell.address, opts.amountSell, opts.baseToken, opts.expires, opts.nonce, opts.feeToken, opts.channelFeeAccount, opts.channelId)
        } else if (type === 'cancel') {
            hash_origin = soliditySha3(opts.nonce);
        } else if (type === 'cancelAll') {
            hash_origin = soliditySha3(opts.nonce);
        } else if (type === 'bindEmail') {
            hash_origin = soliditySha3(opts.nonce);
        } else {
            hash_origin = '';
        }
        // let ethHeaderBuffer = new Buffer("\x19Ethereum Signed Message:\n");
        // let messageBuffer = Buffer.from(hash_origin.substring(2),'hex');
        // let messageLengthBuffer = new Buffer(String(messageBuffer.length));
        // let ethMessage = Buffer.concat([ethHeaderBuffer,messageLengthBuffer, messageBuffer]);
        // hash_sign = '0x'+sha3(ethMessage).toString('hex');//Buffer->hex
        return {
            hash_origin: hash_origin,
            hash_sign: hash_origin
        };
    }

    //签名 address:地址,getDefaultAccount()获取 data:需签名的hash,具体每个方法生成的hash也不同 callbackSuccess:function(result),签名完成返回签名结果(r/s/v callbackError:function(),签名失败,非必须
    sign(address: string, hash: string, callbackSuccess: Function, callbackError: Function = () => {
    }) {
        try {
            // this.web3.eth.sign(address, hash, (err, res) => {
            this.web3.personal.sign(hash, address, (err, res) => {
                if (!err) {
                    let result = {
                        r: res.substring(0, 66),
                        s: "0x" + res.substring(66, 130),
                        v: "0x" + res.substring(130, 132)
                    };
                    callbackSuccess(result);
                } else {
                    callbackError();
                }
            });
        } catch (e) {
            callbackError();
        }
    }

    //获取gasPrice
    getGasPrice(callback: Function) {
        if (this.isLogin()) {
            this.web3.eth.getGasPrice((err, res) => {
                if (!err) {
                    callback(res);
                }
            })
        } else {
            callback(0)
        }
    }

    //转换成Wei
    toWei(value: number) {
        if (this.isLogin()) {
            return this.web3.toWei(value, 'ether');
        } else {
            return '0';
        }
    }

    //发起交易
    sendTransaction(operate: string, options: any, callback: Function) {
        // this.web3.eth.estimateGas({
        //     to: options.to,
        //     data: options.data
        // },(err,gas)=>{
        let gasLimit: number = operate === 'DepositETH' ? 60000 : operate === 'DepositToken' ? 250000 : operate === 'ApproveDepositToken' ? 250000 : 250000;
        if (this.isLogin()) {
            this.getGasPrice(gasPrice => {
                options.gas = new BigNumber(gasLimit).toNumber();
                if (!options.gasPrice) {//如果没有gasPrice 则用当前gasPrice
                    options.gasPrice = gasPrice;
                } else {//如果有gasPrice 则使用传入的gasPrice
                    options.gasPrice = options.gasPrice.toString();
                }
                this.web3.eth.sendTransaction(options, (err, transactionHash) => {
                    if (!err) {
                        // callback(transactionHash);
                        callback(true);
                    } else {
                        // callback(err);
                        callback(false);
                    }
                })
            });
        } else {
            callback(false);
        }
        // });
    }

    //未安装提示
    uninstall() {
        this.popupCtrl.create({
            message: this.translate.instant('MetaMask.PleaseInstall'),
            during: 3000
        })
    }

    //未登录提示
    unlogin() {
        if (this.checkInstall()) {
            this.showMetaMaskLogin();
            window['ethereum'].enable();
        } else {
            this.showMetaMaskIntroduce();
        }
    }

    //安装MetaMask
    showMetaMaskIntroduce() {
        this.dialogCtrl.createFromComponent(MetamaskComponent);
    }

    //解锁MetaMask
    showMetaMaskLogin() {
        let loginMetamaskDialog = this.dialogCtrl.createFromComponent(UnlockMetamaskComponent);
        let loginMetamaskInterval = setInterval(() => {
            if (this.isLogin()) {
                clearInterval(loginMetamaskInterval);
                this.dialogCtrl.destroy(loginMetamaskDialog);
            }
        }, 1000)
    }

    // 账号切换检测dc
    checkAccountChange() {
        ethereum.on('accountsChanged', function (accounts) {
            location.reload();

        })
    }

    //TODO 转账 ?是否需要在metamask里实现转账方法?
    transfer(from, to, value, asset) {
        //from 转出钱包
        //to 转入钱包
        //金额
        //单位
        //web3.eth.sendTransaction
    }

    //最终金额 web3.toWei('金额','ether')

}
