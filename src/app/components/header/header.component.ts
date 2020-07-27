import {Component, OnInit, ViewContainerRef, Output, EventEmitter, Input} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

import {PopupController} from "../../controller/popup.controller";
import {DialogController} from "../../controller/dialog.controller";
import {MetamaskComponent} from "../metamask/metamask.component";

import {MetamaskService} from "../../service/metamask.service";
import {RootrexService} from "../../service/rootrex.service";
import {ThemeService} from "../../service/theme.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../service/langulage.service";
import {AssetService} from "../../service/asset.service";
import {ExplorerService} from "../../service/explorer.service";

import {UnlockMetamaskComponent} from '../unlock-metamask/unlock-metamask.component';

import {environment} from "../../../environments/environment";
import {SetUpComponent} from '../set-up/set-up.component';
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

    @Output() changeTheme = new EventEmitter();
    @Output() changeLang = new EventEmitter();

    /*-----Data Part-----*/

    routerLink: string = "home";
    popup;//popup demo
    dialog;//dialog demo
    theme: string = this.themeService.get();

    //主题颜色
    currentThemeColor;
    //皮肤切换消息
    skinMsg: Subscription;
    colorStyle;
    //主题颜色范围
    themeColorList = {
        'dark': ['#00CEFF', 'dark'],
        'light': ['#fff', 'light'],
    };
    //current metamask account
    currentAccount: string = 'account';
    //current path
    currentRouter: string = '';
    //current network
    currentNetwork: string = environment.config.ethNetwork;

    /*-----Constructor Part-----*/

    constructor(private router: Router,
                private popupCtrl: PopupController,
                private dialogCtrl: DialogController,
                private viewContainerRef: ViewContainerRef,
                public metamaskService: MetamaskService,
                private rootrexService: RootrexService,
                private themeService: ThemeService,
                private translate: TranslateService,
                public languageService: LanguageService,
                public assetService: AssetService,
                private explorerService: ExplorerService,
                private activatedRoute: ActivatedRoute) {
        this.popupCtrl.setViewContainerRef(this.viewContainerRef);
        this.dialogCtrl.setViewContainerRef(this.viewContainerRef);
    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        setTimeout(() => {
            this.init();
        }, 500);
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
        this.currentThemeColor = this.themeColorList[this.theme][0];
        this.colorStyle = this.themeColorList[this.theme][1];
        setTimeout(()=>{
            this.compareCurrentAccount();
        },5000)
        this.compareCurrentRouter();
        this.setHeaderActive();
        this.reloadPageAfter();
        this.subscribeTheme();
    }

    //设置顶部导航当前选中状态
    setHeaderActive() {
        let path = window.location.pathname;
        if (path.indexOf('/notice') !== -1 || path.indexOf('/about') !== -1) {
            this.routerLink = 'notice';
        } else if (path.indexOf('/rootrex') !== -1 ) {
            this.routerLink = 'rootrex';
        } else if (path.indexOf('/order') !== -1) {
            this.routerLink = 'order';
        } else if (path.indexOf('/asset') !== -1) {
            this.routerLink = 'asset';
        } else if (path.indexOf('/novice') !== -1) {
            this.routerLink = 'novice';
        } else {
            this.routerLink = 'home';
        }
    }

    onMyAccountClick() {
        let oInput = document.createElement('input');
        oInput.value = this.metamaskService.getDefaultAccount();
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        this.popupCtrl.create({
            message: this.translate.instant('Header.Copied'),
            during: 3000
        })
    }

    //订阅皮肤变化
    subscribeTheme() {
        this.skinMsg = this.themeService.getTheme().subscribe(res => {
            this.currentThemeColor = this.themeColorList[res][0];
            this.colorStyle = this.themeColorList[res][1];
        })
    }

    //切换激活状态
    activated(active: string, path: string, event: any) {
        this.routerLink = active;
        this.router.navigateByUrl(path);
        event.stopPropagation();
    }

    //判断当前账号是否发生变更,若变更则刷新页面 TODO 这个应该放到app.component中
    compareCurrentAccount() {
        let _account = this.metamaskService.getDefaultAccount();
        if (this.metamaskService.init()) {
            if (this.currentAccount === 'account') {
                this.currentAccount = _account;
                localStorage.setItem('current-user-address', _account);
            } else if (this.currentAccount !== _account) {
                location.reload();
            }
        }
        setTimeout(() => {
            this.compareCurrentAccount();
        }, 5000)
    }

    //判断当前路由是否发生变化
    compareCurrentRouter() {
        let _path = window.location.pathname;
        if (_path) {
            if (this.currentRouter !== _path) {
                this.setHeaderActive();
                this.currentRouter = _path;
            }
        }
        setTimeout(() => {
            this.compareCurrentRouter();
        }, 500);
    }

    //放置4小时后刷新页面
    reloadPageAfter() {
        setTimeout(() => {
            location.reload();
        }, 4 * 60 * 60 * 1000);
    }

    //打开设置弹窗
    openSetUpDialog() {
        this.dialogCtrl.createFromComponent(SetUpComponent);
    }


}
