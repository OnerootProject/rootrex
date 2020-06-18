import {Component, OnInit} from '@angular/core';
import {AssetService} from '../../../service/asset.service';
import {AssetHistoryInterface} from "../../../interface/asset.interface";

import {MetamaskService} from "../../../service/metamask.service";

import {environment} from "../../../../environments/environment";

@Component({
    templateUrl: './assets-history.component.html',
    styleUrls: ['./assets-history.component.scss']
})
export class AssetsHistoryComponent implements OnInit {

    /*-----Data Part-----*/

    // loading
    loadingFlag: boolean = true;
    //
    tokenName: string = '';
    assetHistoryData: Array<AssetHistoryInterface> = [];
    //page
    currentPage:number = 1;
    pageSize:number = 10;
    totalRow:number = 0;

    /*-----Constructor Part-----*/

    constructor(private assetService: AssetService,
                public metamaskService: MetamaskService
    ) {

    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        setTimeout(()=>{
            this.init();
        },500);
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

    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getAssetsHistory(this.tokenName);
    }

    //获取资产历史
    getAssetsHistory(tokenName: string) {
        if(this.metamaskService.isLogin()){
            this.loadingFlag = true;
            this.assetHistoryData = [];
            this.assetService.fetchMyAssetHistory(this.metamaskService.getDefaultAccount(), tokenName,this.currentPage,this.pageSize).subscribe(res => {
                this.loadingFlag = false;
                this.assetHistoryData = res.data.result;
                this.totalRow = res.data.total;
            })
        }else{

        }
    }

    //TokenName改变时,重新请求接口数据
    onTokenNameChange() {
        this.currentPage = 1;
        this.getAssetsHistory(this.tokenName);
    }

    // 翻页组件
    onPageChange(page) {
        this.currentPage = page;
        this.getAssetsHistory(this.tokenName);
    }

    onSizeChange(pageSize){
        this.pageSize = pageSize;
        this.getAssetsHistory(this.tokenName);
    }

    //去EthScan
    goToEthScan(tx:string){
        window.open((environment.config.ethNetwork==='Main'?'https://www.etherscan.io/tx/':'https://kovan.etherscan.io/tx/')+tx);
    }

}
