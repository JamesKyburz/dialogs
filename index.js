var fs = require('fs')
var glue = require('hyperglue')
var insertCss = require('insert-css')
var xtend = require('xtend')
var path = require('path')

var css = fs.readFileSync(path.join(__dirname, '/style.css'), 'utf-8')
var html = fs.readFileSync(path.join(__dirname, '/index.html'), 'utf-8')

module.exports = dialog

function dialog (opt) {
  opt = opt || {}
  opt = {
    'img': {src: opt.icon || ''},
    '.ok': opt.ok || 'OK',
    '.cancel': opt.cancel || 'Cancel',
    '.url': opt.hostname || window.location.hostname
  }

  insertCss(opt.style || css)

  return {
    alert: render.bind(opt, 'alert'),
    confirm: render.bind(opt, 'confirm'),
    prompt: render.bind(opt, 'prompt'),
    cancel: cancelOpenDialog
  }
}

function render (type, title, defaultValue, cb) {
  if (typeof title === 'function') {
    cb = title
    defaultValue = ''
    title = ''
  } else if (typeof defaultValue === 'function') {
    cb = defaultValue
    defaultValue = ''
  }

  if (type === 'alert') cb = cb || function noop () {}
  if (!cb) throw new Error(type + ' needs a callback')

  var opt = xtend(this)
  opt['.type'] = {'class': 'dialog-widget ' + type}
  opt['.title'] = title
  opt['input'] = {value: defaultValue || ''}
  var background = glue('<div class="dialog-widget background"></div>')
  var el = glue(html, opt)
  el.setAttribute('data-icon', !!opt.img)
  cancelOpenDialog.fn = cancel
  document.body.appendChild(background)
  document.body.appendChild(el)

  if (type === 'prompt') {
    var input = el.querySelector('input')
    input.focus()
    if (defaultValue) input.setSelectionRange(0, defaultValue.length)
  } else {
    el.querySelector('.ok').focus()
  }

  eventListeners('addEventListener')

  function eventListeners (method) {
    el.querySelector('.ok')[method]('click', ok)
    el.querySelector('.cancel')[method]('click', cancel)
    el.querySelector('form')[method]('submit', ok)
    window[method]('keydown', keydown)
  }

  function cancel () {
    cb()
    cleanup()
  }

  function keydown (e) {
    if (e.keyCode === 27) cancelOpenDialog()
  }

  function ok (e) {
    e.preventDefault()
    if (type === 'confirm' || type === 'alert') cb(true)
    if (type === 'prompt') cb(el.querySelector('input').value)
    cleanup()
  }

  function cleanup () {
    eventListeners('removeEventListener')
    document.body.removeChild(el)
    document.body.removeChild(background)
    delete cancelOpenDialog.fn
  }
}

function cancelOpenDialog () {
  if (cancelOpenDialog.fn) cancelOpenDialog.fn()
}
