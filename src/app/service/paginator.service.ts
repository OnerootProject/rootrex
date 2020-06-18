import {Injectable} from '@angular/core';

import {PaginatorInterface,PaginatorApiInterface} from "../interface/paginator.interface";

@Injectable()
export class PaginatorService {

    /*-----Data Part-----*/

    /*-----Constructor Part-----*/

    constructor() {

    }

    /*-----Methods Part-----*/

    //调接口前初始化接口翻页所需数据
    paginatorToApi(data:PaginatorInterface):PaginatorApiInterface{
        return {
            offset: (data.currentPage-1)*data.pageSize,
            limit: data.pageSize,
            total: 0
        };
    }

    //接口返回后初始化翻页组件所需数据
    apiToPaginator(data:PaginatorApiInterface):PaginatorInterface{
        return {
            currentPage: (data.offset/data.limit)+1,
            pageSize: data.limit,
            totalRow: data.total,
            totalPage: Math.ceil(data.total/data.limit)
        }
    }

}
