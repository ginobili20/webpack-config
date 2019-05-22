# webpack-config
自己配置webpack <br>
注意该仓库分为master（webpack.confg.js）、d（webpack.common.js、webpack.dev.js、webpack.prod.js）两个分支 <br>

### 后续目标
学习webpack的打包性能优化



### 补充一些git指令
git add -A  提交所有变化 <br>
git add -u  提交被修改(modified)和被删除(deleted)文件，不包括新文件(new)<br>
git add .  提交新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件<br>
查看webpack版本 npx webpack -v  （在node_moduels中找webpack）<br>
如何查看有哪些版本 npm info webpack <br>
单独打包某个文件 npx webpack xx.js <br>


### 什么是webpack？
简单来说是打包工具

### 学到了什么？
#### 1.使用webpack打包文件
第一种方法：在命令行使用 npx webpack xx.js 这种方法必须全局安装了webpack才有 <br>
第二种方法 
在package.json文件里
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "bundle": "webpack"  // 直接在命令行里 npm run bundle就可以打包啦
  }
```
使用 npm run bundle


#### 2.打包图片的配置
```
          {
            test: /\.(jpg|png|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images/',
                    limit: 10240 // 超过10240大小的图片会被打包单独放到images文件夹下 而不是和js打包到一起
                }
              }
```
file-loader 和 url-loader 的区别在于  url-loader是将图片转为base64编码，适用于图片比较小的场合。



#### 3.样式相关的配置
```
{
            test: /\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,  // 开启css-module
                        importLoaders: 2,

                    }
                },
                'sass-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader'
            ]
        }

```
loader执行顺序从右往左 从下往上 <br>

css-loader的作用是分析几个css文件之间的关联，然后将他们打包成一段css <br>
style-loader作用是在模板文件的head标签里添加style标签 <br>
postcss-loader的功能取决于你安装了哪些插件，例如安装了autoprefixer，那么它将会自动帮我们加上浏览器前缀 <br>
在postcss.config.js中
```
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```




### 遇到的问题
#### 1.npm不支持新版的node的问题
npm uninstall -g npm  再去官网找到对应的版本安装
#### 2.node-sass安装失败
试过使用cnpm，但是依然无法正常安装。google了一下，找到了满意的解决方案。<br>

解决办法： <br>
主要是windows平台缺少编译环境 <br>
1、先运行： ```npm install -g node-gyp``` <br>

2、然后运行：运行 ```npm install --global --production windows-build-tools``` 可以自动安装跨平台的编译器：<br>

 一执行  ```npm install node-sass --save-dev``` <br>

  在此之前一定要删除之前安装失败的包 ```npm uninstall node-sas``` <br>

#### 3.css-module不生效
我们前面已经在css-loader中配置了modules：true，但这个是不够的。<br>
解决办法： <br>
模板文件index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div id="root">

</div>
</body>
</html>
```
scss文件 index.scss
```
body {
  .avatar {
    width: 100px;
    height:100px;
    transform: translate(100px, 100px);
    border: 1px solid red;
  }
}

```



然后是index.js文件
```
import avatar from '../avatar.jpg'
import style from './index.scss'

var img = new Image()
img.src = avatar
img.classList.add(style.avatar) // css-module需要这样写  style是我们引入的index.scss

var root =  document.getElementById('root')

root.appendChild(img)

```
