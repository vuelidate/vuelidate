// taken from https://jsperf.com/alphanumeric-charcode-vs-regexp
export default function isNumeric (str) {
  if (!str) {
    return true
  }
  var code

  for (var i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i)
    if (!(code > 47 && code < 58)) { // numeric (0-9)
      return false
    }
  }
  return true
}

