import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';


import {NgxEchartsModule} from "ngx-echarts";
import {PrivacyStatementComponent} from './privacy-statement.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        PrivacyStatementComponent
    ]
})
export class PrivacyStatementModule {
}
