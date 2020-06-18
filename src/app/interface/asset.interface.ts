export interface AssetInterface {
    address: string,
    tokenName: string,
    tokenAmount: string,//余额
    frozenAmount: string,//冻结余额
    totalAmount: string,//总价值
    decimal: string,
    logo: string,
    limitApprove: string,
    walletBalance: string,//钱包余额
    isRefresh: boolean,//刷新状态
    isExpand: boolean,//展开状态
    tradeList: Array<any>//可交易列表
}

export interface AssetHistoryInterface {
    tx: string,
    created_at: any,
    finished_at: any,
    gasFee: string, // ETH gas费
    gasTokenFee: string, // Token gas费
    status: string,//状态 -1:失败 0:处理中 1:完成 2:等待区块确认
    tokenAmount: string,//数量
    tokenName: string,//币种
    type: string,//操作类型 1:充值 2:提现
    logo: string,
    confirmInfo: string//区块确认信息
}

export interface WithdrawFeeInterface {
    gasTokenFee: string
}