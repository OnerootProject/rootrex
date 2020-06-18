export interface PaginatorInterface {
    currentPage:number,
    pageSize:number,
    totalRow:number,
    totalPage:number
}

export interface PaginatorApiInterface{
    offset:number,
    limit:number,
    total:number
}