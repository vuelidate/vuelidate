// taken from https://jsperf.com/alphanumeric-charcode-vs-regexp
export default function isAlpha (str) {
  if (!str) {
    return true
  }
  var code

  for (var i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i)
    if (!(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false
    }
  }
  return true
}

