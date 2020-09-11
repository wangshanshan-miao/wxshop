const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatTimes(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }
  var day = parseInt(time / (60*3600 * 1000))
  time = time % (3600 * 1000 * 60)
  var hour = parseInt(time / (3600*1000))
  time = time % (3600*1000)
  var minute = parseInt(time / (60*1000))
  time = parseInt(time % (60*1000))
  var second = time / 1000

  return ([day, hour, minute]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}
module.exports = {
  formatTime: formatTime,
  formatTimes: formatTimes
}

export {
  formatTime
}
