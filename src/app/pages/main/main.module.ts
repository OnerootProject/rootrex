import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../components/shared.module";

import {MainComponent} from './main.component';
import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule,
    ],
    declarations: [
        MainComponent
    ]
})
export class MainModule {
}
