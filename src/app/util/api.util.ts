import {environment} from "../../environments/environment";

export class Api {

    static RootrexServiceAddress = environment.config.apiUrl + "/api/v2";
    static SocketServiceAddress = environment.config.wsUrl + "/api/v2";

    notice = {
        //获取最新公告列表
        'getLatestList': '/notice/latest/list?lang={lang}',
        //获取Banner列表
        'getBannerList': '/notice/banner/list?device=2&lang={lang}',//1:mobile 2:pc
        //获取公告中心列表
        'getNoticeCenterList': '/notice/center/list?type={type}&lang={lang}',
        //获取公告列表
        'getNoticeList': '/notice/list?classify={classify}&limit={limit}&offset={offset}&lang={lang}',
        //获取公告详情
        'getNoticeDetail': '/notice/detail?pid={pid}&lang={lang}',
    };

    symbol = {
        //获取交易对列表 GET
        'getSymbolList': '/ticker/list?baseToken={baseToken}',
        //获取交易对收藏列表 GET
        'getSymbolFavoriteList': '/ticker/favorite/list?address={account}',
        //获取baseToken列表 GET
        'getBaseTokenList': '/base/list',
        //设置交易对收藏 POST
        'setSymbolFav': '/ticker/favorite',//address flag symbol
        //获取交易对详情 GET
        'getSymbolDetailBySymbol': '/ticker/detail?symbol={symbol}',
        //根据法币单位获取与ETH汇率 GET
        'getExchangeRateByLegalCurrency': '/token/price?token={currency}',
    };

    rootrex = {
        //获取K线图筛选的时间
        'getSupportedResolutions': '/tv/config',
        //获取某交易对K线图数据
        'getKLineDataBySymbol': '/tv',
        //获取pending订单片量数据
        'getPendingOrderBySymbol': '/depth/data?symbol={symbol}',
        //获取GAS Price GET
        'getGasPrice': '/misc/gas-price',
        //获取我的订单列表 GET
        'getMyOrderList': '/order/list?address={account}&symbol={symbol}&status={status}&offset={offset}&limit={limit}',
        //获取我的订单列表（订单页）GET
        'getSearchOrderList': '/order/search?address={account}&symbol={symbol}&status={status}&offset={offset}&limit={limit}',
        //获取订单详情 GET
        'getOrderDetailById': '/order/detail?orderId={id}&symbol={symbol}',
        //获取订单关联交易列表 GET TODO TYPE是否需要?
        'getOrderTradeByHash': '/order/trade/list?orderId={id}&type={type}&offset={offset}&limit={limit}&symbol={symbol}',
        //充值 BY Contract
        //提现 POST
        'withdraw': '/asset/withdraw',//?address={account}&amount={amount}&nonce={nonce}&hash={hash}&v={v}&r={r}&s={s}&lang={lang}
        //下单 POST
        'order': '/order/create',//symbol={symbol}&type={type}&price={price}&amount={amount}&address={account}&hash={hash}&v={v}&r={r}&s={s}&lang={lang}'
        //撤单 POST
        'cancel': '/order/cancel',
        //全部撤单 POST
        'cancelAll': '/order/batch-cancel',
        //转账
    };

    asset = {
        //获取我的所有币种资产列表 GET
        'getMyAssetList': '/asset/list?address={account}&all={all}',
        //获取我的资产历史充值提现记录 GET
        'getMyAssetHistory': '/asset/history/list?address={account}&token={tokenName}&offset={offset}&limit={limit}',
        //获取提现最小额 GET
        'getWithdrawFee': '/misc/withdraw-fee?token={tokenName}'
    };

    system = {
        //获取系统设定 GET
        'getSetting': '/setting'
    };

    ws = {
        //获取某交易对当前挂单数据
        'getPendingOrderBySymbol': '/?channel=depth_{symbol}',
        //获取某交易对当前成交数据
        'getFinishedOrderBySymbol': '/?channel=recent_{symbol}',
        //获取资产更新信息
        'getAssetListUpdate': '/?channel=symbol_price',
        //获取用户订单状态及资产变更数据
        'getOrderStatusOrAssetUpdate': '/?user={account}',
        //获取gasPrice和minOrderLimit
        'getGasPriceAndMinOrderLimit': '/?channel=gas_price'
    };

    amount = {
        // 获取手续费
        'getAmount': '/setting?appid={appid}'
    }



    constructor() {
        for (let i in this.notice) {
            this.notice[i] = Api.RootrexServiceAddress + this.notice[i];
        }
        for (let i in this.symbol) {
            this.symbol[i] = Api.RootrexServiceAddress + this.symbol[i];
        }
        for (let i in this.rootrex) {
            this.rootrex[i] = Api.RootrexServiceAddress + this.rootrex[i];
        }
        for (let i in this.asset) {
            this.asset[i] = Api.RootrexServiceAddress + this.asset[i];
        }
        for(let i in this.system){
            this.system[i] = Api.RootrexServiceAddress + this.system[i];
        }
        for (let i in this.ws) {
            this.ws[i] = Api.SocketServiceAddress + this.ws[i];
        }
        for(let i in this.amount){
            this.amount[i] = Api.RootrexServiceAddress + this.amount[i];
        }
    }

}
