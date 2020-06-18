import {RouterModule, Routes} from '@angular/router';

import {MainComponent} from './pages/main/main.component';

import {NgModule} from '@angular/core';
import {TradeComponent} from './pages/trade/trade.component';
import {OrderComponent} from './pages/order/order.component';
import {AssetsComponent} from './pages/assets/my-assets/my-assets.component';
import {AssetsHistoryComponent} from './pages/assets/assets-history/assets-history.component';
import {RootrexIntroduceComponent} from './pages/help/introduce/introduce.component';
import {NoviceComponent} from './pages/help/novice/novice.component';
import {NoticeCenterComponent} from './pages/notice/notice-center/notice-center.component';
import {NoticeDetailsComponent} from './pages/notice/notice-details/notice-details.component';
import {NoticeCategoryComponent} from './pages/notice/notice-category/notice-category.component';

import {AboutUsComponent} from "./pages/about/about-us/about-us.component";
import {ApplyForTokenComponent} from "./pages/about/apply-for-token/apply-for-token.component";
import {ContactUsComponent} from "./pages/about/contact-us/contact-us.component";
import {PrivacyStatementComponent} from "./pages/about/privacy-statement/privacy-statement.component";
import {RateStandardComponent} from "./pages/about/rate-standard/rate-standard.component";
import {ServiceAgreementComponent} from "./pages/about/service-agreement/service-agreement.component";
import { DownloadComponent } from './pages/help/download/download.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'trade',
        children: [
            {path: '', redirectTo: '/', pathMatch: 'full'},
            {path: ':symbol', component: TradeComponent}
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'order',
        children: [
            {path: '', redirectTo: 'pending', pathMatch: 'full'},
            {path: ':status', component: OrderComponent}
        ]
    },
    {
        path: 'asset',
        children: [
            {path: '', redirectTo: 'my', pathMatch: 'full'},
            {path: 'my', component: AssetsComponent},
            {path: 'history', component: AssetsHistoryComponent}
        ]
    },
    {
        path: 'help',
        children: [
            {path: '', redirectTo: 'rootrex', pathMatch: 'full'},
            {path: 'rootrex', component: RootrexIntroduceComponent},
            {path: 'novice', component: NoviceComponent},
            {path: 'download', component: DownloadComponent}
        ]
    },
    {
        path: 'about',
        children: [
            {path: '', redirectTo: 'us', pathMatch: 'full'},
            {path: 'us', component: AboutUsComponent},
            {path: 'apply', component: ApplyForTokenComponent},
            {path: 'contact', component: ContactUsComponent},
            {path: 'privacy', component: PrivacyStatementComponent},
            {path: 'rate', component: RateStandardComponent},
            {path: 'service', component: ServiceAgreementComponent}
        ]
    },
    {
        path: 'notice',
        children: [
            {path: '', component: NoticeCenterComponent},
            {path: 'category/:type', component: NoticeCategoryComponent},
            {path: 'detail/:pid', component: NoticeDetailsComponent},
        ]
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
