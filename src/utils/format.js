// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
Date.prototype.Format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export function formatDate(times, pattern) {
  var d = new Date(times).Format('yyyy-MM-dd hh:mm:ss')
  if (pattern) {
    d = new Date(times).Format(pattern)
  }
  return d.toLocaleString()
}

export function formatDiff(startTime, endTime) {
  const Time1 = new Date(startTime)
  let Time2
  if (endTime) {
    Time2 = (new Date(endTime).getTime() - Time1.getTime()) / 1000
  } else {
    Time2 = (new Date().getTime() - Time1.getTime()) / 1000
  }
  const m = 60
  const h = 3600
  const d = 3600 * 24
  const month = 3600 * 24 * 30
  const year = 3600 * 24 * 30 * 12
  if (Time2 >= 0 && Time2 < m) {
    return parseInt(Time2) + '秒'
  } else if (Time2 >= m && Time2 < h) {
    return parseInt(Time2 / m) + '分'
  } else if (Time2 >= h && Time2 < d) {
    if ((Time2 % h) >= m) {
      return parseInt(Time2 / h) + '小时' + parseInt((Time2 % h) / m) + '分'
    } else {
      return parseInt(Time2 / h) + '小时'
    }
  } else if (Time2 >= d && Time2 < month) {
    if ((Time2 % d) >= h) {
      return parseInt(Time2 / d) + '天' + parseInt((Time2 % d) / h) + '小时'
    } else {
      return parseInt(Time2 / d) + '天'
    }
  } else if (Time2 >= month && Time2 < year) {
    if ((Time2 % month) >= d) {
      return parseInt(Time2 / month) + '个月' + parseInt((Time2 % month) / d) + '天'
    } else {
      return parseInt(Time2 / month) + '个月'
    }
  } else if (Time2 >= year) {
    if ((Time2 % year) >= month) {
      return parseInt(Time2 / year) + '年' + parseInt((Time2 % year) / month) + '个月'
    } else {
      return parseInt(Time2 / year) + '年'
    }
  }
}

export function formatMockData(list, mockProps) {
  const mockList = []
  list.map((item, index) => {
    mockList[index] = {}
    for (const key in item) {
      if (mockProps.indexOf(key) >= 0) {
        mockList[index][key] = item[key]
      }
    }
  })
  return mockList
}

export function uniqueArr(arr, type) {
  const newArr = []
  const tArr = []
  if (arr.length === 0) {
    return arr
  } else {
    if (type) {
      for (let i = 0; i < arr.length; i++) {
        if (!tArr[arr[i][type]]) {
          newArr.push(arr[i])
          tArr[arr[i][type]] = true
        }
      }
      return newArr
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (!tArr[arr[i]]) {
          newArr.push(arr[i])
          tArr[arr[i]] = true
        }
      }
      return newArr
    }
  }
}

/**
 * 字节转换
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 B'
  // eslint-disable-next-line no-undef
  if (bytes < 1) return _.ceil(bytes, 2) + ' B'
  const k = 1024
  const dm = decimals || 2
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 限制输入框输入数字
 */
export function onInput(el, ele, binding, vnode) {
  function handle() {
    let val = ele.value
    // modifiers为修饰符对象，传入了float，则其float属性为true
    if (binding.modifiers.float) {
    // 清除"数字"和"."以外的字符
      val = val.replace(/[^\d.]/g, '')
      // 只保留第一个, 清除多余的
      val = val.replace(/\.{2,}/g, '.')
      // 第一个字符如果是.号，则补充前缀0
      val = val.replace(/^\./g, '0.')
    } else {
      val = ele.value.replace(/[^\d]/g, '')
    }
    ele.value = val
  }
  return handle
}
