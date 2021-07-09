关于接口测试功能开发的记录

# 2021/03/15 
ly 优化/添加 测试API模块样式，添加了基础的请求发送方式。
ly 增加WIKI页右侧栏拖动效果，增加抽屉元素适应拖动的适配。
# 2021/03/16 
ly 添加了X-AUTH-TOKEN，优化了参数发送的问题。
ly 修复了用户退出后停留在接口维护页面但是数据不刷新的问题。
（待解决） 用户认证登录时，进入接口文档，后台未按照用户的应用分组来展示接口文档。
    app/controller/wiki/Api.php groupList()函数中，$this->appInfo['app_id'] === -1 时，未按用户信息进行文档筛选
（待解决） 接口维护页需要在数据库增加创建人字段，同时接口新增时需要存储用户ID。
    需要在接口admin/InterfaceList/add保存新增的字段
    需要在接口admin/InterfaceList/index增加新增的回显字段
（待解决） 在应用接入 -> 应用管理页保存接口访问内容后，如果在接口维护页面删除保存后的接口，进入接口文档会报错（存储的JSON未更新）。
# 2021/03/17
ly 增加了从接口文档返回的功能
ly 增加了代码编辑器
# 2021/03/18
（待解决） 接口维护页无法添加纯文档类型

# 请求参数支持性
## GET 
* NUMBER
* STRING
## POST
* NUMBER
* STRING
* OBJECT （待完成）
* ARRAY （待完成）
* FILE （待完成）

# 待实现功能
* 参数加密
* 签名验证

