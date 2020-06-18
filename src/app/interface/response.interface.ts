export interface ResponseArrayInterface<T>{
    code:number,
    message:string,
    data:{
        total:number,
        result:Array<T>
    }
}

export interface ResponseInterface<T>{
    code:number,
    message:string,
    data:T
}