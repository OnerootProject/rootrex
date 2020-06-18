import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../components/shared.module';

import {TradeComponent} from './trade.component';

import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        TradeComponent
    ]
})
export class TradeModule {
}
