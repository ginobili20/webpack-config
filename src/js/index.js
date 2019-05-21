import 'babel-polyfill'

import avatar from '../avatar.jpg'
import style from './index.scss'
import {add} from './test'
var img = new Image()
img.src = avatar
img.classList.add(style.avatar) // css-module需要这样写

var root =  document.getElementById('root')

root.appendChild(img)

add(1, 2)