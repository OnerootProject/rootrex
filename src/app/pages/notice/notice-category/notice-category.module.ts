import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgxEchartsModule} from "ngx-echarts";
import { NoticeCategoryComponent } from './notice-category.component';
import { SharedModule } from '../../../components/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule
    ],
    declarations: [
        NoticeCategoryComponent
    ]
})
export class NoticeCategoryModule {
}
