import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AmountService} from '../../../service/amount.service';
import {reduce} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import BigNumber from 'bignumber.js';
import {PercentPipe} from '../../../pipes/percent.pipe';

@Component({
    templateUrl: './introduce.component.html',
    styleUrls: ['./introduce.component.scss']
})
export class RootrexIntroduceComponent implements OnInit {

    /*-----Data Part-----*/

    //获取手续费
    appid: any = environment.config.appID;
    makerGasRate;
    feeRate;
    takerGasRate;
    tradeGas;
    orderLimitCoefficient;
    withdrawGas;
    tokenValue;
    
    /*-----Constructor Part-----*/

    constructor(private router: Router,
                private amountService: AmountService,) {
    }

    /*-----Lifecycle Part-----*/

    //Mounted
    ngOnInit() {
        this.init();
    }

    //After Mounted
    ngAfterViewInit() {

    }

    //Update
    ngAfterViewChecked() {

    }

    //Destroy
    ngOnDestroy() {

    }

    /*-----Methods Part-----*/

    //init
    init() {
        this.getAmount(this.appid);
    }

    goToAssetsHistory() {
        this.router.navigateByUrl('assets-history')
    }

    //获取手续费
    getAmount(appid: any) {
        this.amountService.fetchAmount(appid).subscribe(res => {
            console.log(res)
            this.feeRate = new PercentPipe().transform(res.data.helpData['feeRate'], 1, false);
            this.makerGasRate = new PercentPipe().transform(res.data.helpData['makerGasRate'], 0, false);
            this.takerGasRate = new PercentPipe().transform((100 - res.data.helpData['makerGasRate']), 0, false);
            this.tradeGas = res.data.helpData['tradeGas'];
            this.orderLimitCoefficient = new PercentPipe().transform((res.data.helpData['orderLimitCoefficient']/2), 0, false);
            this.withdrawGas = res.data.helpData['withdrawGas'];
            this.tokenValue = new PercentPipe().transform((res.data.helpData['orderLimitCoefficient']*2), 0, false);
        })
    }

}
