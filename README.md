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

#### 4.两个重要的plugin
html-webpack-plugin <br>

自动创建模板文件index.html 并把打包后的js自动引入
（dist目录下）

```
plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
```

clean-webpack-plugin <br>

重新打包时，自动删除dist目录 然后再打包


注意此插件更新之后配置与以往相比略有不同  具体可以在github上找相应的文档


```new CleanWebpackPlugin()```

#### 5.output
```
output: {
        filename: 'dist.js',
        path: path.resolve(__dirname, 'bundle'),
        publicPath: "http://xxx.com.cn"  // 前缀
    }
```


#### 6.source-map

作用： 帮助我们找到源代码哪里报错，而不是在打包后的代码中报错

常见的几种
```
    devtool: 'cheap-source-map' 精确到行 不管是哪一列 性能好 

    devtool: 'eval-source-map'  速度最快 但不精确

    devtool: 'cheap-module-eval-source-map' 推荐使用！！！ module代表第三方库也检测
```


#### 7.自动打开浏览器，修改代码自动更新

第一种做法 在package.json中添加一条script ```"watch": "webpack --watch"```  缺点是它不会自动打开网页  <br>

第二种做法 推荐！！ devServer <br> 

需要先安装一下 然后修改脚本 ```  "start": "webpack-dev-server"  ```  <br>
 
在配置文件中
```

devServer: {
        contentBase: './dist',
        open: true,
        port: 8080,
        hot: true 
        // hotOnly: true
    },
```

第三种做法  "middleware": "node server.js" <br>

需要自己编写服务器文件   安装koa或者express   ``` $ npm i express webpack-dev-middleware -D ```


#### 8.热模块替换 HMR
简单举个例子解释一下 <br>

假如页面有个点击按钮 点一下 生成一个 item文本 然后给一个样式 背景色为黄色  如果我后续修改了背景色 自动刷新后之前点的item都没了 <br>
我们希望修改样式代码的时候 不要刷新页面 只需要把样式替换就好 <br>

```

 devServer: {
        contentBase: './dist',
        open: true,
        port: 9001,
        hot: true // 开启热模块替换
        hotOnly: true //即使hmr失效 也不刷新页面
    }
    
    
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
```


#### 9.babel
babel处理es6语法 <br>
```
{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }

````

创建一个.babelrc的文件
```

{
  "presets": [
    [
      "@babel/preset-env", {
      "targets": {
        "chrome": "67" // 大于67版本的chrome无需转为es5
      },
      "useBuiltIns": "usage"  // 使用了哪个es6语法就添加相关的补充 而不是所有的都补充
    }
    ]
  ]
}

```


用到的插件
```
    "@babel/core": "^7.4.4",
    "@babel/preset-env": "^7.4.4",
    "babel-loader": "^8.0.6",
    "babel-polyfill": "^6.26.0"
```

#### tips: 
1.babel-polyfill的引入是在index.js（入口文件）里的 会污染全局变量 <br>

2.如果需要兼容async/await语法 还需要安装 ```$ npm i @babel/plugin-transform-runtime @babel/runtime -D ```


#### 10.tree shaking
在webpack中，tree-shaking的作用是可以剔除js中用不上的代码，但是它依赖的是静态的ES6的模块语法 <br>
也就是说没有被引用到的模块它是不会被打包进来的，可以减少我们的包的大小，减少文件的加载时间，提高用户体验。

```
optimization: {
        usedExports: true // tree shaking
    }
```

在package.json里修改sideEffects为一个数组 “*.css” 表示不对css文件做tree shaking（打包的时候忽略掉没有用的代码）
```
  "sideEffects": [
    "*.css"
  ],
```


#### 11.代码分割

js代码分割
```
 optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    }
     
```


css 代码分割 我们修改一下之前配置的css相关loader

```

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

 module: {
        rules:[{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 2
                    }
                },
                'sass-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ]
        }]
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].chunk.css'
        })
    ]


```


#### 12.resolve
extensions   引入的时候会依次查找有没有配置的后缀的文件  如果写了很多 编译起来花费时间变长 所以像jpg这种静态资源就不要写 <br>


路径别名
```
alias: {
        	child: path.resolve(__dirname, './src/child')  // 相对于当前webpack.config文件的路径
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



### 最后附上package.json
啊，我知道有些插件放错了dependencies, 懒得改了。

```

{
  "name": "webpackTest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "sideEffects": [
    "*.css"
  ],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "bundle": "webpack",
    "watch": "webpack --watch",
    "start": "webpack-dev-server",
    "server": "node server.js",
    "dev": "webpack-dev-server --config ./build/webpack.common.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.4.4",
    "@babel/preset-env": "^7.4.4",
    "autoprefixer": "^9.5.1",
    "babel-loader": "^8.0.6",
    "babel-polyfill": "^6.26.0",
    "clean-webpack-plugin": "^2.0.2",
    "css-loader": "^2.1.1",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "node-sass": "^4.12.0",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "webpack-cli": "^3.3.2",
    "webpack-dev-server": "^3.4.1",
    "webpack-merge": "^4.1.5",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "mini-css-extract-plugin": "^0.5.0"
  },
  "dependencies": {
    "url-loader": "^1.1.2",
    "webpack": "^4.31.0"
  }
}

```



### 总结
#### 1.什么是webpack？

weback把项目当做一个整体，通过一个给定的主文件， webpack将从这个主文件找到项目所有的依赖文件，使用loader处理他们，用plugin来扩展功能，最后打包成一个或者多个浏览器可以使用的文件

#### 2.什么是bundle、chunk、module？

bundle是由webpack打包出来的文件

chunk是指webpack进行模块的依赖分析时，代码分割出来的代码块。

module是开发中的单个模块

#### 3.什么是loader 什么是plugin？

loader相当于是某些源文件的转化元件， 以源文件作为参数，返回新的资源函数，并且引入到打包出口文件。

plugin是用来扩展webpack的功能，webpack生命周期中会有很多广播事件， plugin可以监听到这些事件，在合适的时机通过webpack提供的api来改变输出结果、

配置的位置也不同。


#### 4.如何自动生成webpack配置？

webpack-cli /vue-cli等等各种脚手架工具

#### 5.webpack-dev-server

dev-server使用内存来存储webpack开发环境下的打包文件，并且可以使用热模块更新，比传统的http服务器例如nginx对于开发来说更加高效简单

什么是热模块更新呢？

他可以使代码修改过后不用刷新浏览器也可以更新。


#### 6.什么是长缓存，webpack怎么对他进行优化？

浏览器在用户访问页面时候，为了加快加载速度，会对用户访问的静态资源进行缓存，但每次代码更新，都需要浏览器重新去下载代码，最简单的办法就是引入新的文件名。

webpack中可以在output输出文件里指定chunkhash， 并且分离经常更新的代码和框架代码，通过NamedMouldesPlugin使再次打包文件名称不变

#### 7.什么是tree shaking？

指的是在打包过程中去除掉那些没有使用到的代码。


#### 8.webpack和grunt、gulp的区别

grunt和gulp基于任务task和流stream，类似于jquery链式操作，找到一个或一类文件，对他做一系列的链式操作，更新流上的数据，整条链式操作构成一个任务，多个任务构成整个web构建流程。

#### 9.常见的loader 和plugin
file-loader 对于字体文件可以使用，把文件输出到一个文件夹中，通过url引用输出的文件

url-loader 和file-loader差不多 在文件很小的情况 例如某些图片 可以用base64的方法把文件内容注入到代码中

babel-loader 把es6转为es5

css-loader 加载css 支持模块化 压缩 等等

style-loader 把css代码注入到js中， 通过dom操作去加载css


html-webpack-plugin 为html文件中引入的外部资源，可以生成创建html入口文件

mini-css-extract-plugin：分离css文件

clean-webpack-plugin：删除打包文件

happypack：实现多线程加速编译


#### 10.webpack的构建流程
初始化参数： 从配置文件和shell语句中读取合并参数

开始编译： 用初始化参数得到的compiler对象，加载所有的插件，执行run方法开始执行编译

确定入口： 根据配置的entry来找到所有的入口文件

编译模块: 从入口文件出发， 调用loader对模块进行翻译，再找到模块所依赖的模块，再递归的进行本步骤，直到所有入口依赖文件都经过处理。

完成编译： 得到每个模块之间的依赖关系

输出： 根据依赖关，组装成一个个包含多个模块的chunk，再把每个chunk转为一个单独的文件加入输出列表

完成： 确定好输出内容，根据配置的输出路径和文件名，把文件内容写入文件系统



#### 11.编写loader和plugin的思路

loader编写：需要遵循单一原则，每个loader只做一种转义工作，拿到的source源文件，可以通过调用this.callback()将内容返回给webpack。

plugins编写： 监听webpack的生命周期里的某些事件，利用webpack提供的api做一些操作。


#### 12.热模块HMR原理

参考



#### 13.webpack打包优化（提高构建速度）

1.使用DllPlugin和DllReferencePlugin对第三方的一些包进行编译

2.使用happypack实现多进程加速编译

3.使用tree-shaking剔除多余代码


#### 14.怎么配置单页应用？怎么配置多页应用？

参考


#### 15.如何实现按需加载？
vue ui组件库按需加载为例，elementui 本体体积庞大，我们仅仅使用少量几个组建就够了

有个babel-plugin-component插件安装后再babelrc里配置


还有通过import来控制加载时机，当执行到import的时候才会去加载对应的文件 记得要安装babel-polyfill

参考
