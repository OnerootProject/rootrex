export interface SymbolInterface {
    collection_state: boolean, //收藏状态
    tokenName: string,//交易对名称
    baseName: string,//基础币种
    price: string,//当前价格
    tradeAmount: string,//交易量(24小时
    tradeBaseAmount: string,//交易量base值(24小时
    rise: string,//涨跌幅
    highPrice24h: string,//24小时最高价
    lowPrice24h: string,//24小时最低价
    isFavorite: number//是否收藏
    base_info: TokenInterface,
    token_info: TokenInterface,
    metamaskBalance: string,
    rootrexBalance: string,
    rootrexFrozen: string,
    basePriceToEth: string,
    priceScale: string,//价格小数位数
    lastDayPrice: string,//昨日价格
    lastPrice: string,//上一次价格
    amountScale: string,//数量小数位数
    symbol: string,
    depthRule: string,//深度合并的可合并值
}

export interface TokenInterface {
    address: string,
    address_kovan: string,
    tokenName: string,
    decimal: string,
    limitApprove: string
}

export interface SymbolMarketInterface {
    ETH: {
        id: string,
        name: string,
        symbol: string,
        rates: {
            code: string,
            name: string,
            rate: string
        }[],
        percent_change_1h: string,
        percent_change_24h: string,
        percent_change_7d: string
    },
    RNT: {
        id: string,
        name: string,
        symbol: string,
        rates: {
            code: string,
            name: string,
            rate: string
        }[],
        percent_change_1h: string,
        percent_change_24h: string,
        percent_change_7d: string
    }
}