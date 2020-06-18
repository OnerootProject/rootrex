import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../components/shared.module";

import {NgxEchartsModule} from "ngx-echarts";
import {NoviceComponent} from './novice.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule,
        RouterModule
    ],
    declarations: [
        NoviceComponent
    ]
})
export class NoviceModule {
}
