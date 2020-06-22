import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Api} from "../util/api.util";

import {ResponseArrayInterface, ResponseInterface} from "../interface/response.interface";
import {BannerInterface, NoticeInterface} from "../interface/notice.interface";
import {PaginatorApiInterface, PaginatorInterface} from "../interface/paginator.interface";
import {PaginatorService} from "./paginator.service";
import {LanguageService} from "./langulage.service";

@Injectable()
export class NoticeService {

    /*-----Data Part-----*/

    /*-----Constructor Part-----*/

    constructor(private api: Api,
                private http: HttpClient,
                private paginatorService: PaginatorService,
                private languageService: LanguageService
                ) {

    }

    /*-----Methods Part-----*/

    //获取Banner列表
    fetchBannerList(){
        return this.http.get<ResponseArrayInterface<BannerInterface>>(this.api.notice.getBannerList);
    }

    //获取最新公告列表
    fetchLatestNoticeList(){
        return this.http.get<ResponseArrayInterface<NoticeInterface>>(this.api.notice.getLatestList);
    }

    //获取公告中心列表
    fetchNoticeCenterList(){
        return this.http.get<ResponseInterface<any>>(this.api.notice.getNoticeCenterList.replace("{type}","1,2"));
    }

    //获取公告列表
    fetchNoticeList(type:number,currentPage:number,pageSize:number){
        let page: PaginatorInterface = {
            currentPage: currentPage,
            pageSize: pageSize,
            totalPage: 0,
            totalRow: 0
        };
        let pageApi: PaginatorApiInterface = this.paginatorService.paginatorToApi(page);
        return this.http.get<ResponseArrayInterface<NoticeInterface>>(this.api.notice.getNoticeList.replace("{classify}",type.toString()).replace("{offset}",pageApi.offset.toString()).replace("{limit}",pageApi.limit.toString()));
    }

    //获取公告详情
    fetchNoticeDetail(pid:number){
        return this.http.get<ResponseInterface<NoticeInterface>>(this.api.notice.getNoticeDetail.replace("{pid}",pid.toString()));
    }



}
