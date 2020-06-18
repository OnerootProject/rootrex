import {Component, ViewContainerRef} from '@angular/core';
import {environment} from "../../../environments/environment";
import {LanguageService} from "../../service/langulage.service";

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

    version: string = environment.config.version;//版本号

    constructor(
        public languageService: LanguageService){

    }

}
