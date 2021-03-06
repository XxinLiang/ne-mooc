# ne-mooc

这是一个我用来写网易云课堂前端微专业各种demo和作业的仓库。使用gulp搭建了一个简单的自动化工作流，使用了下一代的打包工具rollup，目前包含编译sass与es6、css压缩、js压缩合并、浏览器自动刷新等功能。

## 目录

+ 1.[安装](#install)
+ 2.[项目目录规范](#directory)
+ 3.[如何使用](#howtouse)
+ 4.[我的源码](#mycode)

<a name="install"></a>
## 1. 安装

安装nodejs，并设置NODE_PATH环境变量，指向全局安装目录C:\Users\admin\AppData\Roaming\npm\node_modules
由于npm安装源太慢，建议换成淘宝cnpm安装源

下载或克隆此仓库，```cd```至文件下


```
cnpm install
```

<a name="directory"></a>
## 2.项目目录规范

    |—— mode_modules   npm安装的模块
    |—— lib   其它库框架
    |—— app   静态资源
    |   |—— demo	项目名
    |   |	|—— src   开发目录
    |   |	|	|—— scripts	js源代码
    |   |	|	|	|—— app.js	启动入口文件
    |   |   |   |   |—— components   公共组件目录
    |   |	|	|	|—— views   组件视图目录
    |   |	|	|—— css	编译后的样式，也可直接在此目录下写css
    |   |	|	|—— sass    sass源代码
    |   |   |   |—— images  未压缩原图片
    |   |	|	|—— js 打包后的js
    |   |	|—— dist    发布目录
    |   |	|	|—— css	压缩后的样式
    |   |   |   |—— img 压缩后的图片
    |   |	|	|—— js	js目录
    |   |   |   |   |—— bundle.js 压缩并编译后的js

<a name="howtouse"></a>
## 如何使用

* 配置 project.config.js

```
/**
 * projectdir:静态目录名称(项目名称)
 * port:项目启动端口号
 * version:版本号
 */
```

* 任务启动命令(gulp 静态目录名:任务名)

```
gulp demo:styles // 编译sass
gulp demo:mincss // 压缩css
gulp demo:images // 压缩图片
gulp demo:rollup // 打包JS
gulp demo:babel // 编译并压缩JS
gulp demo:html // 发布html

gulp demo:dev // 开启开发环境

gulp demo:clean // 清除发布目录

gulp demo:spirter // 自动生成雪碧图
```
* 注意事项

    考虑到sass文件夹下可能会出现模块、公共目录，因此只会对```src/sass/```一级目录下的文件编译

    推荐在每次使用```project:spirter```命令前先使用```project:clean```命令清除```dist```目录，且只推荐在发布时使用```project:spirter```命令自动生成雪碧图

<a name="mycode"></a>
## 我的源码

+ 大作业源码
    - [x] [网易教育产品部首页](http://xxthink.com/ne-mooc/app/edu/dist/index.html)
        * [x] [异步请求模块-http.js](https://github.com/XxinLiang/ne-mooc/blob/master/app/edu/src/scripts/module/http.js)
        * [x] [模版渲染模块-render.js](https://github.com/XxinLiang/ne-mooc/blob/master/app/edu/src/scripts/module/render.js)
        * [x] [分页模块-page.js](https://github.com/XxinLiang/ne-mooc/blob/master/app/edu/src/scripts/module/page.js)
        * [x] [Promise模块-promise.js](https://github.com/XxinLiang/ne-mooc/blob/master/app/edu/src/scripts/module/promise.js)
+ 练习源码
    - html
        * [x] [畅销图书列表](http://xxthink.com/ne-mooc/app/html/dist/ul.html)
        * [x] [邮寄信息表格](http://xxthink.com/ne-mooc/app/html/dist/table.html)
        * [x] [个人信息表单](http://xxthink.com/ne-mooc/app/html/dist/form.html)
        * [x] [弹窗样式](http://xxthink.com/ne-mooc/app/html/dist/layer.html)
        * [x] [侧边自适应布局](http://xxthink.com/ne-mooc/app/html/dist/aside.html)
        * [x] [纯CSStab实现](http://xxthink.com/ne-mooc/app/html/dist/tab.html)
    - css
        * [x] [float布局](http://xxthink.com/ne-mooc/app/html/dist/float.html)
        * [x] [新闻标题](http://xxthink.com/ne-mooc/app/html/dist/news.html)
        * [x] [轮播布局](http://xxthink.com/ne-mooc/app/html/dist/slide.html)
        * [x] [考试-新闻](http://xxthink.com/ne-mooc/app/html/dist/index.html)
        * [x] [考试-登录](http://xxthink.com/ne-mooc/app/html/dist/login.html)
        * [x] [考试-表格](http://xxthink.com/ne-mooc/app/html/dist/photos.html)
        * [x] [考试-下拉列表](http://xxthink.com/ne-mooc/app/html/dist/select.html)
    - js
        * [x] [封装基础函数](https://github.com/XxinLiang/ne-mooc/blob/master/app/html/src/js/js-base.js)
    - dom
        * [x] [考试-日期级联](http://xxthink.com/ne-mooc/app/html/dist/date.html)
