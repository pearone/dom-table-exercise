# DOM 表格

### 思路：

绘制前预计算 + 滚动前预渲染

### 预计算：

根据配置和数据计算出视窗内所需节点的宽高，再渲染

在后台线程 web worker 里计算全量节点所需的宽、高

计算样式的过程可以 map reduce 思路配合多 web worker 做加速

web worker 里没有 dom 环境，无法知道实际 dom 的宽高，只能在非自动换行时使用

自动换行开启时，为防止行表头高度不对，需生成离屏 dom 做视窗内或全量的单线程计算

### 预渲染：

横向滚动时高度不能有突变，所以横向滚动+自动折行或自定义 cellRenderer+自动折行时不能用预计算

如果没有自动换行+自定义 cellRenderer，可以抽样一行中最长的部分计算高度

### 渲染顺序：

from row:0, col:0

to row:0, col:col_length

to row:row_length

按照行、列的顺序遍历

if rowspan 大于 1，记住这个单元格，继续算下一个，rowspan 包含的所有行算完重新赋一下高度

if colspan 大于 1，正常往后渲染

### 模块：

-   滚动条
-   虚拟滚动
-   排序
-   拖拽宽度
-   table-dom：输入 CellData，计算 CellStyle 等信息，输出最后插入的 DomString
-   table 本体：输入数据，调用 table-dom 计算信息和输出 DomString

### 测试用例：

单元测试 -> 对小功能测试，比如计算单元格宽高、计算视窗宽度等工具函数

快照测试 -> 对整体测试，给定恒定的配置项需要有相同的 dom 结构输出

### 竞品：

finebi：table 渲染和 div 渲染混用
quickbi：div 渲染+绝对定位
youdata：table 渲染和 canvas 渲染混用

### 经验：

想做到预渲染 dom，就不能通过 css 设置样式，得提前在配置里传入，包括小计、合计、行表头、列表头、序号、条件格式等

必须采用发布订阅，不然模块间耦合太严重了

中文是等宽字体，可以统一计算宽高来折行，英文数字等非等宽字体的折行不好计算，最好利用浏览器计算

利用浏览器计算高度时，先把元素渲染到文档里，让 td 中的 span 自动折行，赋予 td 宽度后，获取到 span 高度，再改变 td 的高度，这样可以复用大部分的 dom

尽量不要自定义 cellRenderer，计算宽高时会损耗大量性能，cellRenderer 时，统一创建所有的 text 元素，再 append 到 body 里性能高一些
