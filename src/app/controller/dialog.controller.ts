import {
    ComponentFactory,
    ComponentFactoryResolver,
    Injectable,
    ComponentRef,
    ViewContainerRef
} from '@angular/core';

import {DialogComponent} from "../components/dialog/dialog.component";

//默认弹窗所需Interface
export interface DialogConfigInterface {
    title: string,
    content: string,
    buttons: Array<DialogButtonConfigInterface>
}

export interface DialogButtonConfigInterface {
    text: string,
    color: string,
    handle: Function
}

//自定义弹窗各类Interface
export interface DepositDialogConfigInterface {
    tokenName: string,
    tokenWei: string,
    tokenContract: string,
    limitApprove: string,
    callback: Function
}

export interface WithdrawDialogConfigInterface {

}

//Metamask授权Interface
export interface MetamaskAuthorizeInterface {
    message: string,
    action:string
}

export interface OrderDetailConfigInterface {
    id: string,
    symbol: string,
    closeFunction: Function
}

@Injectable()
export class DialogController {

    /*-----Data Part-----*/

    viewContainerRef: any;

    /*-----Constructor Part-----*/

    constructor(private resolver: ComponentFactoryResolver) {

    }

    /*-----Methods Part-----*/

    setViewContainerRef(value: ViewContainerRef) {
        this.viewContainerRef = value;
    }

    //创建普通弹窗,适用于固定格式,标题内容+按钮的类型
    create(config: DialogConfigInterface) {
        let componentRef: ComponentRef<DialogComponent>;
        const factory: ComponentFactory<DialogComponent> = this.resolver.resolveComponentFactory(DialogComponent);
        componentRef = this.viewContainerRef.createComponent(factory);
        let _this = this;
        componentRef.instance.config = config;
        componentRef.instance.onDialogClose = function () {
            _this.destroy(componentRef);
        };
        return componentRef;
    }

    //销毁普通弹窗
    destroy(componentRef: ComponentRef<DialogComponent>) {
        if (componentRef && componentRef.destroy) {
            componentRef.destroy();
        }
    }

    //创建自定义弹窗,适用于展示型,只有一个关闭按钮但是内部内容丰富的类型 第一个参数:组件对象 第二个参数:需传入组件内部的值
    createFromComponent(targetComponent: any, config: any = {}) {
        const factory = this.resolver.resolveComponentFactory(targetComponent);
        let componentRef = this.viewContainerRef.createComponent(factory);
        let _this = this;
        componentRef.instance.config = config;
        componentRef.instance.onDialogClose = function () {
            _this.destroy(componentRef);
        };
        return componentRef;
    }

    //销毁自定义弹窗
    destoryFromComponent(componentRef: any) {
        if (componentRef && componentRef.destroy) {
            componentRef.destroy();
        }
    }

}
