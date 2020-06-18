import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';


import {NgxEchartsModule} from "ngx-echarts";
import {ApplyForTokenComponent} from './apply-for-token.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        ApplyForTokenComponent
    ]
})
export class ApplyForTokenModule {
}
