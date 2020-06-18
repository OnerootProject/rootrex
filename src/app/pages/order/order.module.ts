import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from './../../components/shared.module';


import {NgxEchartsModule} from "ngx-echarts";
import {OrderComponent} from './order.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        OrderComponent
    ]
})
export class OrderModule {
}
