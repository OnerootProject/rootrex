import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DepositDialogConfigInterface} from "../../controller/dialog.controller";
import { LanguageService } from '../../service/langulage.service';
import { AssetService } from '../../service/asset.service';
import { ThemeService } from '../../service/theme.service';

@Component({
    templateUrl: 'set-up.component.html',
    styleUrls: ['./set-up.component.scss']
})
export class SetUpComponent implements OnInit {

    /*-----Data Part-----*/

    @Input() config: DepositDialogConfigInterface;//各配置项信息
    @Input() onDialogClose: Function;//必留参数
    @Input() theme: string;
    @Output() changeTheme = new EventEmitter();
    @Output() changeLang = new EventEmitter();

    fadeFlag: string = 'fadeIn';

    obj : any;
    icon : any;

    setLang:string = this.languageService.get();
    setTheme:string = this.themeService.get();
    setCurrency:string = this.assetService.getCurrency();

    /*-----Constructor Part-----*/

    constructor(
        public languageService: LanguageService,
        public assetService: AssetService,
        private themeService: ThemeService,
    ) {

    }

    /*-----Lifecycle Park-----*/

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
        //this.SlideDown(this.obj, this.icon);
    }

    close(){
        let _this = this;
        this.fadeFlag = 'fadeOut';
        setTimeout(function(){
            _this.onDialogClose();
        },250)//小于300
    }

    SlideDown(obj, icon){
        function Show_Hidden(obj, icon) {
            if (obj.style.display == "block") {
                obj.style.display = 'none';
                icon.style.transform = 'rotatex(0deg)';
            } else {
                obj.style.display = 'block';
                icon.style.transform = 'rotatex(180deg)';
            }
        }
        Show_Hidden(obj, icon);
        return false;
    }
    slideDownCurrency() {
        let down_box = document.getElementsByClassName('down-box')[0];
        let icon = document.getElementsByClassName('icon-down')[0];
        this.SlideDown(down_box, icon);
    }
    slideDownLanguage(){
        let down_box1 = document.getElementsByClassName('down-box')[1];
        let icon1 = document.getElementsByClassName('icon-down')[1];
        this.SlideDown(down_box1, icon1);
    }

    //切换主题
    switchTheme(theme: string) {
        this.changeTheme.emit(theme);
        this.themeService.set(theme);
    }

    //切换语言
    switchLanguage(language: string) {
        this.changeLang.emit(language);
        this.languageService.set(language);
    }

    //切换币种
    switchCurrency(currency: string) {
        this.assetService.setCurrency(currency);
    }

    //设置
    setting(){
        this.switchTheme(this.setTheme);
        this.switchLanguage(this.setLang);
        this.switchCurrency(this.setCurrency);
        this.close();
    }

}
