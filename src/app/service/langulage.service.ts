import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TranslateService} from '@ngx-translate/core'
import {Subject} from "rxjs/Subject";

@Injectable()
export class LanguageService {

    /*-----Data Part-----*/

    private subject = new Subject<any>();

    /**
     * 设置语言消息
     */
    sendLang(type: string) {
        this.subject.next(type);
    }
    /**
     * 清理言消息
     */
    clearLang() {
        this.subject.next();
    }
    /**
     * 获得言消息
     */
    getLang(): Observable<any> {
        return this.subject.asObservable();
    }
    /*-----Constructor Part-----*/

    constructor(private translate: TranslateService) {

    }

    /*-----Methods Part-----*/

    get(){
        let explorer = navigator.language || navigator['userLanguage'];
        let langExplorer = explorer.substr(0,2);
        if(langExplorer!='zh'&&langExplorer!='en'&&langExplorer!='ko'){
            langExplorer = 'en'
        }
        let lang = localStorage.getItem('current-language');
        return lang ? lang : langExplorer;
    }

    getObservable(): Observable<any> {
        return this.subject.asObservable();
    }

    set(language:string){
        this.translate.use(language);
        localStorage.setItem('current-language', language);
        this.sendLang(language);
    }


}
