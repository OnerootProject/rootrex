import {Component, OnInit, Input, Renderer2, DoCheck} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

import BigNumber from "bignumber.js";

import {RootrexService} from "../../service/rootrex.service";
import {SymbolInterface} from "../../interface/symbol.interface";
import {SymbolService} from "../../service/symbol.service";
import {AssetService} from "../../service/asset.service";
import {TickerService} from "../../service/ticker.service";

import {MetamaskService} from "../../service/metamask.service";
import {TitleService} from "../../service/title.service";
import {ScrollService} from "../../service/scroll.service";
import {ThemeService} from "../../service/theme.service";

import {DialogController} from "../../controller/dialog.controller";
import {PopupController} from "../../controller/popup.controller";
import {DepositComponent} from "../../components/deposit/deposit.component";

import {Api} from "../../util/api.util";
import {
    FinishedOrderInterface,
    OrderInterface,
    PendingOrderInterface,
    PendingOrderResponseInterface, PendingOrderShowInterface
} from "../../interface/rootrex.interface";

import * as echarts from "echarts";
import {Subscription} from "rxjs/Subscription";
import {MetamaskAuthorizeComponent} from "../../components/metamask-authorize/metamask-authorize.component";
import {environment} from "../../../environments/environment";
import { AmountService } from '../../service/amount.service';
import {PercentPipe} from '../../pipes/percent.pipe';

declare var TradingView;
declare var Datafeeds;
declare var $;

@Component({
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {


    /*-----Data Part-----*/

    //loading
    symbolLoadingFlag: boolean = true;
    orderLoadingFlag: boolean = true;
    dealLoadingFlag: boolean = true;
    finishLoadingFlag: boolean = true;

    //节流开关
    throttleSwitch: boolean = true;
    //交易对收藏数组
    symbolFavorite: Array<string> = [];

    active: number = 1;

    //深度列表类型
    depthListType: string = "buysell";

    //url中传入的交易对信息
    symbol: string = this.activatedRouter.snapshot.params['symbol'];
    symbol_token: string = this.symbol.split('_')[0];
    symbol_base: string = this.symbol.split('_')[1];
    //fav:自选
    currentActive: string = this.symbol.split('_')[1];
    isFav: boolean;
    //当前交易对详情
    symbolDetail: SymbolInterface;
    //Metamask默认账户
    defaultAccount: string;
    //交易对列表
    symbolListData: Array<SymbolInterface> = [];
    symbolListShowData: Array<SymbolInterface> = [];
    //BaseToken列表
    baseTokenListData: Array<string>;
    //搜索
    tokenName: string = '';
    //ETH/RNT与当前选定法币汇率
    exchangeRate: any = {};
    //currency subscribe对象
    currencySubscribe: Subscription;
    //皮肤切换消息
    skinMsg: Subscription;
    //当前货币单位
    currency: string;

    //K线深度切换开关 默认K线图
    chartShow: string = 'k';
    isDepthChart: boolean = false;
    oldChartShow: string;
    //K线图对象
    kWidget: any;
    //获取K线图筛选的时间
    supported_resolutions = [];
    //深度图对象

    //metamask-auth dialog
    metamaskAuthorizeDialog: any;
    //当前交易所余额 ?
    balance: string = '0';
    //base交易所余额
    balance_base: string = '-1';
    //token交易所余额
    balance_token: string = '-1';
    //gas价格
    gasPrice: string = '-1';
    //最小交易价格
    minOrderLimit: string = '-1';
    //买入单价
    priceBuy: string;
    //买入数量
    volumeBuy: string;
    //卖出单价
    priceSell: string;
    //卖出数量
    volumeSell: string;
    //买单小数合并
    buyFixed: number = 0;
    buyTotalFixed: number = 0;
    //卖单小数合并
    saleFixed: number = 0;
    saleTotalFixed: number = 0;

    //买卖单高度
    sellListHeight: string = '155px';
    buyListHeight: string = '155px';
    sellListHidden: string = 'hidden';
    buyListHidden: string = 'hidden';
    sellButtom: string = '0';
    sellPadding: string = '20px';
    buyPadding: string = '20px';
    //深度合并位数
    mergeLevel: number = -8;
    //深度图控制是否显示无数据提示
    deepLineNodata: boolean;
    //深度图 loading
    deepLineLoading: boolean = true;
    //深度图数据更新
    reloadDepthMap: any;
    depthMapData;
    oldDepthMapData;
    //买卖单是否首次接收socket推送
    isFirst: boolean = true;
    //当前交易对原始挂单片量数据
    pendingOrderListOriginData: PendingOrderShowInterface<PendingOrderInterface> = {
        buy: [],
        sale: []
    };
    //当前交易对原始挂单增量数据
    pendingOrderListIncrementData: Array<PendingOrderShowInterface<PendingOrderInterface>> = [];
    lastDayPrice: string = '1';//24小时前成交价
    currentPrice: string = '0';//当前最新成交价
    currentRise: string = '0';//当前涨跌幅
    //当前交易对买单数据
    buyPendingOrderListData: Array<PendingOrderInterface>;
    //当前交易对卖单数据
    sellPendingOrderListData: Array<PendingOrderInterface>;
    //当前交易对成交数据
    finishedOrderListData: Array<FinishedOrderInterface> = [];
    //当前交易对我的委托中/历史挂单
    orderData: Array<OrderInterface>;
    //当前订单socket点开标记位
    orderSocket: boolean = false;
    //我的订单进行中/已完成切换
    orderStatus: number = 0;
    //翻页:当前页码
    currentPage: number = 1;
    //翻页:每页数量
    pageSize: number = 10;
    //翻页:总行数
    totalRow: number = 0;
    //k线图默认时间的显示
    kLineDefaultNum: string = '60';
    kLineDefaultVal: string = '';
    kLineHideTimeSelect: boolean = false;

    //皮肤切换
    chartBg: string = 'rgba(0,0,0,0)';
    //买卖对话框
    buySellDialog;

    //interval们
    socketFlag: boolean = true;
    intervalFlag: boolean = true;
    rootrexBalanceInterval: any;
    legalInterval: any;
    dealSocketFlag: boolean = false;

    //当前网络
    currentNetwork:string = environment.config.ethNetwork;
    //k线图暂无数据
    kLineNodata = window['kLineNodata'];
    //获取手续费
    appid: any = environment.config.appID;
    tradeGas;
    orderLimitCoefficient
    takerGasRate;

    /*-----Constructor Part-----*/

    constructor(private popupCtrl: PopupController,
                private rootrexService: RootrexService,
                private symbolService: SymbolService,
                public metamaskService: MetamaskService,
                public assetService: AssetService,
                public tickerService: TickerService,
                private titleService: TitleService,
                private ScrollService: ScrollService,
                private themeService: ThemeService,
                private activatedRouter: ActivatedRoute,
                private api: Api,
                private renderer: Renderer2,
                private dialogCtrl: DialogController,
                public translate: TranslateService,
                private router: Router,
                private amountService: AmountService,) {

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
        this.closeSocket();
        this.closeInterval();
        this.unsubscribeCurrency();
        this.unsubscribeTheme();

        // 销毁k线图与后端的数据通信interval
        this.kWidget.options.datafeed.disposeUpdateInterval();
    }

    ngDoCheck(): void {
        if (this.chartShow != this.oldChartShow) {
            this.oldChartShow = this.chartShow;
            this.isDepthChart = this.chartShow == 'd';//判断当前图表是不是深度图
            if (this.depthMapData && this.isDepthChart) {
                this.getDepthMap(this.depthMapData);
            }
        }

        //监听深度图数据变化
        if (this.depthMapData != this.oldDepthMapData) {
            this.oldDepthMapData = this.depthMapData;
            if (this.depthMapData && this.isDepthChart) {
                this.throttle(1000, () => {//节流
                    this.getDepthMap(this.depthMapData);
                });
            }
        }

    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getSymbolDetailBySymbol(this.symbol, this.metamaskService.getDefaultAccount());
        this.getBaseTokenList();
        this.getExchangeRateByLegalCurrency(this.symbol_base, this.assetService.getCurrency());
        this.getGasPriceUpdate();
        this.getSupportedResolutions();
        this.initKLine();
        this.getRootrexBalance(this.symbol_token, this.symbol_base);
        this.getMyOrderList();
        this.subscribeCurrency();
        this.setTimeoutLoading();
        this.showDepthMap();
        this.scrolly();
        this.getAmount(this.appid);
    }

    //监听皮肤变化
    subscribeTheme(depthChart) {
        let currTheme = this.themeService.get();
        this.changeChartTheme(currTheme, depthChart)
        this.unsubscribeTheme();
        this.skinMsg = this.themeService.getTheme().subscribe(res => {
            this.changeChartTheme(res, depthChart);
        })
    }

    //取消订阅皮肤变化
    unsubscribeTheme() {
        this.skinMsg && this.skinMsg.unsubscribe && this.skinMsg.unsubscribe();
    }

    //改变图表皮肤
    changeChartTheme(theme: string, depthChart) {
        let isDark = theme == 'dark';
        //K线图
        this.kWidget.onChartReady(() => {
            this.kWidget.applyOverrides({
                "mainSeriesProperties.areaStyle.color1": isDark ? '#141E46' : '#ccc',
                "mainSeriesProperties.areaStyle.color2": isDark ? '#36447B' : '#FCFCFC',
                "mainSeriesProperties.areaStyle.linecolor": isDark ? '#1D4179' : '#707070',
                "paneProperties.background": isDark ? '#141E46' : '#fff',
                "scalesProperties.lineColor": isDark ? '#141E46' : '#fff',//刻度线颜色
                "paneProperties.horzGridProperties.color": isDark ? '#002257' : '#E8E9EA',
            })
            if (isDark) {
                this.kWidget.addCustomCSSFile('./trade-trading.css');
            } else {
                this.kWidget.addCustomCSSFile('./trade-trading-light.css');
            }
        });

        //深度图
        if (depthChart && depthChart != '') {
            depthChart.setOption({
                textStyle: {
                    color: isDark ? '#fff' : '#002257'
                },
                series: [
                    {
                        name: 'buy',
                        label: {
                            color: isDark ? '#fff' : '#fff'
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#00fd9d'
                                }, {
                                    offset: 1,
                                    color: isDark ? this.chartBg : '#fff'
                                }])
                            }
                        }
                    },
                    {
                        name: 'sell',
                        label: {
                            color: isDark ? '#fff' : '#fff'
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#D8195A'
                                }, {
                                    offset: 1,
                                    color: isDark ? this.chartBg : '#fff'
                                }])
                            }
                        }
                    }
                ]
            });
        }
    }

    // 清除买卖单和成交历史loading
    setTimeoutLoading() {
        setTimeout(() => {
            this.dealLoadingFlag = false;
            this.finishLoadingFlag = false;
        }, 10000)
    }

    //获得当前交易对详情
    getSymbolDetailBySymbol(symbol: string, account: string) {
        this.symbolService.fetchSymbolDetailBySymbol(account, symbol).subscribe(res => {
            if (!res.code) {
                this.symbolDetail = res.data;
                this.currentPrice = res.data.price;
                this.currentRise = res.data.rise;
                this.isFav = false;
                this.lastDayPrice = this.symbolDetail.lastDayPrice;
                this.mergeLevel = parseInt(res.data.depthRule.split(',')[0] || '-8');
                this.titleService.setTitle(parseFloat(this.symbolDetail.price).toFixed(parseInt(this.symbolDetail.priceScale)) + ' ' + this.symbol_token + '/' + this.symbol_base + ' ' + this.translate.instant('Common.Title'));
                this.getSymbolFavoriteList();
                this.getIncrementPendingOrderBySymbol();
                this.getFinishedOrderBySymbol();
            } else {
                //error 跳去首页
                this.router.navigateByUrl('');
            }
        }, error => {
            this.deepLineNodata = true;
            this.deepLineLoading = false;
        })
    }

    //设置交易对收藏状态
    setSymbolFav(symbol: string, isFav: boolean) {
        if (this.metamaskService.isLogin()) {
            this.symbolService.setSymbolFav(this.metamaskService.getDefaultAccount(), symbol, isFav ? 1 : 0).subscribe(res => {
                this.getSymbolFavoriteList(false);
                if (symbol === this.symbol) {
                    this.symbolDetail.isFavorite = (isFav ? 1 : 0);
                    // this.getSymbolDetailBySymbol(this.symbol, this.metamaskService.getDefaultAccount());
                }
            })
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取交易对收藏列表
    getSymbolFavoriteList(loadingFlag: boolean = true) {
        this.symbolFavorite = [];
        if(loadingFlag){
            this.symbolListShowData = [];
            this.symbolLoadingFlag = true;
        }
        if (this.metamaskService.isLogin()) {
            this.symbolService.fetchSymbolFavorite(this.metamaskService.getDefaultAccount()).subscribe(res => {
                this.isFav = false;
                //将用户收藏交易对写入this.symbolFavorite
                for (let i of res.data.result) {
                    //如果收藏列表中有本交易对,则设为已收藏
                    if (i.symbol === this.symbol) {
                        this.isFav = true;
                    }
                    this.symbolFavorite.push(i.symbol);
                }
                //将favorite数据存入this.symbolFavorite
                if (this.currentActive === 'fav') {
                    this.symbolLoadingFlag = false;
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
        let baseToken = this.currentActive;
        this.symbolService.fetchSymbolList(baseToken).subscribe(res => {
            if(this.currentActive === baseToken){
                this.symbolLoadingFlag = false;
                this.symbolListData = res.data.result;
                this.symbolListShowData = res.data.result;
                this.setSymbolData();
            }
        });
    }

    //交易对数据获取后续处理
    setSymbolData() {
        //将交易对标上星级
        for (let i of this.symbolListData) {
            i.isFavorite = this.symbolFavorite.indexOf(i.symbol) !== -1 ? 1 : 0;
        }
        this.onTokenNameChange();
        this.getSymbolUpdate();
        this.sort(this.tickerService.getTradeColumn());
    }

    //获取交易对更新信息
    getSymbolUpdate() {
        this.symbolService.closeSymbolSocket();
        this.symbolService.fetchSymbolListUpdate(res => {
            for (let i of this.symbolListData) {
                if (i.tokenName === res.tokenName && i.baseName === res.baseName) {
                    i.price = res.price;
                    i.lastPrice = res.lastPrice;
                    i.lastDayPrice = res.lastDayPrice;
                    i.highPrice24h = res.highPrice24h;
                    i.lowPrice24h = res.lowPrice24h;
                    i.rise = res.rise;
                    i.tradeBaseAmount = res.tradeBaseAmount;
                }
                if (this.symbolDetail.tokenName === res.tokenName && this.symbolDetail.baseName === res.baseName) {
                    this.currentPrice = res.price;
                    this.currentRise = res.rise;
                    //Detail Part
                    this.symbolDetail.price = res.price;
                    this.symbolDetail.lastPrice = res.lastPrice;
                    this.symbolDetail.lastDayPrice = res.lastDayPrice;
                    this.symbolDetail.highPrice24h = res.highPrice24h;
                    this.symbolDetail.lowPrice24h = res.lowPrice24h;
                    // this.symbolDetail.rise = res.rise;
                    this.symbolDetail.rise = res.rise;
                    this.symbolDetail.tradeBaseAmount = res.tradeBaseAmount;
                    this.titleService.setTitle(parseFloat(this.symbolDetail.price).toFixed(parseInt(this.symbolDetail.priceScale)) + ' ' + this.symbol_token + '/' + this.symbol_base + ' ' + this.translate.instant('Common.Title'));
                }
            }
            this.sort(this.tickerService.getTradeColumn());
        })
    }

    //获取BaseToken列表
    getBaseTokenList() {
        this.symbolService.fetchBaseTokenList().subscribe(res => {
            this.baseTokenListData = res.data.result;
        })
    }

    //初始化K线图
    initKLine() {
        let widgetAguments = {
            'dark_studies_overrides': {
                "volume.volume.color.0": "rgba(216,25,90,.5)",
                "volume.volume.color.1": "rgba(1,197,123,.5)",
                "volume.volume.transparency": 12,
                //"volume.volume ma.color": "#95ceff",
                //"volume.volume ma.transparency": 30,
                //"volume.volume ma.linewidth": 1,
                //"volume.show ma": true
            },
            'dark_overrides': {
                "volumePaneSize": "medium",
                "scalesProperties.lineColor": this.chartBg,//刻度线颜色
                "scalesProperties.textColor": "#60698D", //标注的字体色
                "paneProperties.background": this.chartBg,
                "paneProperties.vertGridProperties.color": "rgba(0, 0, 0, 0)",
                "paneProperties.horzGridProperties.color": "#002257",
                "paneProperties.crossHairProperties.color": "#60698D",//十字线颜色
                "paneProperties.legendProperties.showLegend": false,
                "paneProperties.legendProperties.showStudyArguments": true,
                "paneProperties.legendProperties.showStudyTitles": true,
                "paneProperties.legendProperties.showStudyValues": true,
                "paneProperties.legendProperties.showSeriesTitle": true,
                "paneProperties.legendProperties.showSeriesOHLC": true,
                "mainSeriesProperties.candleStyle.upColor": "#01C57B",
                "mainSeriesProperties.candleStyle.downColor": "#D8195A",
                "mainSeriesProperties.candleStyle.drawWick": true,
                "mainSeriesProperties.candleStyle.drawBorder": true,
                "mainSeriesProperties.candleStyle.borderColor": "#4e5b85",
                "mainSeriesProperties.candleStyle.borderUpColor": "#01C57B",
                "mainSeriesProperties.candleStyle.borderDownColor": "#D8195A",
                "mainSeriesProperties.candleStyle.wickUpColor": "#01C57B",
                "mainSeriesProperties.candleStyle.wickDownColor": "#D8195A",
                "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false, //
                "mainSeriesProperties.hollowCandleStyle.upColor": "#589065",
                "mainSeriesProperties.hollowCandleStyle.downColor": "#ae4e54",
                "mainSeriesProperties.hollowCandleStyle.drawWick": true,
                "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
                "mainSeriesProperties.hollowCandleStyle.borderColor": "#4e5b85",
                "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#589065",
                "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#ae4e54",
                "mainSeriesProperties.haStyle.upColor": "#589065",
                "mainSeriesProperties.haStyle.downColor": "#ae4e54",
                "mainSeriesProperties.haStyle.drawWick": true,
                "mainSeriesProperties.haStyle.drawBorder": true,
                "mainSeriesProperties.haStyle.borderColor": "#4e5b85",
                "mainSeriesProperties.haStyle.borderUpColor": "#589065",
                "mainSeriesProperties.haStyle.borderDownColor": "#ae4e54",
                "mainSeriesProperties.haStyle.wickColor": "#4e5b85",
                "mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
                "mainSeriesProperties.barStyle.upColor": "#589065",
                "mainSeriesProperties.barStyle.downColor": "#ae4e54",
                "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
                "mainSeriesProperties.barStyle.dontDrawOpen": false,
                "mainSeriesProperties.lineStyle.color": "#4e5b85",
                "mainSeriesProperties.lineStyle.linewidth": 1,
                "mainSeriesProperties.lineStyle.priceSource": "close",
                "mainSeriesProperties.areaStyle.color1": '#141E46',
                "mainSeriesProperties.areaStyle.color2": '#36447B',
                "mainSeriesProperties.areaStyle.linecolor": "#1D4179",
                "mainSeriesProperties.areaStyle.linewidth": 1,
                "mainSeriesProperties.areaStyle.priceSource": "close",
                "mainSeriesProperties.style": 1,
                "mainSeriesProperties.showPriceLine": true,
                "symbolWatermarkProperties.transparency": 100,
                "TradingView.PaneRendererColumns": 1,
                "scalesProperties.showSeriesLastValue": true,//当前价
                "scalesProperties.showRightScale": true,
            }
        };

        this.kWidget = new TradingView.widget({
            fullscreen: false,
            //border: '#000',
            theme: 'Dark',
            style: 3,
            symbol: this.symbol,
            custom_css_url: './trade-trading.css',
            interval: this.kLineDefaultNum,
            timezone: "Asia/Shanghai",
            withdateranges: true,
            timeframe: this.kLineDefaultNum,
            container_id: "k-line",
            datafeed: new Datafeeds.UDFCompatibleDatafeed(this.api.rootrex.getKLineDataBySymbol.replace("{symbol}", this.symbol)),
            library_path: "assets/trading/",
            locale: "en",
            drawings_access: {type: 'black', tools: [{name: "Regression Trend"}]},
            disabled_features: ["volume_force_overlay"],
            enabled_features: ["dont_show_boolean_study_arguments", "hide_last_na_study_output", "same_data_requery", "side_toolbar_in_fullscreen_mode", "disable_resolution_rebuild"],
            preset: "mobile",
            autosize: true,//自适应
            time_frames: [],//左侧底部时间格式化
            overrides: widgetAguments.dark_overrides,
            studies_overrides: widgetAguments.dark_studies_overrides,
        });

        this.klineCreateStudy();
        this.subscribeTheme('');
        this.kWidget.onChartReady(function () {
            document.getElementsByTagName("iframe")[0].setAttribute("style", "display:block;width:100%;height:100%;");
        });
    }

    //分时
    toBeArea() {
        this.kWidget.chart().removeAllStudies()//删除所有指标
        this.kWidget.chart().createStudy("Volume", false, false);//插入指标
    }

    //K线图指标
    klineCreateStudy() {
        this.kLineNodata = false;
        window['kLineNodata'] = false;
        this.kWidget.onChartReady(() => {
            this.toBeArea();
            this.kLineNodata = window['kLineNodata'];
            this.kWidget.chart().createStudy('Moving Average', false, false, [5], null, {
                'Plot.linewidth': 1,
                'Plot.plottype': 'line',
                'plot.color.0': '#00CEFF'
            });
            this.kWidget.chart().createStudy('Moving Average', false, false, [10], null, {
                'Plot.linewidth': 1,
                'Plot.color.0': '#0058FF'
            });
            this.kWidget.chart().createStudy('Moving Average', false, false, [30], null, {
                'Plot.linewidth': 1,
                'Plot.color.0': '#BDF014'
            });
            this.kWidget.chart().createStudy('Moving Average', false, false, [60], null, {
                'Plot.linewidth': 1,
                'Plot.color.0': '#FF00D3'
            });
            //this.kWidget.setLanguage("zh")
            //this.kWidget.selectLineTool('dot')//改变鼠标样式
        });
    }

    //获取到pending订单增量数据
    getIncrementPendingOrderBySymbol() {
        this.rootrexService.fetchIncrementPendingOrderBySymbol(this.symbol, openRes => {
            if (openRes) {
                this.dealSocketFlag = false;
                this.getPendingOrderBySymbol();
            }
        }, res => {
            // console.log(res.version, '开始', new Date().getTime());
            this.pendingOrderListIncrementData.push(res);
            if (!this.dealLoadingFlag) {//片量数据载入完毕后
                this.processPendingOrderData();
            }
        }, closeRes => {
            if (this.socketFlag && closeRes) {
                this.dealSocketFlag = true;
                this.getIncrementPendingOrderBySymbol();
            }
        });
    }

    //获取pending订单片量数据
    getPendingOrderBySymbol() {
        this.rootrexService.fetchPendingOrderBySymbol(this.symbol).subscribe(res => {
            let data: PendingOrderResponseInterface<any> = res.data;
            //开始整理socket数据
            let depthFormatData: PendingOrderShowInterface<PendingOrderInterface> = {
                buy: [],
                sale: [],
                version: data.v
            };
            //处理pending买卖单数据
            depthFormatData.buy = data.b.map(data => {
                return {price: parseFloat(data.p), volume: parseFloat(data.ta), amount: 0, percent: 0}
            });
            depthFormatData.sale = data.s.map(data => {
                return {price: parseFloat(data.p), volume: parseFloat(data.ta), amount: 0, percent: 0}
            });
            this.pendingOrderListOriginData = depthFormatData;
            this.processPendingOrderData();
            // this.dealLoadingFlag = false; 移动至this.processPendingOrderData()后
        })
    }

    //处理pending订单数据
    processPendingOrderData() {
        //丢弃过期数据
        this.pendingOrderListIncrementData = this.pendingOrderListIncrementData.filter(data => {
            return parseInt(data.version) > parseInt(this.pendingOrderListOriginData.version)
        });
        //正式数据处理
        for (let res of this.pendingOrderListIncrementData) {
            if (parseInt(this.pendingOrderListOriginData.version) < parseInt(res.version)) {
                for (let i of res.buy) {
                    let matchFlag: boolean = false;
                    for (let j of this.pendingOrderListOriginData.buy) {
                        if (i.price === j.price) {
                            matchFlag = true;
                            if (i.volume !== 0) {
                                //替换
                                j.volume = i.volume;
                            } else {
                                //删除
                                this.pendingOrderListOriginData.buy = this.pendingOrderListOriginData.buy.filter(data => {
                                    return !new BigNumber(data.price).isEqualTo(new BigNumber(i.price));
                                });
                            }
                        }
                    }
                    if (!matchFlag && i.volume !== 0) {
                        this.pendingOrderListOriginData.buy.push(i);
                    }
                }
                for (let i of res.sale) {
                    let matchFlag: boolean = false;
                    for (let j of this.pendingOrderListOriginData.sale) {
                        if (i.price === j.price) {
                            matchFlag = true;
                            if (i.volume !== 0) {
                                //替换
                                j.volume = i.volume;
                            } else {
                                //删除
                                this.pendingOrderListOriginData.sale = this.pendingOrderListOriginData.sale.filter(data => {
                                    return !new BigNumber(data.price).isEqualTo(new BigNumber(i.price));
                                });
                            }
                        }
                    }
                    if (!matchFlag && i.volume !== 0) {
                        this.pendingOrderListOriginData.sale.push(i);
                    }
                }
                this.pendingOrderListOriginData.version = res.version;//版本赋值放在最后
            }
        }
        this.dealLoadingFlag = false;
        this.pendingOrderListOriginData.buy.sort((pre, next) => {
            return next.price - pre.price;
        });
        this.pendingOrderListOriginData.sale.sort((pre, next) => {
            return next.price - pre.price;
        });
        //先预留
        // if (this.pendingOrderListOriginData.buy.length > 250) {
        //     this.pendingOrderListOriginData.buy = this.pendingOrderListOriginData.buy.slice(0, 250);
        // }
        // if (this.pendingOrderListOriginData.sale.length > 250) {
        //     this.pendingOrderListOriginData.sale = this.pendingOrderListOriginData.sale.slice(this.pendingOrderListOriginData.sale.length - 250);
        // }
        if (this.pendingOrderListOriginData.buy.length > 250 || this.pendingOrderListOriginData.sale.length > 250) {
            this.getPendingOrderBySymbol()
        }//不能用else
        //console.log(this.pendingOrderListOriginData.version, '步骤1', new Date().getTime());
        this.setDeepMerge(this.mergeLevel);
    }

    //获取当前交易对历史/实时成交数据和昨日成交价
    getFinishedOrderBySymbol() {
        this.rootrexService.fetchFinishedOrderBySymbol(this.symbol, res => {
            this.finishLoadingFlag = false;
            this.finishedOrderListData = res.map(data => {
                return {
                    datetime: data.ts,
                    type: parseInt(data.type),
                    price_finished: new BigNumber(data.p).toFixed(parseInt(this.symbolDetail.priceScale), 1).toString(),
                    volume_finished: new BigNumber(data.ta).toNumber(),
                    tx: data.tx
                }
            });
        })
    }

    //获取交易所余额
    getRootrexBalance(tokenName: string, baseName: string) {
        if (this.intervalFlag) {
            if (this.metamaskService.isLogin()) {
                this.assetService.fetchMyAssetList(this.metamaskService.getDefaultAccount()).subscribe(res => {
                    if (res.data && res.data.result) {
                        let objToken = res.data.result.filter(data => {
                            return data.tokenName === tokenName;
                        })[0];
                        this.balance_token = (objToken && objToken.tokenAmount ? objToken.tokenAmount : '0');
                        let objBase = res.data.result.filter(data => {
                            return data.tokenName === baseName;
                        })[0];
                        this.balance_base = (objBase && objBase.tokenAmount ? objBase.tokenAmount : '0');
                    }
                    this.rootrexBalanceInterval = setTimeout(() => {
                        this.getRootrexBalance(this.symbol_token, this.symbol_base);
                    }, 30000);//每5秒查询一次base和token余额
                })
            } else {

            }
        }
    }

    // 切换自选与BaseToken
    activated(active: string) {
        this.currentActive = active;
        this.getSymbolFavoriteList();
    }

    //搜索关键字变化后
    onTokenNameChange() {
        this.symbolListShowData = this.symbolListData.filter(data => {
            return data.tokenName.toLocaleLowerCase().indexOf(this.tokenName.toLocaleLowerCase()) !== -1;
        }).filter(data => {
            return this.currentActive === 'fav' ? true : data.baseName = this.currentActive;
        });
    }

    //排序
    sortBy(column: string) {
        this.tickerService.setTradeAsc((this.tickerService.getTradeColumn() != column) ? false : !this.tickerService.getTradeAsc());
        this.tickerService.setTradeColumn(column);
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
                return this.tickerService.getTradeAsc() ? 1 : -1;
            } else {
                return this.tickerService.getTradeAsc() ? -1 : 1;
            }
        })
    }

    //点击交易对时
    onSymbolClick(symbol: string) {
        this.router.navigateByUrl('order', {skipLocationChange: true}).then(() => {
            this.router.navigateByUrl('trade/' + symbol);
        })
    }

    //点击充值按钮
    onDepositClick(type: string) {
        if (this.metamaskService.isLogin()) {
            this.dialogCtrl.createFromComponent(DepositComponent, {
                tokenName: type === 'base' ? this.symbolDetail.base_info.tokenName : this.symbolDetail.token_info.tokenName,
                tokenWei: type === 'base' ? this.symbolDetail.base_info.decimal : this.symbolDetail.token_info.decimal,
                tokenContract: type === 'base' ? this.symbolDetail.base_info.address : this.symbolDetail.token_info.address,
                limitApprove: type === 'base' ? this.symbolDetail.base_info.limitApprove : this.symbolDetail.token_info.limitApprove,
                callback: () => {

                }
            });
        } else {
            this.metamaskService.unlogin();
        }
    }

    //获取Gas价格更新
    getGasPriceUpdate() {
        this.rootrexService.fetchGasPriceAndMinOrderLimit(res => {
            this.gasPrice = new BigNumber(res.gasPrice || 0).shiftedBy(-9).toFixed(0, 2);
            this.minOrderLimit = res['minOrderAmount_' + this.symbol_base];
        })
    }

    //获取并设置ETH与法币汇率
    getExchangeRateByLegalCurrency(currency: string, targetCurrency: string) {//cny&usd
        this.symbolService.fetchExchangeRateByLegalCurrency(currency).subscribe(res => {
            //待优化
            this.exchangeRate[this.symbol_base] = new BigNumber(res.data[this.symbol_base].rates.filter(data => {
                return data.code === targetCurrency
            })[0].rate || 0).toNumber();
            if (this.intervalFlag) {
                this.legalInterval = setTimeout(() => {
                    this.getExchangeRateByLegalCurrency(this.symbol_base, this.assetService.getCurrency());
                }, 5000)
            }
        })
    }

    //订阅currency变动
    subscribeCurrency() {
        this.currency = this.assetService.getCurrency();
        this.currencySubscribe = this.assetService.getCurrencyObservable().subscribe(res => {
            this.currency = res.currency;
            this.getExchangeRateByLegalCurrency(this.symbol_base, this.currency);
        })
    }

    //取消订阅currency变动
    unsubscribeCurrency() {
        this.currencySubscribe && this.currencySubscribe.unsubscribe && this.currencySubscribe.unsubscribe();
    }

    //转换涨跌幅价格
    getRisePriceToLegalCurrency() {
        let flag = '';
        let risePrice = new BigNumber(
            this.convertPriceToLegalCurrency(
                new BigNumber(this.currentPrice).minus(new BigNumber(this.lastDayPrice || 0)).toFixed(),
                this.symbol_base
            )
        );
        if (new BigNumber(this.currentPrice).isGreaterThan(new BigNumber(this.lastDayPrice))) {
            flag = '+';
        }
        return flag + risePrice.toFixed(4,1);
    }

    //转换价格
    convertPriceToLegalCurrency(price: string, baseName: string) {
        return new BigNumber(price || 0).multipliedBy(this.exchangeRate[baseName] || 0);
    }

    //计算总量
    calculatorVolume(type: string, percent: number) {
        if (type === 'buy') {
            if (this.priceBuy) {
                this.volumeBuy = this.priceBuy == '0' ? '0' : new BigNumber(this.balance_base).multipliedBy(percent).dividedBy(new BigNumber(this.priceBuy)).toFixed(parseInt(this.symbolDetail.amountScale), 1);
            }
        } else {
            this.volumeSell = new BigNumber(this.balance_token).multipliedBy(percent).toFixed(parseInt(this.symbolDetail.amountScale), 1);
        }
    }

    //计算总价
    calculatorTotalPrice(price: any, volume: any) {
        try {
            return new BigNumber(new BigNumber(price || 0).multipliedBy(new BigNumber(volume || 0))).toFixed();
        } catch {
            return 0;
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
    onModelChange(params, event, decimalPointNumber: number = 8) {
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
            event = _float[0] + "." + _float[1].slice(0, decimalPointNumber)
        }
        setTimeout(() => {
            this[params] = event;
        }, 0)
    }

    //调整数量 params:price_buy action:plus/minus value:value
    onNumberChange(params: string, action: string, value: string) {
        if (value) {
            let len: number = 0;
            let v: number = 0;
            if (value.split('.').length > 1) {
                len = value.split('.')[1].length;
                v = new BigNumber(value).shiftedBy(len).toNumber();
            } else {
                v = new BigNumber(value).toNumber();
            }
            action === 'plus' ? v++ : v > 0 ? v-- : '';
            this[params] = new BigNumber(v).shiftedBy(-len).toFixed(len, 1);
        }
    }

    //购买
    onBuyClick() {
        if (this.metamaskService.isLogin()) {
            if (this.priceBuy && this.volumeBuy) {
                if (new BigNumber(this.balance_base).isLessThan(new BigNumber(this.calculatorTotalPrice(this.priceBuy, this.volumeBuy)))) {
                    this.popupCtrl.create({
                        message: this.translate.instant('Rootrex.OutOfBalance').replace('{token}', this.symbol_base),
                        during: 3000
                    })
                } else {
                    if (new BigNumber(this.calculatorTotalPrice(this.priceBuy, this.volumeBuy)).isLessThan(new BigNumber(this.minOrderLimit))) {
                        this.popupCtrl.create({
                            message: this.translate.instant('Rootrex.AmountTooSmall').replace('{amount}', new BigNumber(this.minOrderLimit).toFixed(8, 2)).replace('{token}', this.symbol_base),
                            during: 3000
                        })
                    } else {
                        if (new BigNumber(this.priceBuy).isGreaterThan(new BigNumber(this.currentPrice).multipliedBy(1.5)) && parseFloat(this.currentPrice) !== 0) {
                            this.buySellDialog = this.dialogCtrl.create({
                                title: this.translate.instant('Rootrex.OrderAlarm'),
                                content: this.translate.instant('Rootrex.OrderAlarmBuy').replace('{price}', this.priceBuy).replace('{currentPrice}', new BigNumber(this.currentPrice).toFixed(parseInt(this.symbolDetail.priceScale), 1)),
                                buttons: [{
                                    text: this.translate.instant('Rootrex.OrderAlarmDeny'),
                                    color: 'red',
                                    handle: () => {
                                        this.dialogCtrl.destroy(this.buySellDialog);
                                    }
                                },
                                    {
                                        text: this.translate.instant('Rootrex.OrderAlarmConfirm'),
                                        color: 'normal',
                                        handle: () => {
                                            this.dialogCtrl.destroy(this.buySellDialog);
                                            this.buy();
                                        }
                                    }]
                            });
                        } else {
                            this.buy();
                        }
                    }
                }
            }
        } else {
            this.metamaskService.unlogin();
        }
    }

    private buy() {
        let tokenInfo = {
            address: this.symbolDetail.token_info.address,
            wei: this.symbolDetail.token_info.decimal
        };
        let baseInfo = {
            address: this.symbolDetail.base_info.address,
            wei: this.symbolDetail.base_info.decimal
        };
        let price = new BigNumber(this.priceBuy).toNumber();
        let volume = new BigNumber(this.volumeBuy).toNumber();
        // let baseVolume = this.calculatorTotalPrice(price, volume);
        this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
            message: this.translate.instant('Rootrex.BuyMessage').replace('{price}', this.priceBuy).replace('{volume}', this.volumeBuy).replace('{token}', this.symbol_token).replace('{base}', this.symbol_base),
            action: this.translate.instant('Rootrex.OrderTransaction')
        });
        this.rootrexService.order(this.metamaskService.getDefaultAccount(), tokenInfo, baseInfo, this.symbol, price, volume, 0, (res, message = '') => {
                //关闭MetaMask授权弹窗
                this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
                this.popupCtrl.create({
                    message: res ? this.translate.instant('Rootrex.TransactionSuccessful') : message !== '' ? message : this.translate.instant('Rootrex.TransactionFailed'),
                    during: 3000
                });
                this.setBuyAndSellPrice('');
                this.setBuyAndSellVolume('');
                this.getRootrexBalance(this.symbol_token, this.symbol_base);
                this.getMyOrderList();
            }
        );
    }

    //卖出
    onSellClick() {
        if (this.metamaskService.isLogin()) {
            if (this.priceSell && this.volumeSell) {
                if (new BigNumber(this.balance_token).isLessThan(new BigNumber(this.volumeSell))) {
                    this.popupCtrl.create({
                        message: this.translate.instant('Rootrex.OutOfBalance').replace('{token}', this.symbol_token),
                        during: 3000
                    })
                } else {
                    if (new BigNumber(this.calculatorTotalPrice(this.priceSell, this.volumeSell)).isLessThan(new BigNumber(this.minOrderLimit))) {
                        this.popupCtrl.create({
                            message: this.translate.instant('Rootrex.AmountTooSmall').replace('{amount}', new BigNumber(this.minOrderLimit).toFixed(8, 2)).replace('{token}', this.symbol_base),
                            during: 3000
                        })
                    } else {
                        if (new BigNumber(this.priceSell).isLessThan(new BigNumber(this.currentPrice).dividedBy(2)) && parseFloat(this.currentPrice) !== 0) {
                            this.buySellDialog = this.dialogCtrl.create({
                                title: this.translate.instant('Rootrex.OrderAlarm'),
                                content: this.translate.instant('Rootrex.OrderAlarmSell').replace('{price}', this.priceSell).replace('{currentPrice}', new BigNumber(this.currentPrice).toFixed(parseInt(this.symbolDetail.priceScale), 1)),
                                buttons: [{
                                    text: this.translate.instant('Rootrex.OrderAlarmDeny'),
                                    color: 'red',
                                    handle: () => {
                                        this.dialogCtrl.destroy(this.buySellDialog);
                                    }
                                },
                                    {
                                        text: this.translate.instant('Rootrex.OrderAlarmConfirm'),
                                        color: 'normal',
                                        handle: () => {
                                            this.dialogCtrl.destroy(this.buySellDialog);
                                            this.sell();
                                        }
                                    }]
                            });
                        } else {
                            this.sell();
                        }
                    }
                }
            }
        } else {
            this.metamaskService.unlogin();
        }
    }

    private sell() {
        let tokenInfo = {
            address: this.symbolDetail.token_info.address,
            wei: this.symbolDetail.token_info.decimal
        };
        let baseInfo = {
            address: this.symbolDetail.base_info.address,
            wei: this.symbolDetail.base_info.decimal
        };
        let price = new BigNumber(this.priceSell).toNumber();
        let volume = new BigNumber(this.volumeSell).toNumber();
        this.metamaskAuthorizeDialog = this.dialogCtrl.createFromComponent(MetamaskAuthorizeComponent, {
            message: this.translate.instant('Rootrex.SellMessage').replace('{price}', this.priceSell).replace('{volume}', this.volumeSell).replace('{token}', this.symbol_token).replace('{base}', this.symbol_base),
            action: this.translate.instant('Rootrex.OrderTransaction')
        });
        this.rootrexService.order(this.metamaskService.getDefaultAccount(), tokenInfo, baseInfo, this.symbol, price, volume, 1, (res, message = '') => {
                //关闭metamask授权弹窗
                this.dialogCtrl.destoryFromComponent(this.metamaskAuthorizeDialog);
                this.popupCtrl.create({
                    message: res ? this.translate.instant('Rootrex.TransactionSuccessful') : message !== '' ? message : this.translate.instant('Rootrex.TransactionFailed'),
                    during: 3000
                });
                this.setBuyAndSellPrice('');
                this.setBuyAndSellVolume('');
                this.getRootrexBalance(this.symbol_token, this.symbol_base);
                this.getMyOrderList();
            }
        );

    }

    //设置买卖单价
    setBuyAndSellPrice(price: any) {
        this.priceBuy = price === '' || price === -1 ? '' : new BigNumber(price).toFixed(parseInt(this.symbolDetail.priceScale), 1);
        this.priceSell = price === '' || price === -1 ? '' : new BigNumber(price).toFixed(parseInt(this.symbolDetail.priceScale), 1);
    }

    //设置买卖数量
    setBuyAndSellVolume(volume: any) {
        this.volumeBuy = volume === '' || volume === -1 ? '' : new BigNumber(volume).toFixed(parseInt(this.symbolDetail.amountScale), 1);
        this.volumeSell = volume === '' || volume === -1 ? '' : new BigNumber(volume).toFixed(parseInt(this.symbolDetail.amountScale), 1);
    }

    //深度合并
    setDeepMerge(level: any) {
        level = parseInt(level || '0');
        this.mergeLevel = level;
        let pendingOrderListMergeData: PendingOrderShowInterface<PendingOrderInterface> = {
            buy: [],
            sale: [],
            version: this.pendingOrderListOriginData.version
        };
        for (let i of this.pendingOrderListOriginData.buy) {
            let _buy = JSON.parse(JSON.stringify(i));
            _buy.price = new BigNumber(Math.floor(new BigNumber(_buy.price).shiftedBy(-level).toNumber())).shiftedBy(level).toNumber();
            let obj = pendingOrderListMergeData.buy.filter(d => {
                return new BigNumber(Math.floor(new BigNumber(d.price).shiftedBy(-level).toNumber())).shiftedBy(level).toNumber() === _buy.price;
            })[0];
            obj ? obj.volume += _buy.volume : pendingOrderListMergeData.buy.push(_buy);
        }
        for (let i of this.pendingOrderListOriginData.sale) {
            let _sell = JSON.parse(JSON.stringify(i));
            _sell.price = new BigNumber(Math.ceil(new BigNumber(_sell.price).shiftedBy(-level).toNumber())).shiftedBy(level).toNumber();
            let obj = pendingOrderListMergeData.sale.filter(d => {
                return new BigNumber(Math.ceil(new BigNumber(d.price).shiftedBy(-level).toNumber())).shiftedBy(level).toNumber() === _sell.price;
            })[0];
            obj ? obj.volume += _sell.volume : pendingOrderListMergeData.sale.push(_sell);
        }
        //console.log(this.pendingOrderListOriginData.version, '步骤2', new Date().getTime());
        this.calculatorTotalAmount(pendingOrderListMergeData);
    }

    //计算总量
    calculatorTotalAmount(data: PendingOrderShowInterface<PendingOrderInterface>) {
        for (let i = 0; i < data.buy.length; i++) {
            data.buy[i].amount = data.buy[i].volume;
            for (let j = i - 1; j >= 0; j--) {
                data.buy[i].amount = new BigNumber(data.buy[i].amount).plus(new BigNumber(data.buy[j].volume)).toNumber();
            }
        }
        for (let i = 0; i < data.sale.length; i++) {
            data.sale[i].amount = data.sale[i].volume;
            for (let j = i + 1; j < data.sale.length; j++) {
                data.sale[i].amount = new BigNumber(data.sale[i].amount).plus(new BigNumber(data.sale[j].volume)).toNumber();
            }
        }

        this.throttle(1000, () => {//数据节流
            this.depthMapData = data;
        });

        // console.log(this.pendingOrderListOriginData.version, '步骤3', new Date().getTime());
        this.calculatorDeepPercent(data);
    }

    //小数位数判断
    compareNum(res: number) {
        let num = Number(res);
        return num >= 10000 ? 0 : num >= 1000 ? 1 : num >= 100 ? 2 : num >= 10 ? 3 : 4;
    }

    //深度图数据
    getDepthMap(data) {
        let maxTotalBuy: number = 0;
        let maxTotalSale: number = 0;
        let depthMapDatas = [[], []];
        let priceScale = parseInt(this.symbolDetail.priceScale) || 8;

        //小数位数
        for (let i of data.buy) {
            if (i.amount >= maxTotalBuy) {
                maxTotalBuy = i.amount;
            }
        }
        for (let i of data.sale) {
            if (i.amount >= maxTotalSale) {
                maxTotalSale = i.amount;
            }
        }
        //深度图数据拼接
        let buyTotalFixed = this.compareNum(maxTotalBuy);
        let saleTotalFixed = this.compareNum(maxTotalSale);
        for (let i of data.buy) {
            //深度图-buy-数据拼接
            if (i.price >= 0 && i.amount >= 0) {
                depthMapDatas[0].unshift([this.toFixedFun(i.price, priceScale) + '', this.toFixedFun(i.amount, buyTotalFixed) + '']);
            }
        }
        for (let i of data.sale) {
            //深度图-sale-数据拼接
            if (i.price >= 0 && i.amount >= 0) {
                depthMapDatas[1].unshift([this.toFixedFun(i.price, priceScale) + '', this.toFixedFun(i.amount, saleTotalFixed) + '']);
            }
        }
        this.reloadDepthMap(depthMapDatas);
    }

    //小数位处理，不四舍五入
    toFixedFun(price: any, level: number) {
        let target;
        if (isNaN(parseFloat(price))) {
            target = 0;
        } else {
            target = parseFloat(price).toFixed(level + 1);
        }
        return new BigNumber(target).toFixed(level, 1).toString();
    }

    //函数节流
    throttle(delay: number, action: Function) {
        if (!this.throttleSwitch) {
            return;
        }
        this.throttleSwitch = false;
        setTimeout(() => {
            action();
            this.throttleSwitch = true;
        }, delay);
    }

    //计算深度百分比
    calculatorDeepPercent(data: PendingOrderShowInterface<PendingOrderInterface>) {
        let maxAmountBuy: number = 0;
        let maxAmountSale: number = 0;
        //计算最大值
        // for (let i of data.buy) {
        //     maxAmountBuy = i.amount > maxAmountBuy ? i.amount : maxAmountBuy;
        // }
        // for (let i of data.sale) {
        //     maxAmountSale = i.amount > maxAmountSale ? i.amount : maxAmountSale;
        // }
        for (let i of data.buy) {
            maxAmountBuy = i.volume > maxAmountBuy ? i.volume : maxAmountBuy;
        }
        for (let i of data.sale) {
            maxAmountSale = i.volume > maxAmountSale ? i.volume : maxAmountSale;
        }
        //设置百分比和amount
        for (let i of data.buy) {
            i.percent = Number(i.volume / maxAmountBuy);
        }
        for (let i of data.sale) {
            i.percent = Number(i.volume / maxAmountSale);
        }
        //console.log(this.pendingOrderListOriginData.version, '步骤4', new Date().getTime());
        this.calculatorDecimalPoint(data);
    }

    //计算并处理小数点位数
    calculatorDecimalPoint(data: PendingOrderShowInterface<PendingOrderInterface>) {
        let maxVolumeBuy: number = 0;
        let maxTotalBuy: number = 0;
        let maxVolumeSale: number = 0;
        let maxTotalSale: number = 0;

        for (let i of data.buy) {
            if (i.volume >= maxVolumeBuy) {
                maxVolumeBuy = i.volume;
            }
            if (i.amount >= maxTotalBuy) {
                maxTotalBuy = i.amount;
            }
        }
        for (let i of data.sale) {
            if (i.volume >= maxVolumeSale) {
                maxVolumeSale = i.volume;
            }
            if (i.amount >= maxTotalSale) {
                maxTotalSale = i.amount;
            }
        }
        //保留小数位数处理
        this.buyFixed = maxVolumeBuy >= 10000 ? 0 : maxVolumeBuy >= 1000 ? 1 : maxVolumeBuy >= 100 ? 2 : maxVolumeBuy >= 10 ? 3 : 4;
        this.buyTotalFixed = maxTotalBuy >= 10000 ? 0 : maxTotalBuy >= 1000 ? 1 : maxTotalBuy >= 100 ? 2 : maxTotalBuy >= 10 ? 3 : 4;
        this.saleFixed = maxVolumeSale >= 10000 ? 0 : maxVolumeSale >= 1000 ? 1 : maxVolumeSale >= 100 ? 2 : maxVolumeSale >= 10 ? 3 : 4;
        this.saleTotalFixed = maxTotalSale >= 10000 ? 0 : maxTotalSale >= 1000 ? 1 : maxTotalSale >= 100 ? 2 : maxTotalSale >= 10 ? 3 : 4;
        //补全数据
        //console.log(this.pendingOrderListOriginData.version, '步骤5', new Date().getTime(), '条数', data.buy.length, data.sale.length);
        this.complementPendingOrderData(data);
    }

    //补全数据
    complementPendingOrderData(data: PendingOrderShowInterface<PendingOrderInterface>) {
        if (data.buy.length < 16 && data.buy.length !== 0) {
            for (let i = 0; data.buy.length < 16; i++) {
                data.buy.push({
                    price: -1,
                    volume: -1,
                    percent: -1,
                    amount: -1
                })
            }
        }
        if (data.sale.length < 16 && data.sale.length !== 0) {
            for (let i = 0; data.sale.length < 16; i++) {
                data.sale.unshift({
                    price: -1,
                    volume: -1,
                    percent: -1,
                    amount: -1
                })
            }
        }
        this.buyPendingOrderListData = data.buy;
        this.sellPendingOrderListData = data.sale;
        //console.log(data.version, '结束', new Date().getTime());
        //console.log('----------分割----------');

        setTimeout(() => {
            this.scrolly();
        }, 1);

    }

    //买卖单切换显示
    showPendingTrade(type: string) {
        switch (type) {
            case 'buysell':
                this.depthListType = type;
                this.sellListHeight = '155px';
                this.buyListHeight = '155px';
                this.sellListHidden = 'hidden';
                this.buyListHidden = 'hidden';
                this.sellButtom = '0';
                this.sellPadding = '20px';
                this.buyPadding = '20px';
                break;
            case 'buy':
                this.depthListType = type;
                this.sellListHeight = '0px';
                this.buyListHeight = '315px';
                this.buyListHidden = 'scroll';
                this.buyPadding = '15px';
                this.sellPadding = '15px';
                break;
            case 'sell':
                this.depthListType = type;
                this.sellListHeight = '315px';
                this.buyListHeight = '0px';
                this.sellListHidden = 'scroll';
                this.sellButtom = 'auto';
                this.buyPadding = '15px';
                this.sellPadding = '15px';
                break;
        }
    }

    //获取我的委托/历史订单
    getMyOrderList(loadingFlag: boolean = true) {
        if (this.metamaskService.isLogin()) {
            this.orderData = [];
            this.orderLoadingFlag = loadingFlag;
            this.rootrexService.fetchMyOrderList(this.metamaskService.getDefaultAccount(), this.symbol, this.orderStatus, this.currentPage, this.pageSize).subscribe(res => {
                this.orderLoadingFlag = false;
                this.orderData = res.data.result;
                this.totalRow = res.data.total;
                if (!this.orderSocket) {
                    this.getOrderStatusOrAssetUpdate();
                }
            })
        } else {

        }
    }

    //切换委托单/历史订单方法
    onMyOrderTypeChange(status: number) {
        this.orderStatus = status;
        this.getMyOrderList();
    }

    //获取委托单更新数据
    getOrderStatusOrAssetUpdate() {
        this.orderSocket = true;
        this.rootrexService.fetchOrderStatusOrAssetUpdate(this.metamaskService.getDefaultAccount(), res => {
            if (res.type === 'order-status') {
                let data = res.data;
                if (data.symbol === this.symbol) {
                    for (let i of this.orderData) {
                        if (i.id === data.id) {
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
                }
            } else {
                //预留
            }
        });
    }

    // 8位小数
    slideDownDecimal() {
        function Show_Hidden(obj, icon) {
            if (obj.style.display == "block") {
                obj.style.display = 'none';
                icon.style.transform = 'rotatex(0deg)';
            } else {
                obj.style.display = 'block';
                icon.style.transform = 'rotatex(180deg)';
            }
        }

        let down_bottom = document.getElementsByClassName('down-bottom')[0];
        let icon = document.getElementsByClassName('icon-down')[0];
        Show_Hidden(down_bottom, icon);
        return false;
    }

    //全屏
    onFullScreenClick(e) {
        var k_lineIframe = $("#k-line iframe").attr("id");
        this.launchFullScreen(document.getElementById(k_lineIframe));
    }

    //K线图全屏
    launchFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    //获取K线图时间间隔
    getSupportedResolutions() {
        // TODO 暂时隐藏K线中，1分，5分，从10分开始显示K线（为了应对深度问题） 
        /*this.symbolService.supportedResolutions().subscribe(res => {
            let timeArr = res["supported_resolutions"];
            for (let i = 0; i < timeArr.length; i++) {
                this.supported_resolutions[i] = timeArr[i];
            }
        })*/
        let timeArr = [
            "15",
            "30",
            "60",
            "120",
            "240",
            "360",
            "720",
            "D",
            "W"
        ];
        for (let i = 0; i < timeArr.length; i++) {
            this.supported_resolutions[i] = timeArr[i];
        }
    }

    //时间下拉框事件
    getFavoredOptions(event, val) {
        this.kLineHideTimeSelect = true;

        if (val == '0') {
            this.kWidget.chart().setChartType(3);//area
            this.toBeArea();

        } else {
            this.klineCreateStudy();
            this.kWidget.chart().setChartType(1);
            this.kWidget.setSymbol(this.symbol, val);//重置K线图
            this.kLineDefaultVal = event.target.innerText;
        }
        setTimeout(() => {
            this.kLineHideTimeSelect = false;
        }, 1000)
    }

    // 翻页组件
    onPageChange(currentPage: number) {
        this.currentPage = currentPage;
        this.getMyOrderList();
    }

    onSizeChange(pageSize: number) {
        this.pageSize = pageSize;
        this.getMyOrderList();
    }

    //获取深度图数据
    showDepthMap() {
        let domContainer = this.renderer.selectRootElement("#container");
        let parentsWidth = $(".deal-kline-content").width();
        this.renderer.setStyle(domContainer, "width", parentsWidth + "px");//必须放在echarts初始化之前调用
        let depthChart = echarts.init(domContainer);
        let option = {
            backgroundColor: this.chartBg,
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: "#222E5D",
                axisPointer: {
                    type: 'cross',
                    lineStyle: {
                        color: '#60698D',
                        type: 'dashed'
                    },
                    label: {
                        show: false,//坐标指示器
                        fontSize: 11,
                        backgroundColor: '#222E5D',
                    }
                }
            },
            grid: {
                containLabel: true,
                left: '0%',
                right: '0%',
                bottom: '0%'
            },
            textStyle: {
                color: '#fff'
            },
            animation: false,
            xAxis:
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: "transparent"
                        }
                    },
                    axisLabel: {
                        margin: 0,
                        align: "center",
                        fontSize: 10,
                        showMaxLabel: false,
                        showMinLabel: false//不显示X轴最小刻度
                    },
                    show: true
                }
            ,
            yAxis:
                {
                    zlevel: -1,
                    offset: 0,
                    type: 'value',
                    nameTextStyle: {
                        fontSize: 10
                    },
                    splitLine: {show: false},
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: 10,
                        inside: true
                    }
                },
            series: [
                {
                    name: 'buy',
                    showSymbol: false,
                    symbol: "circle",
                    zlevel: -21,
                    label: {
                        show: false,//tool提示
                        distance: 22,
                        // offset: [27, 0],
                        color: "#fff",
                        fontSize: 12,
                        align: "center",
                        verticalAlign: "middle",
                        backgroundColor: "#222E5D",
                        padding: [10, 15, 10, 15],
                    },
                    symbolSize: 11,
                    connectNulls: true,
                    step: true,
                    emphasis: {},
                    lineStyle: {},
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#01C57B',
                            borderColor: '#01C57B'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#00fd9d'
                            }, {
                                offset: 1,
                                color: this.chartBg
                            }])
                        }
                    },
                    data: []
                },
                {
                    name: 'sell',
                    showSymbol: false,
                    symbol: "circle",
                    zlevel: 2,
                    label: {
                        show: false,//tool提示
                        distance: 22,
                        offset: [-27, -7],
                        color: "#fff",
                        fontSize: 12,
                        align: "center",
                        verticalAlign: "middle",
                        backgroundColor: "#222E5D",
                        padding: [10, 15, 10, 15],
                    },
                    symbolSize: 11,
                    connectNulls: true,
                    step: true,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#D8195A'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#D8195A'
                            }, {
                                offset: 1,
                                color: this.chartBg
                            }])
                        }
                    },
                    data: []
                }
            ]
        };
        depthChart.setOption(option);
        this.reloadDepthMap = (depthMapDatas) => {
            let buy = depthMapDatas[0];
            let sell = depthMapDatas[1];
            let seriesBuy = buy.length ? buy : [[], []];
            let seriesSell = sell.length ? sell : [[], []];
            let coordBuy = seriesBuy[seriesBuy.length - 1];
            let coordSell = seriesSell[0];

            if (coordBuy[1] || coordSell[1]) {
                if (!depthChart) {
                    return;
                }
                let option = depthChart.getOption();
                option['series'][0]['data'] = seriesBuy;
                option['series'][1]['data'] = seriesSell;
                depthChart.clear();
                depthChart.setOption(option);

                this.deepLineNodata = false;
                this.deepLineLoading = false;
            } else {
                this.deepLineNodata = true;
                this.deepLineLoading = false;
            }
            //深度图皮肤设置
            this.subscribeTheme(depthChart)
        }
    }

    //关闭socket连接
    closeSocket() {
        this.socketFlag = false;
        this.symbolService.closeSymbolSocket();
        this.rootrexService.closePendingSocket();
        this.rootrexService.closeFinishedSocket();
        this.rootrexService.closeUserSocket();
        this.rootrexService.closeGasPriceAndMinOrderLimitSocket();
    }

    //关闭interval
    closeInterval() {
        this.intervalFlag = false;
        clearInterval(this.rootrexBalanceInterval);
        clearInterval(this.legalInterval);
        // clearInterval(window["updateKLine"]);
    }

    //滚动条美化
    scrollForFirefox(ele) {
        this.ScrollService.scrollForFirefox(ele);
    }
    // 交易页面买卖单列表切换滚动条处理
    scrolly() {
        var sellScroll = document.getElementsByClassName("sell-container")[0];
        sellScroll.scrollTop = sellScroll.scrollHeight;
    }
    //点击下载按钮时
    onDownloadClick() {
        this.router.navigateByUrl('/help/download');
    }

    //获取手续费
    getAmount(appid: any) {
        this.amountService.fetchAmount(appid).subscribe(res => {
            // console.log(res)
            this.takerGasRate = new PercentPipe().transform((100 - res.data.helpData['makerGasRate']), 0, false);
            this.tradeGas = res.data.helpData['tradeGas'];
            this.orderLimitCoefficient = new PercentPipe().transform((res.data.helpData['orderLimitCoefficient']/2), 0, false);
        })
    }

}
