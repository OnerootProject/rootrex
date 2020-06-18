import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

import {LanguageService} from "../../../service/langulage.service";
import {NoticeService} from "../../../service/notice.service";
import {NoticeInterface} from "../../../interface/notice.interface";
import {Subscription} from "rxjs/Subscription";

@Component({
    templateUrl: './notice-details.component.html',
    styleUrls: ['./notice-details.component.scss']
})
export class NoticeDetailsComponent implements OnInit {

    /*-----Data Part-----*/

    //main
    noticeId: number = this.activatedRouter.snapshot.params['pid'];
    noticeData: NoticeInterface;
    //language subscribe对象
    languageSubscribe: Subscription;

    /*-----Constructor Part-----*/

    constructor(private noticeService: NoticeService,
                private router: Router,
                private activatedRouter: ActivatedRoute,
                private languageService: LanguageService) {
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
        this.getNoticeDetail();
        this.subscribeLanguage();
    }

    //获取Notice详情
    getNoticeDetail() {
        this.noticeService.fetchNoticeDetail(this.noticeId).subscribe(res => {
            this.noticeData = res.data;
        })
    }

    //订阅language变动
    subscribeLanguage(){
        this.languageSubscribe = this.languageService.getObservable().subscribe(res=>{
            this.getNoticeDetail();
        })
    }

    //取消订阅language变动
    unsubscribeLanguage(){
        this.languageSubscribe && this.languageSubscribe.unsubscribe && this.languageSubscribe.unsubscribe();
    }

    //跳转到公告中心页
    gotoNoticeCenter(){
        this.router.navigateByUrl('notice');
    }

    //跳转到单类型公告列表页
    gotoNoticeCategory(type:string){
        this.router.navigateByUrl('notice/category/'+type);
    }




}
