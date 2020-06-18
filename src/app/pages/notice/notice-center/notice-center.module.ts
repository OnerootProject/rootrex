import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';

import {NgxEchartsModule} from "ngx-echarts";
import { NoticeCenterComponent } from './notice-center.component';

@NgModule({
    imports: [
        CommonModule,
        NgxEchartsModule,
        SharedModule
    ],
    declarations: [
        NoticeCenterComponent
    ]
})
export class NoticeCenterModule {
}
