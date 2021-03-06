import {Injectable} from '@angular/core';

@Injectable()
export class ScrollService {

    constructor() {
    }

    /*
    scrollBeautiful：固定宽高
    overflow_y：内容自适应
    * <div class='scrollBeautiful'>
    *       <div class="overflow_y">...</div>
    *       <span class='scrollBar'></span>
    * </div>
    * */
    scrollForFirefox(ele) {
        if (navigator.userAgent.indexOf('Firefox') >= 0) {//Firefox
            let element = ele.target;
            let scrollTop = element.scrollTop;
            let boxHight = element.clientHeight;
            let contentHeight = element.children[0].clientHeight; //内容高度
            let scrollBar = element.children[1]; //滚动条

            scrollBar.style.height = (boxHight / contentHeight) * 100 + "%";
            const scrollBarHeight = (boxHight / contentHeight) * boxHight;
            if (scrollTop < (contentHeight - boxHight)) {
                const topNum = ((boxHight - scrollBarHeight) / (contentHeight - boxHight)) * scrollTop;
                scrollBar.style.top = parseInt(topNum + scrollTop) + "px";
             } else {
                 return;
             }
        }
    }

}
