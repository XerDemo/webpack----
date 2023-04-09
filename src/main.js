import { foo } from 'utils/foo'
import '@/abc'
import './css/style.css'
import axios from 'axios'
import react from 'react'
import cat from '@/img/cat'
import map from '@/img/map'

// import { bar } from './utils/bar'

// index.js作为入口
const message = "Hello Main"
console.log(message)

function bar() {
  console.log('bar function exec~')
}
bar()

// 使用axios
axios.get('http://123.207.32.32:8000/home/multidata').then(res => {
  console.log(res)
})

const btn1 = document.createElement('button')
const btn2 = document.createElement('button')
btn1.textContent = '关于'
btn2.textContent = '分类'
document.body.append(btn1)
document.body.append(btn2)

btn1.onclick = function() {
  import(
    /* webpackChunkName: "about" */
    /* webpackPrefetch: true */
    './router/about').then(res => {
    res.about()
    res.default()
  })
}

btn2.onclick = function() {
  import(
    /* webpackChunkName: "category" */
    /* webpackPrefetch: true */
    './router/category')
}

foo()

// 创建img
const img1 = document.createElement('img');
img1.src = cat;
document.body.append(img1); 

// 创建img
const img2 = document.createElement('img');
img2.src = map;
document.body.append(img2); 



