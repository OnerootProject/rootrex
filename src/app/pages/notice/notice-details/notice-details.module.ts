import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../../components/shared.module";

import {NgxEchartsModule} from "ngx-echarts";
import { NoticeDetailsComponent } from './notice-details.component';

@NgModule({
    imports: [
        CommonModule,
        NgxEchartsModule,
        SharedModule
    ],
    declarations: [
        NoticeDetailsComponent
    ]
})
export class NoticeDetailsModule {
}
