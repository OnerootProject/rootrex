import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';


import {NgxEchartsModule} from "ngx-echarts";
import { RootrexIntroduceComponent } from './introduce.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        RootrexIntroduceComponent
    ]
})
export class RootrexIntroduceModule {
}
