import {Injectable} from '@angular/core';

@Injectable()
export class TickerService {

    /*-----Constructor Part-----*/

    constructor() {

    }

    /*-----Methods Part-----*/

    //获取首页的Tab: 自选、ETH、RNT
    getTab(){
        let tab = localStorage.getItem('TickerTab');
        return tab ? tab : 'ETH';
    }

    //设置首页的Tab: 自选、ETH、RNT
    setTab(tab: string){
        localStorage.setItem('TickerTab', tab);
    }

    //获取首页的Column: 币种、市价、24h涨幅等
    getColumn(){
        let column = localStorage.getItem('TickerColumn');
        return column ? column : 'tradeBaseAmount';
    }

    //设置首页的Column: 币种、市价、24h涨幅等
    setColumn(tab: string){
        localStorage.setItem('TickerColumn', tab);
    }

    //获得首页的Column的排序
    getMarketAsc(){
        let marketAsc = localStorage.getItem('TickerMarketAsc') || 'yes';
        return marketAsc == 'yes'
    }

    //设置首页的Column的排序
    setMarketAsc(ascTrue: boolean){
        localStorage.setItem('TickerMarketAsc', ascTrue ? "yes" : "no");
    }

    //获取交易页的Column: 币种、市价、24h涨幅等
    getTradeColumn(){
        let column = localStorage.getItem('TickerTradeColumn');
        //暂时用rise，之后会增加 “涨跌”、“成交量”的切换
        return column ? column : 'rise';
    }

    //设置交易页的Column: 币种、市价、24h涨幅等
    setTradeColumn(tab: string){
        localStorage.setItem('TickerTradeColumn', tab);
    }

    //获得交易页的Column的排序
    getTradeAsc(){
        let tradeAsc = localStorage.getItem('TickerTradeAsc');
        return tradeAsc == 'yes'
    }

    //设置首页的Column的排序
    setTradeAsc(ascTrue: boolean){
        localStorage.setItem('TickerTradeAsc', ascTrue ? "yes" : "no");
    }
}
