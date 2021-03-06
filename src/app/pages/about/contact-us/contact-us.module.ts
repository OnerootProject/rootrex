import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../components/shared.module';


import {NgxEchartsModule} from "ngx-echarts";
import {ContactUsComponent} from './contact-us.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        ContactUsComponent
    ]
})
export class ContactUsModule {
}
