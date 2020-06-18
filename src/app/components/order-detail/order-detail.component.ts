import {Component, OnInit, Input} from '@angular/core';
import {OrderDetailConfigInterface} from "../../controller/dialog.controller";
import {RootrexService} from "../../service/rootrex.service";
import {OrderDetailInterface, OrderInterface, OrderTradeInterface} from "../../interface/rootrex.interface";
import {MetamaskService} from "../../service/metamask.service";

import BigNumber from "bignumber.js";

import {environment} from "../../../environments/environment";

@Component({
    templateUrl: 'order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: OrderDetailConfigInterface;
    @Input() onDialogClose: Function;//必留参数

    loadingFlag: boolean = true;
    fadeFlag: string = 'fadeIn';
    balanceError: boolean = false;//钱包余额不足错误

    orderDetailData:OrderDetailInterface;
    orderTradeData:Array<OrderTradeInterface>

    currentPage:number = 1;
    pageSize:number = 10;

    currentNetwork:string = environment.config.ethNetwork;


    /*-----Constructor Part-----*/

    constructor(
        private rootrexService:RootrexService,
        private metamaskService: MetamaskService
    ) {

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
        this.getOrderDetailById(this.config.id,this.config.symbol);

    }

    //通过OrderId获取订单详情
    getOrderDetailById(id:string,symbol:string){
        this.loadingFlag = true;
        this.rootrexService.fetchOrderDetailById(id,symbol).subscribe(res=>{
            this.loadingFlag = false;
            this.orderDetailData = res.data;
            this.orderDetailData.avgGasPrice = new BigNumber(this.orderDetailData.avgGasPrice).shiftedBy(-9).toString();
            this.orderDetailData.totalGasFee = new BigNumber(this.orderDetailData.totalGasFee).shiftedBy(-18).toString();
            let symbol = this.orderDetailData.tokenName+'_'+this.orderDetailData.baseName;
            this.getOrderTradeById(this.config.id,this.orderDetailData.type,symbol,this.currentPage,this.pageSize);
        })
    }

    //通过OrderId查询Trade
    getOrderTradeById(id:string,type:string,symbol:string,currentPage:number,pageSize:number){
        this.rootrexService.fetchOrderTradeByHash(id,type,symbol,currentPage,pageSize).subscribe(res=>{
            this.orderTradeData = res.data.result;
        })
    }

    //撤单
    onWithdrawalClick(id: number, symbol: string) {
        this.rootrexService.withdrawal(this.metamaskService.getDefaultAccount(), symbol, id, res => {
            this.config.closeFunction();
            this.onThisDialogClose();
        })
    }

    //关闭窗口时
    onThisDialogClose() {
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function () {
            _this.onDialogClose();
        }, 250)//小于300
    }

}
