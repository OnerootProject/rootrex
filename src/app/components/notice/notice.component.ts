import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NoticeService} from "../../service/notice.service";
import {NoticeInterface} from "../../interface/notice.interface";
import {Subscription} from "rxjs/Subscription";
import {LanguageService} from "../../service/langulage.service";

declare var $;

@Component({
    selector: 'notice',
    templateUrl: './notice.component.html',
    styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

    /*-----Data Part-----*/

    scrollTimer: any;
    scrollElement: any;
    noticeDataList: Array<NoticeInterface> = [];
    //language subscribe对象
    languageSubscribe: Subscription;

    /*-----Constructor Part-----*/

    constructor(public router: Router,
                private noticeService: NoticeService,
                private languageService: LanguageService) {

    }

    /*-----Lifecycle Park-----*/

    //Mounted
    ngOnInit() {

    }

    //After Mounted
    ngAfterViewInit() {
        this.init();
    }

    //Update
    ngAfterViewChecked() {

    }

    //Destroy
    ngOnDestroy() {
        clearInterval(this.scrollTimer);
        this.unsubscribeLanguage();
    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getLatestNoticeList();
        this.subscribeLanguage();
        setTimeout(() => {
            this.slideNotice();
        }, 1);
    }

    //设置公告滚动
    slideNotice() {
        let _this = this;
        $(function () {
            _this.scrollElement = $(".notice_active");
            //开始时运行一次
            scrollNews();
            _this.scrollElement.hover(function () {
                //鼠标移入时终止滚动
                clearInterval(_this.scrollTimer);
            }, function () {
                //鼠标移出时运行一次
                scrollNews();
            });

            function scrollNews() {
                _this.scrollTimer = setInterval(function () {
                    let $self = _this.scrollElement.find("ul");
                    let lineHeight = $self.find("li:first").height();
                    $self.animate({
                        "marginTop": -lineHeight + "px"
                    }, 600, function () {
                        let first = $self.find('li:first');
                        $self.append(first);
                        $self.css({'marginTop': 0});
                    })
                }, 2500);
            }
        })
    }

    //获取最新公告列表
    getLatestNoticeList() {
        this.noticeDataList = [];
        this.noticeService.fetchLatestNoticeList().subscribe(res => {
            this.noticeDataList = res.data.result;
        })
    }

    //订阅language变动
    subscribeLanguage(){
        this.languageSubscribe = this.languageService.getObservable().subscribe(res=>{
            this.getLatestNoticeList();
        })
    }

    //取消订阅language变动
    unsubscribeLanguage(){
        this.languageSubscribe && this.languageSubscribe.unsubscribe && this.languageSubscribe.unsubscribe();
    }

    //跳转至公告中心
    goToNoticeCenter() {
        this.router.navigateByUrl('notice');
    }
}
