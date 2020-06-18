import {Component} from '@angular/core';
import {Router, NavigationEnd} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

import {LanguageService} from "./service/langulage.service";
import {ThemeService} from "./service/theme.service";
import {Subscription} from "rxjs/Subscription";
import {TitleService} from './service/title.service';

import {Gtag} from "angular-gtag";

@Component({
    selector: 'root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss', './skin.scss']
})
export class AppComponent {

    theme: string;
    lang: string;

    constructor(
        private router: Router,
        private language: LanguageService,
        private themeService: ThemeService,
        private titleService: TitleService,
        private translate: TranslateService,
        private gtag: Gtag // TODO do not delete this line, it's for google analytics gtag module
    ) {
        //init language
        let currentLanguage = this.language.get();
        this.language.set(currentLanguage);
        this.lang = currentLanguage;

        //init theme
        let selectedTheme = this.themeService.get();
        this.themeService.set(selectedTheme);
        this.theme = selectedTheme;

        this.subscribeTheme();
        this.subscribeLang();
        this.setDefaultTitle();

        // listen router change
        this.router.events.subscribe(res => {
            if (res instanceof NavigationEnd) {
                // console.log(res.urlAfterRedirects);
                // TODO 事件未上报
                // this.gtag.event('demo_jump', {
                //     method: 'Demo Method', // TODO method也没什么用
                //     event_category: 'Demo Category',
                //     event_label: 'Demo Label' // TODO label实际不记录 大概只是分类
                // });
                // console.log('router events demo jump complete');
            }
        })

    }

    //订阅皮肤变化
    subscribeTheme() {
        this.themeService.getTheme().subscribe(res => {
            this.theme = res;
        })
    }

    //订阅语言变化
    subscribeLang() {
        this.language.getObservable().subscribe(res => {
            this.lang = res;
            this.setDefaultTitle();
        })
    }

    // title
    setDefaultTitle() {
        setInterval(() => {
            this.titleService.setDefaultTitle();
        }, 500)
    }

}
