// 文字超出部分显示...鼠标经过浮层显示全部文字
const mouseover = ($event) => {
  const dom = $event.target
  const style = window.getComputedStyle ? window.getComputedStyle(dom, '') : dom.currentStyle
  const width = dom.clientWidth; const // 容器宽度
    paddingRight = style.paddingRight; const // 右padding
    paddingLeft = style.paddingLeft; const // 左padding
    marginLeft = style.marginLeft; const // 左margin
    marginRight = style.marginRight; const // 左margin
    boxWidth = width - parseInt(paddingRight) - parseInt(paddingLeft) - parseInt(marginLeft) - parseInt(marginRight)
  const text = dom.innerHTML
  const span = document.createElement('span')
  const left = $event.clientX
  const top = $event.clientY
  span.style.cssText = `font-size:16px;height:0;overflow:hidden;`
  span.setAttribute('id', 'span')
  document.body.appendChild(span)
  document.querySelector('#span').innerHTML = text
  const spanWidth = span.offsetWidth
  document.body.removeChild(span)
  if (spanWidth > boxWidth) {
    const bgObj = document.createElement('div')
    bgObj.style.cssText = `position:fixed;top:${top + 5}px;left:${left}px;color:#fff;background:#333;max-width:500px;border-radius:5px;padding:10px;display:inline-block;font-size:16px;z-index:9999`
    bgObj.setAttribute('id', 'bgObj')
    document.body.appendChild(bgObj)
    document.querySelector('#bgObj').innerHTML = text
  }
}
// 鼠标移出浮层消失
const mouseout = ($event) => {
  const bgObj = document.querySelector('#bgObj')
  if (bgObj) {
    document.body.removeChild(bgObj)
  }
}
// 鼠标移动浮层移动
const mousemove = ($event) => {
  const left = $event.clientX
  const top = $event.clientY
  const bgObj = document.querySelector('#bgObj')
  if (bgObj) {
    bgObj.style.top = (top + 10) + 'px'
    bgObj.style.left = left + 'px'
  }
}

export {
  mouseover,
  mouseout,
  mousemove
}
