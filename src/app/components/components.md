# 公用组件用法

### 翻页组件
```
<paginator  [currentPage]="1"
            [pageSize]="10"
            [totalRow]="200"
            (onCurrentPageChange)="onPageChange($event)" >
</paginator>
```

* Input() [currentPage]:number 当前页码
* Input() [pageSize]:number 每页数量
* Input() [totalRow]:number 记录总数
* Output() (onCurrentPageChange):function(newPage:number) 页码变更时触发