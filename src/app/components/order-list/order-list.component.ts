import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {OrderInterface} from "../../interface/rootrex.interface";
import {DialogController} from "../../controller/dialog.controller";
import {OrderDetailComponent} from "../order-detail/order-detail.component";
import {RootrexService} from "../../service/rootrex.service";
import {MetamaskService} from "../../service/metamask.service";
import {PopupController} from "../../controller/popup.controller";
import {TranslateService} from "@ngx-translate/core";
import {SymbolService} from "../../service/symbol.service";

@Component({
    selector: 'order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() orderList: Array<OrderInterface>;
    @Input() symbol:string;
    @Input() loadingFlag: boolean;
    //当前订单类型
    @Input() type:number = 0;//0:pending 1:finished
    @Output() onTypeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() onSearchClick: EventEmitter<string> = new EventEmitter<string>();

    //是否显示筛选框
    showSearch: boolean = false;
    //筛选用的tokenName和baseName
    tokenName:string = '';
    baseName:string = '';
    //当前标签页
    active: number = 1;
    //BaseToken列表
    baseTokenListData: Array<string> = [];

    /*-----Constructor Part-----*/

    constructor(private dialogCtrl: DialogController,
                private rootrexService: RootrexService,
                public metamaskService: MetamaskService,
                private popupCtrl: PopupController,
                private translate: TranslateService,
                private symbolService: SymbolService) {

    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        this.init();
    }

    //After Mounted
    ngAfterViewInit() {

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
        this.showSearch = !this.symbol;
        this.getBaseTokenList();
    }

    //获取BaseToken列表
    getBaseTokenList() {
        this.symbolService.fetchBaseTokenList().subscribe(res => {
            this.baseTokenListData = res.data.result;
        })
    }
    
    onOrderDetailClick(id: string, symbol: string) {
        this.dialogCtrl.createFromComponent(OrderDetailComponent, {
            id: id,
            symbol: symbol,
            closeFunction: ()=>{
                this.onTypeChange.next(this.type);
            }
        })
    }

    //切换标签时
    onTypeChangeClick(type: number) {
        this.type = type;
        this.onTypeChange.next(this.type)
    }

    //在输入框回车时
    onSearchKeyPress(event){
        if(event.key==='Enter'){
            this.onSymbolSearchClick();
        }
    }

    //点击搜索时
    onSymbolSearchClick(){
        let symbol = this.tokenName + '_' + this.baseName;
        this.onSearchClick.next(symbol)
    }

    //点击重置时
    onResetClick(){
        this.tokenName = '';
        this.baseName = '';
        this.onSearchClick.next('');
    }

    //撤单
    onWithdrawalClick(id: number, symbol: string) {
        if(this.metamaskService.isLogin()){
            this.rootrexService.withdrawal(this.metamaskService.getDefaultAccount(), symbol, id, res => {
                if(!res.code){
                    //撤单成功后刷新数据
                    this.onTypeChangeClick(this.type);
                    this.popupCtrl.create({
                        message: this.translate.instant('Rootrex.CancelSuccessful'),
                        during: 3000
                    })
                }else{
                    this.popupCtrl.create({
                        message: res.message,
                        during: 3000
                    })
                }
            })
        }else{
            this.metamaskService.unlogin();
        }
    }

    //全部撤单
    cancelAll(){
        if(this.metamaskService.isLogin()){
            this.rootrexService.cancelAll(this.metamaskService.getDefaultAccount(),this.symbol,res=>{
                if(!res.code){
                    //撤单成功后刷新数据
                    this.onTypeChangeClick(this.type);
                    this.popupCtrl.create({
                        message: this.translate.instant('Rootrex.CancelSuccessful'),
                        during: 3000
                    })
                }else{
                    this.popupCtrl.create({
                        message: res.message,
                        during: 3000
                    })
                }
            })
        }else{
            this.metamaskService.unlogin();
        }
    }

    //搜索下拉
    slideDownSelect() {
        function Show_Hidden(obj, icon) {
            if (obj.style.display == "block") {
                obj.style.display = 'none';
                icon.style.transform = 'rotatex(0deg)';
            } else {
                obj.style.display = 'block';
                icon.style.transform = 'rotatex(180deg)';
            }
        }
        let down_box = document.getElementsByClassName('down-box')[0];
        let icon = document.getElementsByClassName('icon-down')[0];
        Show_Hidden(down_box, icon);
        return false;
    }
}
