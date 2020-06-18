import {CommonModule} from '@angular/common';
import {CoreModule} from '../core/core.module';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MatInputModule, MatAutocompleteModule, MatFormFieldModule} from "@angular/material";
import {MatTabsModule} from '@angular/material/tabs';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from '@ngx-translate/core'

import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {PaginatorComponent} from "./paginator/paginator.component";
import {NoticeComponent} from './notice/notice.component';

import {PopupComponent} from "./popup/popup.component";
import {DialogComponent} from "./dialog/dialog.component";
import {DepositComponent} from "./deposit/deposit.component";
import {WithdrawComponent} from "./withdraw/withdraw.component";
import {MetamaskComponent} from "./metamask/metamask.component";
import {OrderListComponent} from './order-list/order-list.component';

import {TimestampPipe} from "../pipes/timestamp.pipe";
import {AccountPipe} from "../pipes/account.pipe";
import {ZeroPipe} from "../pipes/zero.pipe";
import {TrimZeroPipe} from "../pipes/trim-zero.pipe";
import {PercentPipe} from "../pipes/percent.pipe";
import {AmountFormatPipe} from "../pipes/amount-format.pipe";
import {ThousandsSeparatedPipe} from "../pipes/thousands-separated.pipe";
import {ToFixedPipe} from "../pipes/to-fixed.pipe";
import {TxPipe} from "../pipes/tx.pipe";
import {AbsPipe} from "../pipes/abs.pipe";
import {DeepMergePipe} from "../pipes/deep-merge.pipe";
import {FinishAmountPipe} from "../pipes/finish-amount.pipe";
import {KiloPipe} from "../pipes/kilo.pipe";

import {TransferAccountsComponent} from './transfer-accounts/transfer-accounts.component';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {UnlockMetamaskComponent} from './unlock-metamask/unlock-metamask.component';
import {MetamaskAuthorizeComponent} from './metamask-authorize/metamask-authorize.component';
import { SetUpComponent } from './set-up/set-up.component';
import { LoadingComponent } from './loading/loading.component';
import { NoDataComponent } from './nodata/nodata.component';
import { NoUnlockInstallComponent } from './nounlockinstall/nounlockinstall.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatTabsModule,
        TranslateModule,
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        PaginatorComponent,
        PopupComponent,
        DialogComponent,
        DepositComponent,
        WithdrawComponent,
        MetamaskComponent,
        NoticeComponent,
        OrderListComponent,
        TimestampPipe,
        AccountPipe,
        ZeroPipe,
        TrimZeroPipe,
        PercentPipe,
        AmountFormatPipe,
        ThousandsSeparatedPipe,
        ToFixedPipe,
        TxPipe,
        AbsPipe,
        DeepMergePipe,
        FinishAmountPipe,
        KiloPipe,
        TransferAccountsComponent,
        OrderDetailComponent,
        UnlockMetamaskComponent,
        MetamaskAuthorizeComponent,
        SetUpComponent,
        LoadingComponent,
        NoDataComponent,
        NoUnlockInstallComponent
    ],
    exports: [
        FormsModule,
        HeaderComponent,
        FooterComponent,
        PaginatorComponent,
        PopupComponent,
        DialogComponent,
        DepositComponent,
        WithdrawComponent,
        MetamaskComponent,
        NoticeComponent,
        OrderListComponent,
        TimestampPipe,
        AccountPipe,
        ZeroPipe,
        TrimZeroPipe,
        PercentPipe,
        AmountFormatPipe,
        ThousandsSeparatedPipe,
        ToFixedPipe,
        TxPipe,
        AbsPipe,
        DeepMergePipe,
        FinishAmountPipe,
        KiloPipe,
        TranslateModule,
        TransferAccountsComponent,
        OrderDetailComponent,
        UnlockMetamaskComponent,
        MetamaskAuthorizeComponent,
        SetUpComponent,
        LoadingComponent,
        NoDataComponent,
        NoUnlockInstallComponent
    ]
})
export class SharedModule {
}
