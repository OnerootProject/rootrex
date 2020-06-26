import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Subject } from "rxjs/Rx";

@Injectable()
export class ThemeService {

    private subject = new Subject<any>();


    /**
     * 设置皮肤消息
     */
    sendTheme(type: string) {
        this.subject.next(type);
    }
    /**
     * 清理皮肤消息
     */
    clearTheme() {
        this.subject.next();
    }
    /**
     * 获得皮肤消息
     */
    getTheme(): Observable<any> {
        return this.subject.asObservable();
    }

    /*-----Constructor Part-----*/

    constructor() {

    }

    /*-----Methods Part-----*/

    get(){
        let theme = localStorage.getItem('theme');
        return theme ? theme : 'light';
    }

    set(theme:string){
        localStorage.setItem('theme',theme);
        this.sendTheme(theme);
    }


}
