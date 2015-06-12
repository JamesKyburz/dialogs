var fs = require('fs')
var glue = require('hyperglue')
var insertCss = require('insert-css')
var xtend = require('xtend')

var css = fs.readFileSync(__dirname + '/style.css', 'utf-8')
var html = fs.readFileSync(__dirname + '/index.html', 'utf-8')

module.exports = dialog

function dialog (opt) {
  opt = opt || {}
  var opt = {
    'img': {src: opt.icon || ''},
    '.ok': opt.ok || 'OK',
    '.cancel': opt.cancel || 'Cancel',
    '.url': window.location.hostname
  }

  insertCss(opt.style || css)

  return {
    alert: render.bind(opt, 'alert'),
    confirm: render.bind(opt, 'confirm'),
    prompt: render.bind(opt, 'prompt')
  }
}

function render(type, title, defaultValue, cb) {
  if (typeof defaultValue === 'function') {
    cb = defaultValue
    defaultValue = ''
  }
  var opt = xtend(this)
  opt['.type'] = {'class': 'dialog-widget ' + type}
  opt['.title'] = title
  opt['input'] = {value: defaultValue || ''}
  var background = glue('<div class="dialog-widget background"></div>')
  var el = glue(html, opt)
  document.body.appendChild(background)
  document.body.appendChild(el)

  if (type === 'prompt') {
    el.querySelector('input').focus()
  } else {
    el.querySelector('.ok').focus()
  }

  eventListeners('addEventListener')

  function eventListeners(method) {
    el.querySelector('.ok')[method]('click', ok)
    el.querySelector('.cancel')[method]('click', cancel)
    el.querySelector('form')[method]('submit', ok)
  }

  function cancel() {
    cb()
    cleanup()
  }

  function ok(e) {
    e.preventDefault()
    if (type === 'confirm' || type === 'alert') cb(true)
    if (type === 'prompt') cb(el.querySelector('input').value)
    cleanup()
  }

  function cleanup() {
    eventListeners('removeEventListener')
    document.body.removeChild(el)
    document.body.removeChild(background)
  }
}
