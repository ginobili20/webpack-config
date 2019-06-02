# webpack-config
自己配置webpack

### 性能优化
1.使用最新版本的node npm等等 <br>

2.尽可能少的使用loader<br>

3.确保plugins的性能，尽可能少的使用，使用官方推荐的插件<br>

4.resolve配置项的优化 配置extensions 只有引用js这种逻辑性文件的时候配置 不要把静态的jpg后缀这样的也配置进去<br>

5.使用dllPlugin 对于第三方模块 我们只希望只打包一次<br>

6.控制包的大小<br>

### package.json

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
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build:dll": "webpack --config ./build/webpack.dll.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.4.4",
    "@babel/preset-env": "^7.4.4",
    "add-asset-html-webpack-plugin": "^3.1.3",
    "autoprefixer": "^9.5.1",
    "babel-loader": "^8.0.6",
    "babel-polyfill": "^6.26.0",
    "clean-webpack-plugin": "^2.0.2",
    "css-loader": "^2.1.1",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "jquery": "^3.4.1",
    "loadsh": "0.0.4",
    "mini-css-extract-plugin": "^0.5.0",
    "node-sass": "^4.12.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "webpack-cli": "^3.3.2",
    "webpack-dev-server": "^3.4.1",
    "webpack-merge": "^4.1.5"
  },
  "dependencies": {
    "url-loader": "^1.1.2",
    "webpack": "^4.31.0"
  }
}


```
