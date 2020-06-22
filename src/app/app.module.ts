import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CoreModule} from './core/core.module';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';
import {NgModule, enableProdMode} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {ServiceWorkerModule} from '@angular/service-worker';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core'
import {TranslateHttpLoader} from '@ngx-translate/http-loader'
import {environment} from '../environments/environment';

//Common
import {SharedModule} from './components/shared.module';

//Service
import {TitleService} from './service/title.service';
import {ScrollService} from './service/scroll.service';
import {Api} from "./util/api.util";
import {LanguageService} from "./service/langulage.service";
import {ThemeService} from "./service/theme.service";
import {TickerService} from "./service/ticker.service";
import {MetamaskService} from "./service/metamask.service";
import {SymbolService} from "./service/symbol.service";
import {SystemService} from "./service/system.service";
import {NoticeService} from "./service/notice.service";
import {RootrexService} from "./service/rootrex.service";
import {AssetService} from "./service/asset.service";
import {PaginatorService} from "./service/paginator.service";
import {ExplorerService} from "./service/explorer.service";

//Controller
import {PopupController} from "./controller/popup.controller";
import {DialogController} from "./controller/dialog.controller";

//Pipe


//Page Module
import {MainModule} from './pages/main/main.module';
import {TradeModule} from './pages/trade/trade.module';
import {OrderModule} from './pages/order/order.module';
import {AssetsModule} from './pages/assets/my-assets/my-assets.module';
import {AssetsHistoryModule} from './pages/assets/assets-history/assets-history.module';
import {RootrexIntroduceModule} from './pages/help/introduce/introduce.module';
import {NoviceModule} from './pages/help/novice/novice.module';
import {NoticeCenterModule} from './pages/notice/notice-center/notice-center.module';
import {NoticeDetailsModule} from './pages/notice/notice-details/notice-details.module';
//about
import {AboutUsModule} from "./pages/about/about-us/about-us.module";
import {ApplyForTokenModule} from "./pages/about/apply-for-token/apply-for-token.module";
import {ContactUsModule} from "./pages/about/contact-us/contact-us.module";
import {PrivacyStatementModule} from "./pages/about/privacy-statement/privacy-statement.module";
import {RateStandardModule} from "./pages/about/rate-standard/rate-standard.module";
import {ServiceAgreementModule} from "./pages/about/service-agreement/service-agreement.module";

//Component
import {PopupComponent} from "./components/popup/popup.component";
import {DialogComponent} from "./components/dialog/dialog.component";
import {DepositComponent} from "./components/deposit/deposit.component";
import {WithdrawComponent} from "./components/withdraw/withdraw.component";
import {MetamaskComponent} from "./components/metamask/metamask.component";
import {TransferAccountsComponent} from './components/transfer-accounts/transfer-accounts.component';
import {OrderDetailComponent} from './components/order-detail/order-detail.component';
import {UnlockMetamaskComponent} from './components/unlock-metamask/unlock-metamask.component';
import {MetamaskAuthorizeComponent} from './components/metamask-authorize/metamask-authorize.component';
import {NoticeCategoryModule} from './pages/notice/notice-category/notice-category.module';
import {SetUpComponent} from './components/set-up/set-up.component';
import {DownloadModule} from './pages/help/download/download.module';

//interceptor
import {ApiInterceptor} from './util/api-interceptor';

//gtag
import {GtagModule} from "angular-gtag";
import { AmountService } from './service/amount.service';

//translate server
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + environment.config.resourceVersion);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
        BrowserAnimationsModule,
        CoreModule,
        NgxsModule.forRoot([]),
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
        MainModule,//首页
        TradeModule, //交易页面
        OrderModule, //委托页面
        AssetsModule, //资产页面
        AssetsHistoryModule, //资产历史页面
        RootrexIntroduceModule, //ROOTREX介绍页面
        NoviceModule, // 新手帮助
        DownloadModule, // 下载APP
        NoticeCenterModule, // 公告中心
        NoticeDetailsModule, // 公告详情
        NoticeCategoryModule, // 公告分类
        AboutUsModule,//关于我们
        ApplyForTokenModule,//上币申请
        ContactUsModule,//联系我们
        PrivacyStatementModule,//隐私政策
        RateStandardModule,//费率标准
        ServiceAgreementModule,//服务协议
        GtagModule.forRoot({trackingId: 'UA-124028678-4', trackPageviews: true})
    ],
    entryComponents: [
        PopupComponent,
        DialogComponent,
        DepositComponent,
        WithdrawComponent,
        MetamaskComponent,
        TransferAccountsComponent,
        OrderDetailComponent,
        UnlockMetamaskComponent,
        MetamaskAuthorizeComponent,
        SetUpComponent
    ],
    providers: [
        TitleService, // 设置title标题
        ScrollService,//设置滚动条样式
        LanguageService,//语言服务
        ThemeService,//换肤服务
        MetamaskService,//METAMASK服务
        Api,//Api集合
        SymbolService,//交易对相关Service
        SystemService,
        RootrexService,//交易相关Service
        AssetService,//资产相关Service
        NoticeService,//公告相关Service
        TickerService,//Ticker Service
        PaginatorService,//翻页相关Service
        PopupController,//弱提示服务
        DialogController,//对话框提示服务
        ExplorerService,//浏览器通知Service,
        AmountService, //获取手续费Service
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

enableProdMode();