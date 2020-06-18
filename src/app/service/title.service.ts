import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Injectable()
export class TitleService {
    constructor(private titleService: Title,
                private translate: TranslateService,
                private router: Router) {
    }

    setDefaultTitle() {
        if (this.router.url.indexOf('trade') == -1) {
            this.setTitle(this.translate.instant('Common.Title'));
        }
    }

    setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }
}
