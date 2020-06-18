export interface OrderInterface {
    id: number,
    orderId: number,
    baseName: string,
    tokenName: string,
    created_at: string,
    finished_at: string,
    type: string,//0:买 1:卖
    symbol: string,
    calUnitPrice: string,//挂单价
    calTokenAmount: string,//委托量
    calBaseAmount: string,//Base委托量
    avgUnitPrice: string,//平均单价(这个应该是用在历史单里
    calTokenInventory: string,//待交易量
    calBaseInventory: string,//待成交额
    calTokenSuccess: string,//已成交量
    calBaseSuccess: string,//已成交额
    status: string,//0:挂单 1:历史
    serviceTokenFee: string,//手续费
    totalGasFee: string,//Gas费
}

export interface OrderDetailInterface {
    avgGasPrice: string,
    avgUnitPrice: string,
    baseName: string,
    calBaseAmount: string,
    calBaseInventory: string,
    calTokenAmount: string,
    calTokenInventory: string,
    calUnitPrice: string,
    calTokenFinished: number,//已成交量
    calBaseFinished: string,//已成交额
    calTokenSuccess: string,//已成交量
    calBaseSuccess: string,//已成交额
    created_at: string,
    feeTokenName:string,//手续费收取类型
    finished_at: string,
    gasFee: string
    gasTokenFee: string,//gas费用
    id: number,
    serviceTokenFee: string,
    tokenName: string,
    totalGasFee: string,
    totalGasUsed: string,
    type: string,
    status: string,
}

export interface OrderTradeInterface {
    tx: string,//?
    status: string,//状态
    tokenName: string,//Token名
    baseName: string,//Base名
    timestamp: string,//时间戳
    unitPrice: string,//单价
    tokenAmount: string,//总量
    gasPrice: string,//Gas单价
    gasTokenFee: string,//gas费用
    avgGasUsed: string,//平均gas使用
    type: string,//string?买卖?
    created_at: string,
    feeTokenName:string,//手续费收取类型
}

export interface PendingOrderInterface {
    price: number,//单价
    volume: number,//数量
    amount: number,//总量
    percent: number//百分比
}

export interface PendingOrderResponseInterface<T> {
    b: Array<T>,
    s: Array<T>,
    v?: string
}

export interface PendingOrderShowInterface<T> {
    buy: Array<T>,
    sale: Array<T>,
    version?: string
}

export interface FinishedOrderInterface {
    datetime: number,
    type: number,
    price_finished: string,
    volume_finished: string,
    tx?: string
}