## 本插件完全免费，请勿上当受骗  
|[更新日志][commits]|│|[插件介绍](#intro)|│|[常见问题与解决办法](#support)|
|-|-|-|-|-|
---
## 感谢这些人的帮助与贡献
| | |
--|--
**@lyl001** | `提供信息实现每页数量选择功能`  
[**Gear Browser**][gearApp] | `提供关于正则修改建议`  
[**Bitaminkim**][bitaminkimGitee] | `提供关于steam地区与货币转换的实现`  

---
## 本插件有以下功能 <a name="intro"></a>  

### 在市场列表页： （[**完整图示1**][photo1]）  
- **显示饰品的挂刀比例①、挂刀后的实际可得②、steam求购人数③、求购的挂刀比例**  
- **根据颜色区分比例高低，且颜色可以自定义**  
  ![1-1图示][iconograph1-1]
- **依据饰品的比例/挂刀比例进行从高到低/从低到高排序**  
  ![1-2图示][iconograph1-2]
- **右侧悬浮栏添加巨大下一页按钮，不用拉到底部就可翻页**    
- **右侧悬浮栏添加设置按钮，可以自定义一些属性**  
  ![1-3图示][iconograph1-3]
- **`调整每页显示数量（风险功能，建议修改前查看说明）`**  

### 在饰品详情页： （[**完整图示2**][photo2]）  
- **显示饰品的挂刀比例①、挂刀后的实际可得②、求购人数③、价格④、比例⑤等**  
- **steam过去24小时的销量显示⑥**  
  ![2-1图示][iconograph2-1]
- **steam求购列表的简单表格，防止丢求购时采坑**  
  ![2-2图示][iconograph2-2]
- **每个饰品的预览区域变大，点击图片即可查看检视图**  
  ![2-3图示][iconograph2-3]
- **增大饰品的贴纸信息，鼠标放上可以查看大图**  
  ![2-4图示][iconograph2-4]
- **倒转贴纸显示，与枪上顺序相同（需在设置面板内开启）**
- **将饰品的图案模板(seed)、改名、磨损排名(如果有的话)直接显示出来**  
  ![2-5图示][iconograph2-5]
- **修改支付方式图标与位置，更直观的展示支持的支付方式**  
  ![2-6图示][iconograph2-6]

### 我还有个设置面板 （[**完整图示3**][photo3]） 
- **用来调整参考货币**
- **其他功能的相关设定**

---
## **故障自查，请找到对应的问题后按顺序排查** <a name="support"></a>  
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
   1. 不要选RMB当货币，应该选择CNY。  
      (根据国际标准化组织的ISO 4217标准，人民币的货币代码为CNY)
5. **插件一直在转圈**  
   1. 同上
6. **提示我无法连接steam/连接steam超时**
   1. 挂加速器，确保**使用插件的浏览器可以正常访问steam市场**之后刷新页面或者点开设置页面检测连接性
   2. 弹出访问授权窗口时请确认域名后选择允许（永久拒绝了就重装）  
   3. 打开设置检测连接性，成功连接的话会给出你的连接时间，如果已经接近20秒（20000ms）的话你应该考虑更换网络环境
7. **我以前\*\*\*用的好好的，更新后就不行了**
   1. 设置里找先
8. **我设置不会用**
   1. 鼠标放到旁边的问号看说明

### 上面没有列出或没有解决的问题可以开反馈贴或者加QQ群解决
> #### 1群：[~~`544144372`~~][qqGroup1] **已满**  
> #### 2群：[`794103947`][qqGroup2]  

### QQ群没有如：私人订制插件、付费版/高级版这样的服务，需要这些的朋友可以直接省去加群的步骤
---

### 普通用户有改进建议可以进上面的QQ群私信给管理，对于开发者们，插件代码托管在[gitee][giteePage]上，可以直接发pr。
### 不管你是普通人还是开发者，只要建议被采纳都会加进顶部的感谢名单！  ヽ(￣ω￣(￣ω￣〃)ゝ) 快来一起开发插件吧

### 如果你喜欢这个插件或者喜欢我本人，可以扫这里打赏↓  
<img src="https://gitee.com/pronax/drawing-bed/raw/master/donate.png"  height="300" width="300">  

[bitaminkimGitee]:https://gitee.com/Bitaminkim
[gearApp]:https://gear4.app/
[commits]:https://gitee.com/pronax/buffMarketHelper/commits/master
[giteePage]:https://gitee.com/pronax/buffMarketHelper
[qqGroup1]:https://jq.qq.com/?_wv=1027&k=U8mqorxQ
[qqGroup2]:https://jq.qq.com/?_wv=1027&k=98pr2kNH
[photo1]:https://gitee.com/pronax/buffMarketHelper/raw/master/%E4%BB%8B%E7%BB%8D1.png
[photo2]:https://gitee.com/pronax/buffMarketHelper/raw/master/%E4%BB%8B%E7%BB%8D2.png
[photo3]:https://gitee.com/pronax/buffMarketHelper/raw/master/%E4%BB%8B%E7%BB%8D3.png
[iconograph1-1]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/1-1.png
[iconograph1-2]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/1-2.png
[iconograph1-3]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/1-3.png
[iconograph2-1]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/2-1.png
[iconograph2-2]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/2-2.png
[iconograph2-3]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/2-3.gif
[iconograph2-4]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/2-4.gif
[iconograph2-5]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/2-5.png
[iconograph2-6]:https://gitee.com/pronax/buffMarketHelper/raw/master/iconograph/2-6.png


