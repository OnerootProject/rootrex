import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {RootrexService} from '../../service/rootrex.service';
import {MetamaskService} from "../../service/metamask.service";

import {OrderInterface} from '../../interface/rootrex.interface';

import BigNumber from "bignumber.js";

@Component({
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    /*-----Data Part-----*/

    //loading
    loadingFlag: boolean = true;
    //buy or sell
    status: number;
    //order main data
    orderData: Array<OrderInterface>;
    //订单socket标记位
    orderSocket: boolean = false;
    //search
    search: string = '';
    //page
    currentPage: number = 1;
    pageSize: number = 10;
    totalRow: number = 0;

    /*-----Constructor Part-----*/

    constructor(private router: Router,
                private activatedRouter: ActivatedRoute,
                private rootrexService: RootrexService,
                private metamaskService: MetamaskService) {
    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        setTimeout(() => {
            this.init();
        }, 500)
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
        this.closeSocket();
    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.activatedRouter.params.subscribe((params) => {
            this.status = params.status === 'finished' ? 1 : 0;
            this.getMyOrderList();
        })
    }

    //获取我的委托/历史订单
    getMyOrderList(loadingFlag: boolean = true) {
        if (this.metamaskService.isLogin()) {
            this.orderData = [];
            this.loadingFlag = loadingFlag;
            this.rootrexService.fetchSearchOrderList(this.metamaskService.getDefaultAccount(), this.search, this.status, this.currentPage, this.pageSize).subscribe(res => {
                this.loadingFlag = false;
                this.orderData = res.data.result;
                this.totalRow = res.data.total;
                if (!this.orderSocket) {
                    this.getOrderStatusOrAssetUpdate();
                }
            })
        } else {

        }
    }

    //切换pending/finished订单
    onOrderTypeChange(status: number) {
        this.status = status;
        this.getMyOrderList();
    }

    //获取委托单更新数据
    getOrderStatusOrAssetUpdate() {
        this.orderSocket = true;
        this.rootrexService.fetchOrderStatusOrAssetUpdate(this.metamaskService.getDefaultAccount(), res => {
            if (res.type === 'order-status') {
                let data = res.data;
                for (let i of this.orderData) {
                    if (i.id === data.id && i.symbol === data.symbol) {
                        i.status = data.status;
                        i.avgUnitPrice = data.avgUnitPrice;
                        i.calBaseAmount = data.calBaseAmount;
                        i.calBaseInventory = data.calBaseInventory;
                        i.calTokenAmount = data.calTokenAmount;
                        i.calTokenInventory = data.calTokenInventory;
                        i.calTokenSuccess = data.calTokenSuccess;//已成交量
                        i.calBaseSuccess = data.calBaseSuccess;//已成交额
                        i.calUnitPrice = data.calUnitPrice;
                    }
                }
                if (data.status != '0' && data.status != '2' && data.status != '-6') {
                    this.getMyOrderList(false);
                }
            } else {
                //预留
            }
        });
    }

    //订单筛选
    onOrderSearchClick(search: string) {
        this.search = search;
        this.getMyOrderList();
    }

    //翻页组件
    onPageChange(currentPage: number) {
        this.currentPage = currentPage;
        this.getMyOrderList();
    }

    //pageSize更改
    onSizeChange(pageSize: number) {
        this.pageSize = pageSize;
        this.getMyOrderList();
    }

    //关闭socket连接
    closeSocket() {
        this.rootrexService.closeUserSocket();
    }
}
