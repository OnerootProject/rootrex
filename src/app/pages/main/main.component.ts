import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import BigNumber from "bignumber.js";

import {SymbolInterface} from "../../interface/symbol.interface";
import {SymbolService} from "../../service/symbol.service";
import {MetamaskService} from '../../service/metamask.service';
import {Subscription} from "rxjs/Subscription";
import {AssetService} from "../../service/asset.service";
import {TickerService} from "../../service/ticker.service";
import {NoticeService} from "../../service/notice.service";
import {LanguageService} from "../../service/langulage.service";
import {BannerInterface} from "../../interface/notice.interface";

declare var Swiper;

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    /*-----Data Part-----*/
    // loading
    loadingFlag: boolean = true;
    //Banner数据
    bannerListData: Array<BannerInterface> = [];
    //交易对收藏数组
    symbolFavorite: Array<string> = [];
    //交易对列表
    symbolListData: Array<SymbolInterface> = [];
    symbolListShowData: Array<SymbolInterface> = [];
    //BaseToken列表
    baseTokenListData: Array<string> = [];
    //搜索
    tokenName: string = '';
    //currency subscribe对象
    currencySubscribe: Subscription;
    //language subscribe对象
    languageSubscribe: Subscription;
    //ETH/RNT与当前选定法币汇率
    exchangeRate :any = {};
    //interval们
    intervalFlag: boolean = true;
    legalInterval: any;

    currentPage: number = 1;
    pageSize: number = 10;
    totalRow: number = 0;

    /*-----Constructor Part-----*/

    constructor(private router: Router,
                private symbolService: SymbolService,
                public metamaskService: MetamaskService,
                public assetService: AssetService,
                public tickerService: TickerService,
                private noticeService: NoticeService,
                private languageService: LanguageService) {

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

    }

    //Update
    ngAfterViewChecked() {

    }

    //Destroy
    ngOnDestroy() {
        this.closeSocket();
        this.closeInterval();
        this.unsubscribeCurrency();
        this.unsubscribeLanguage();
    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getBannerList();
        this.getSymbolFavoriteList();
        this.getBaseTokenList();
        this.subscribeCurrency();
        this.subscribeLanguage();
        console.log('v0.3')
    }

    //获取Banner列表
    getBannerList() {
        this.bannerListData = [];
        this.noticeService.fetchBannerList().subscribe(res => {
            this.bannerListData = res.data.result;
            setTimeout(() => {
                this.setSwiper();
            }, 1000);//after angular dom created
        })
    }

    //设置滚动
    setSwiper() {
        let swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
        if(this.bannerListData.length < 2){
            swiper.autoplay.stop();
        }else{
            swiper.autoplay.start();
        }
    }

    //获取交易对收藏列表
    getSymbolFavoriteList() {
        this.symbolFavorite = [];
        this.symbolListShowData = [];
        this.loadingFlag = true;
        if (this.metamaskService.isLogin()) {
            this.symbolService.fetchSymbolFavorite(this.metamaskService.getDefaultAccount()).subscribe(res => {
                //将用户收藏交易对写入this.symbolFavorite
                for (let i of res.data.result) {
                    this.symbolFavorite.push(i.symbol);
                }
                //将favorite数据存入this.symbolFavorite
                if (this.tickerService.getTab() === 'fav') {
                    //Loading=>false
                    this.loadingFlag = false;
                    //当前是收藏列表,直接将res存入data
                    this.symbolListData = res.data.result;
                    this.setSymbolData();
                } else {
                    //当前不是收藏列表,继续获取symbolList
                    this.getSymbolList();
                }
            })
        } else {
            this.getSymbolList();
        }
    }

    //获取交易对列表
    getSymbolList() {
        this.symbolService.fetchSymbolList(this.tickerService.getTab(),this.currentPage, this.pageSize).subscribe(res => {
            this.loadingFlag = false;
            this.symbolListData = res.data.result;
            this.symbolListShowData = res.data.result;
            this.totalRow = res.data.total;
            this.setSymbolData();
        });
    }

    //切换页面方法
    onPageChange(currentPage:number){
        this.currentPage = currentPage;
        this.getSymbolFavoriteList();
    }

    //切换pageSize方法
    onSizeChange(pageSize:number){
        this.pageSize = pageSize;
        this.getSymbolFavoriteList();
    }

    //交易对数据获取后续处理
    setSymbolData() {
        //将交易对标上星级
        for (let i of this.symbolListData) {
            i.isFavorite = this.symbolFavorite.indexOf(i.symbol) !== -1 ? 1 : 0;
        }
        this.onTokenNameChange();
        this.getSymbolUpdate();
        this.sort(this.tickerService.getColumn());
    }

    //获取交易对更新信息
    getSymbolUpdate() {
        this.symbolService.closeSymbolSocket();
        this.symbolService.fetchSymbolListUpdate(res => {
            for (let i of this.symbolListData) {
                if (i.tokenName === res.tokenName && i.baseName === res.baseName) {
                    i.price = res.price;
                    i.lastPrice = res.lastPrice;
                    i.highPrice24h = res.highPrice24h;
                    i.lowPrice24h = res.lowPrice24h;
                    i.rise = res.rise;
                    i.tradeBaseAmount = res.tradeBaseAmount;
                }
            }
            this.sort(this.tickerService.getColumn());
        })
    }

    //获取BaseToken列表
    getBaseTokenList() {
        this.symbolService.fetchBaseTokenList().subscribe(res => {
            this.baseTokenListData = res.data.result;
            this.getExchangeRateByLegalCurrency(this.baseTokenListData.join(), this.assetService.getCurrency());
        })
    }

    //设置交易对收藏状态
    setSymbolFav(symbolObj: SymbolInterface) {
        if (this.metamaskService.isLogin()) {
            symbolObj.isFavorite = 1 - symbolObj.isFavorite;
            this.symbolService.setSymbolFav(this.metamaskService.getDefaultAccount(), symbolObj.symbol, symbolObj.isFavorite).subscribe(res => {

            })
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取并设置ETH与法币汇率
    getExchangeRateByLegalCurrency(currency: string, targetCurrency: string) {//cny&usd
        this.symbolService.fetchExchangeRateByLegalCurrency(currency).subscribe(res => {
            //待优化
            for(let i of this.baseTokenListData){
                this.exchangeRate[i] = new BigNumber(res.data[i].rates.filter(data => {
                    return data.code === targetCurrency
                })[0].rate || 0).toNumber();
            }
            // this.exchangeRate.ETH = new BigNumber(res.data.ETH.rates.filter(data => {
            //     return data.code === targetCurrency
            // })[0].rate || 0).toNumber();
            // this.exchangeRate.RNT = new BigNumber(res.data.RNT.rates.filter(data => {
            //     return data.code === targetCurrency
            // })[0].rate || 0).toNumber();
            if(this.intervalFlag){
                this.legalInterval = setTimeout(()=>{
                    this.getExchangeRateByLegalCurrency(this.baseTokenListData.join(), this.assetService.getCurrency());
                },5000)
            }
        })
    }

    //订阅currency变动
    subscribeCurrency() {
        this.currencySubscribe = this.assetService.getCurrencyObservable().subscribe(res => {
            this.getExchangeRateByLegalCurrency(this.baseTokenListData.join(), this.assetService.getCurrency());
        })
    }

    //取消订阅currency变动
    unsubscribeCurrency() {
        this.currencySubscribe && this.currencySubscribe.unsubscribe && this.currencySubscribe.unsubscribe();
    }

    //订阅language变动
    subscribeLanguage() {
        this.languageSubscribe = this.languageService.getObservable().subscribe(res => {
            this.getBannerList();
        })
    }

    //取消订阅language变动
    unsubscribeLanguage() {
        this.languageSubscribe && this.languageSubscribe.unsubscribe && this.languageSubscribe.unsubscribe();
    }

    //转换价格
    convertPriceToLegalCurrency(price: string, baseName: string) {
        return new BigNumber(price || 0).multipliedBy(this.exchangeRate[baseName] || 0);
    }

    //搜索关键字变化后
    onTokenNameChange() {
        this.symbolListShowData = this.symbolListData.filter(data => {
            return data.tokenName.toLocaleLowerCase().indexOf(this.tokenName.toLocaleLowerCase()) !== -1;
        }).filter(data => {
            return this.tickerService.getTab() === 'fav' ? true : data.baseName = this.tickerService.getTab();
        });

    }

    //排序
    sortBy(column: string) {
        this.tickerService.setMarketAsc((this.tickerService.getColumn() != column) ? false : !this.tickerService.getMarketAsc());
        this.tickerService.setColumn(column);
        this.sort(column);
    }

    private sort(column: string) {
        if (!this.symbolListShowData) return;
        this.symbolListShowData.sort((pre, next) => {
            let result: boolean;
            if (column == 'tokenName') {
                result = pre[column] > next[column];
            } else {
                result = new BigNumber(pre[column]).isGreaterThan(new BigNumber(next[column])) || (new BigNumber(pre[column]).isEqualTo(new BigNumber(next[column])) && pre['tokenName'] > next['tokenName']);
            }
            if (result) {
                return this.tickerService.getMarketAsc() ? -1 : 1;
            } else {
                return this.tickerService.getMarketAsc() ? 1 : -1;
            }
        })
    }

    //去交易
    goToTrade(symbol: string) {
        this.router.navigateByUrl('/trade/' + symbol);
    }

    //点击下载按钮时
    onDownloadClick() {
        this.router.navigateByUrl('help/download');
    }

    // 切换自选与BaseToken
    activated(active: string) {
        this.tickerService.setTab(active);
        this.getSymbolFavoriteList();
    }

    //关闭Socket
    closeSocket() {
        this.symbolService.closeSymbolSocket();
    }

    //清除interval
    closeInterval(){
        this.intervalFlag = false;
        clearInterval(this.legalInterval);
    }

}
