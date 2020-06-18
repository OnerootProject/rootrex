import {
    ComponentFactory,
    ComponentFactoryResolver,
    Injectable,
    ComponentRef,
    ViewContainerRef
} from '@angular/core';

import {PopupComponent} from "../components/popup/popup.component";

export interface PopupConfigInterface {
    message: string,
    during: number;
}

@Injectable()
export class PopupController {

    /*-----Data Part-----*/

    viewContainerRef: any;

    /*-----Constructor Part-----*/

    constructor(private resolver: ComponentFactoryResolver) {

    }

    /*-----Methods Part-----*/

    setViewContainerRef(value: ViewContainerRef) {
        this.viewContainerRef = value;
    }

    //创建弱提示弹窗 config中,message为消息内容,during为持续时间
    create(config: PopupConfigInterface) {
        let componentRef: ComponentRef<PopupComponent>;
        const factory: ComponentFactory<PopupComponent> = this.resolver.resolveComponentFactory(PopupComponent);
        componentRef = this.viewContainerRef.createComponent(factory);
        let _this = this;
        componentRef.instance.config = config;
        componentRef.instance.onPopupClick=function(){
            _this.destroy(componentRef);
        };
        //根据during自动销毁,默认3000
        setTimeout(function(){
            _this.destroy(componentRef);
        },config.during || 3000);
        return componentRef;
    }

    //销毁当前弱提示弹窗
    destroy(componentRef:ComponentRef<PopupComponent>) {
        if(componentRef && componentRef.destroy){
            componentRef.destroy();
        }
    }

}
