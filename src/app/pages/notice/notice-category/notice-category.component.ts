import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {NoticeInterface} from "../../../interface/notice.interface";
import {NoticeService} from "../../../service/notice.service";

@Component({
    templateUrl: './notice-category.component.html',
    styleUrls: ['./notice-category.component.scss']
})
export class NoticeCategoryComponent implements OnInit {

    /*-----Data Part-----*/

    //main
    noticeType: number = this.activatedRouter.snapshot.params['type'];
    noticeListData: Array<NoticeInterface>;

    currentPage: number = 1;
    pageSize: number = 10;
    totalRow: number = 0;

    /*-----Constructor Part-----*/

    constructor(private router: Router,
                private activatedRouter: ActivatedRoute,
                private noticeService: NoticeService) {
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

    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getNoticeList();
    }

    //获取NoticeList
    getNoticeList() {
        this.noticeService.fetchNoticeList(this.noticeType, this.currentPage, this.pageSize).subscribe(res => {
            this.noticeListData = res.data.result;
            this.totalRow = res.data.total;
        })
    }

    //跳转到消息详情
    goToNoticeDetail(pid: number) {
        this.router.navigateByUrl('notice/detail/' + pid);
    }

    //切换页面方法
    onPageChange(currentPage:number){
        this.currentPage = currentPage;
        this.getNoticeList();
    }

    //切换pageSize方法
    onSizeChange(pageSize:number){
        this.pageSize = pageSize;
        this.getNoticeList();
    }

}
