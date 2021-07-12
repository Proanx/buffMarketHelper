## **本插件完全免费**  
|[更新日志][commits]|│|[插件介绍](#intro)|│|[常见问题与解决办法](#support)|
|-|-|-|-|-|
### 感谢这些人的帮助：
- @lyl001 `提供信息实现每页数量选择功能`  
- Gear Project(Gear Browser) `提供关于正则修改建议`  

---  
## **插件可以干这些事** <a name="intro"></a>  
> **在市场列表页：** （[图1](#photo1)）  
> 1. 显示饰品的挂刀比例、挂刀后的实际可得、steam求购人数、求购的挂刀比例  
> 2. 依据饰品的比例/挂刀比例进行从高到低/从低到高排序  
> 3. 根据颜色区分比例高低，且颜色可以自定义  
> 4. 右侧悬浮栏添加巨大下一页按钮，不用拉到底部就可翻页  
> 5. **调整每页显示数量（风险功能，需在设置面板内设置）**  

> **在饰品详情页：** （[图2](#photo2)）  
> 1. 显示饰品的挂刀比例、steam求购人数、求购的挂刀比例  
> 2. steam过去24小时的销量显示  
> 3. steam求购列表的简单表格，防止丢求购时采坑
> 4. 右侧悬浮栏添加巨大下一页按钮，不用拉到底部就可翻页  
> 5. 每个饰品的预览按钮变大，点击图片即可查看检视图
> 5. 增大饰品的贴纸信息，鼠标放上可以查看大图
> 5. 倒转贴纸显示，与检视时相同（需在设置面板内开启）
> 6. 将饰品的图案模板(seed)、改名、磨损排名(如果有的话)直接显示出来
> 7. 修改支付方式图标与位置，更直观的展示支持的支付方式

> **我还有个设置面板** （[图3](#photo3)） 

## 图1 ↓ <a name="photo1"></a>  
![介绍图1][photo1]
## 图2 ↓ <a name="photo2"></a>  
![介绍图2][photo2] 
## 图3 ↓ 你可以在设置窗口自定义一些参数  <a name="photo3"></a>  
![介绍图3][photo3]

---
<a name="support"></a>
## **故障自查，请找到对应的问题后按顺序排查**
1. **我不是挂刀用的/我是steam卖到buff，这种情况插件怎么用？**
   1. **`我怎么知道？`**
1. **我不会安装/安装不上，报错**
   1. **`点安装旁边的问号`** 
2. **没有安装、页面不是中文**  
   1. 右上角切换中文
2. **插件没有运行**
   1. 不要在首页测试了
   2. 火狐不要使用Greasemonkey，改用Tampermonkey和Violentmonkey都可以
   3. 打开设置页面恢复默认设置
3. **提示我请求次数过多**
   1. 登录网页版steam（账号须可交易）  
   2. 登录账号以后依然提示，说明steam限制你访问了，无解决办法
4. **一直提示bad request**  
   1. 不要选RMB当货币，那是刀币！应该选择CNY！（2.3.9版本已经修复）
4. **提示我无法连接steam/连接steam超时**
   1. 挂加速器，确保**使用插件的浏览器可以正常访问steam市场**之后刷新页面或者点开设置页面检测连接性
   2. 弹出访问授权窗口时请确认域名后选择允许（永久拒绝了就重装）  
   3. 打开设置检测连接性，成功连接的话会给出你的连接时间，如果已经接近20秒（20000ms）的话你应该考虑更换网络环境
5. **我以前\*\*\*用的好好的，更新后就不行了**
   1. 设置里找先
6. **我设置不会用**
   1. 鼠标放到旁边的问号看说明

---  
### 如果上面的教程没有解决你的问题，你可以开反馈贴或者加QQ群：[`544144372`][qqGroup]，进群问上面有的问题一律不回  
### 插件代码托管在[gitee][giteePage]上，欢迎大家一起优化插件，如果你是开发者可以直接发pr，对于普通用户可以加上面的QQ群提交你的优化建议，有很大概率采纳噢！
### 如果你喜欢这个插件或者喜欢我本人  ，可以扫这里打赏↓  
<img src="https://gitee.com/pronax/drawing-bed/raw/master/donate.png"  height="300" width="300">  

## **本插件完全免费**

[commits]:https://gitee.com/pronax/buffMarketHelper/commits/master
[giteePage]:https://gitee.com/pronax/buffMarketHelper
[qqGroup]:https://jq.qq.com/?_wv=1027&amp;k=U8mqorxQ
[photo1]:https://gitee.com/pronax/buffMarketHelper/raw/master/%E4%BB%8B%E7%BB%8D1.png
[photo2]:https://gitee.com/pronax/buffMarketHelper/raw/master/%E4%BB%8B%E7%BB%8D2.png
[photo3]:https://gitee.com/pronax/buffMarketHelper/raw/master/%E4%BB%8B%E7%BB%8D3.png