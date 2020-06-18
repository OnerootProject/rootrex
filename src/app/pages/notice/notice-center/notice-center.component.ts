import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NoticeService} from "../../../service/notice.service";
import {NoticeInterface} from "../../../interface/notice.interface";
import {Subscription} from "rxjs/Subscription";
import {LanguageService} from "../../../service/langulage.service";

@Component({
    templateUrl: './notice-center.component.html',
    styleUrls: ['./notice-center.component.scss']
})
export class NoticeCenterComponent implements OnInit {

    /*-----Data Part-----*/

    //main
    noticeListData:Array<NoticeInterface>;
    onlineListData:Array<NoticeInterface>;
    //language subscribe对象
    languageSubscribe: Subscription;

    /*-----Constructor Part-----*/

    constructor(
        private router: Router,
        private noticeService: NoticeService,
        private languageService: LanguageService
    ) {
    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        this.init();
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
        this.unsubscribeLanguage();
    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getNoticeCenterList();
        this.subscribeLanguage();
    }

    //获取公告列表
    getNoticeCenterList(){
        this.noticeService.fetchNoticeCenterList().subscribe(res=>{
            this.noticeListData = res.data.result.latestNotice;
            this.onlineListData = res.data.result.newCoin;
        })
    }

    //订阅language变动
    subscribeLanguage(){
        this.languageSubscribe = this.languageService.getObservable().subscribe(res=>{
            this.getNoticeCenterList();
        })
    }

    //取消订阅language变动
    unsubscribeLanguage(){
        this.languageSubscribe && this.languageSubscribe.unsubscribe && this.languageSubscribe.unsubscribe();
    }

    //跳转到公告详情
    gotoNoticeDetail(pid:number){
        this.router.navigateByUrl('notice/detail/'+pid);
    }

    //跳转到单类型公告列表页
    gotoNoticeCategory(type:number){
        this.router.navigateByUrl('notice/category/'+type);
    }
}
