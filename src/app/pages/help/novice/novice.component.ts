import {Component, OnInit} from '@angular/core';
import {ScrollService} from "../../../service/scroll.service";

declare var $;
@Component({
    templateUrl: './novice.component.html',
    styleUrls: ['./novice.component.scss']
})
export class NoviceComponent implements OnInit {

    /*-----Data Part-----*/

    currentSelectExplorer:string='chrome';
    //main

    //page
    pageSize: number = 10;
    fixedClass:boolean = false;
    overScroll:boolean = false;
    anchorNum:number = 7;
    // 
    num: number = 1;

    /*-----Constructor Part-----*/

    constructor(
        private ScrollService: ScrollService
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
        window.onscroll = null;
    }

    /*-----Methods Part-----*/

    //init
    init() {
         this.anchor();
    }

    currColor(num:number){
        let windowHeight = window.innerHeight;
        let dom_scrollBeautiful = document.getElementsByClassName('scrollBeautiful');
        this.num = num;
        //小屏幕-导航滚动条处理
        if(num >= this.anchorNum && windowHeight <= 790){
            if(dom_scrollBeautiful && dom_scrollBeautiful[0]){
                dom_scrollBeautiful[0].scrollTop=1000;
            }
            this.overScroll = true;
        }else{
            this.overScroll = false;
        }
    }

    slideTo(ele){
        let thisAnchorNum = ele.target.getAttribute("anchor");
        $('html,body').stop().animate({
            scrollTop: $('[name=anchor' + thisAnchorNum + ']').offset().top - 100
        }, 1000);
    }

    anchor(){
        window.onscroll = ()=>{
            let windowScrollTop = document.documentElement.scrollTop;
            let dom_scrollY = document.getElementsByClassName('scroll-y');
            if(dom_scrollY && dom_scrollY[0]){
                let liLen =  dom_scrollY[0].children.length ;
                for (let i = 0; i< liLen+1 ; i++) {
                    if(i>1){
                        let positions = $('[name="anchor'+(i>1?i-1:i)+'"]').offset().top;
                        if(windowScrollTop >= positions){
                            this.currColor(i)
                        }
                    }else{
                        this.currColor(1)
                    }

                }
            }
            this.fixedClass = windowScrollTop > 90;
        }
    }

    //滚动条美化
    scrollForFirefox(ele) {
        this.ScrollService.scrollForFirefox(ele);
    }
}
