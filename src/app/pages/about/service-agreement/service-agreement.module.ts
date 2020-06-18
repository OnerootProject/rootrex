import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';


import {NgxEchartsModule} from "ngx-echarts";
import {ServiceAgreementComponent} from './service-agreement.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        ServiceAgreementComponent
    ]
})
export class ServiceAgreementModule {
}
