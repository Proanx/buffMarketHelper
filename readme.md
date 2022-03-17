<h1 style="background-color:#f00;color:#11ff00">插件是免费的，用来省钱的，想用来赚钱的<b style="color:#e9ff1f">韭菜</b>们可以继续开花</h1>
<h2><i style="color:#9a00ff">注：buff与steam均有反爬机制，请节制使用</i></h2>
# [更新日志][githubCommits]|[插件介绍](#intro)|[常见问题与解决办法](#support)

---
## 感谢这些人的帮助与贡献
|                                           |                                    |
| ----------------------------------------- | ---------------------------------- |
| **@lyl001**                               | `提供信息帮助实现每页数量选择功能` |
| [**Gear Browser**][contributors-gearApp]  | `提供正则修改建议`                 |
| [**Bitaminkim**][contributors-bitaminkim] | `提供steam地区与货币转换的实现`    |
| **Kylin**                                 | `建议比例列加入求购比例`           |
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
   1. <b style="color:blue">我怎么知道？</b>
2. **我不会安装/安装不上，报错**
   1. <b style="color:green">点安装旁边的问号</b>
3. **没有安装、页面不是中文**  
   1. 右上角切换中文
4. **插件没有运行**
   1. 不要在首页测试了
   2. 也不要在热门关注里测试
   3. 火狐不要使用Greasemonkey，改用Tampermonkey和Violentmonkey都可以
5. **提示我请求次数过多**
   1. 拿<b style="color:red">使用插件的浏览器</b>登录网页版steam（账号须可交易）  
   2. 加速器换个节点（IP）
   3. 依然提示说明steam限制你访问了，休息一下吧
6. **弹出Not a valid integer value**
   1. 打开右边设置，每页显示数量中填入1~80之间的整数（正常是20）。
7. **一直提示bad request**  
   1. 不要选RMB当货币，应该选择CNY。  
      (根据国际标准化组织的ISO 4217标准，人民币的货币代码为CNY)
8. **插件一直在转圈**  
   1. 同上
   2. 升级浏览器
9.  **提示我无法连接steam/连接steam超时**
   3. 挂加速器、梯子，确保<b style="color:red">使用插件的浏览器</b>可以正常访问[steam市场][steamMarket]之后刷新页面或者点开设置页面检测连接性
   4. 弹出访问授权窗口时请确认域名后选择允许（永久拒绝了就重装）  
   5. 打开设置检测连接性，成功连接的话会给出你的连接时间，如果已经接近20秒（20000ms）的话你应该考虑更换网络环境
10. **我以前\*\*\*用的好好的，更新后就不行了**
   6. 设置里找
11. **我设置不会用**
   7. 鼠标放到旁边的问号看说明  

<h3><mark>大招：更新到最新版本</mark></h2>
<h3><mark>大招2：打开设置页面点恢复默认设置</mark></h2>

### 还有问题可以开[反馈贴][postFeedback]、加[QQ群][qqGroup2]或者发邮件[funkyturkey@yeah.net][emailMe]反馈
> #### 1群：[~~`544144372`~~][qqGroup1] **已满**  
> #### 2群：[~~`794103947`~~][qqGroup2] **已满**
> #### 3群：[`609546167`][qqGroup3]  
**需要私人订制插件、付费版/高级版的朋友赶紧给我爬😅😅😅**

---

### 普通用户有改进建议可以进上面的QQ群私信给管理，插件代码托管在[![GitHub](https://img.shields.io/github/forks/Proanx/buffMarketHelper?style=social)][githubPage]。也有副本在[![Gitee](https://gitee.com/pronax/buffMarketHelper/badge/fork.svg?theme=dark)][giteePage]，不过是**手动同步，可能会慢几个commit**，开发者们可以直接发pr。
### 不管你是普通人还是开发者，只要建议被采纳都会加进顶部的感谢名单！  ヽ(￣ω￣(￣ω￣〃)ゝ) 快来一起开发插件吧

### 如果你喜欢这个插件或者喜欢我本人，可以扫这里打赏↓  
<img src="https://gitee.com/pronax/drawing-bed/raw/master/donate.png"  height="300" width="300">  

<!-- Contributors -->
[contributors-bitaminkim]:https://keylol.com/forum.php?mod=viewthread&tid=731319
[contributors-gearApp]:https://gear4.app/
<!-- Link -->
[steamMarket]:https://steamcommunity.com/market/
[postFeedback]:https://greasyfork.org/zh-CN/scripts/410137/feedback#post-discussion
[emailMe]:mailto:funkyturkey@yeah.net?subject=%E8%BF%99%E9%87%8C%E6%9C%89%E4%B8%80%E4%B8%AAbug%E5%8F%8D%E9%A6%88/%E4%BF%AE%E6%94%B9%E5%BB%BA%E8%AE%AE
[giteePage]:https://gitee.com/pronax/buffMarketHelper
[giteeCommits]:https://gitee.com/pronax/buffMarketHelper/commits/master
[githubPage]:https://github.com/Proanx/buffMarketHelper
[githubCommits]:https://github.com/Proanx/buffMarketHelper/commits/master
[qqGroup1]:https://jq.qq.com/?_wv=1027&k=U8mqorxQ
[qqGroup2]:https://jq.qq.com/?_wv=1027&k=98pr2kNH
[qqGroup3]:https://jq.qq.com/?_wv=1027&k=F0sj0vKs
<!-- Image -->
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