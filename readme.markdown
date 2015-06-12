# dialogs

non blocking `confirm`, `alert` and `prompt` dialogs.

Theses native counterparts block the UI thread, are are not allowed in electron and some chrome extention contexts.

Try it out! [![view on requirebin](http://requirebin.com/badge.png)](http://requirebin.com/?gist=5b6d6b63f8709deb3b5a)

use with [browserify](http://browserify.org):

# main
``` js
var dialogs = require('dialogs')
```

## var d = dialogs(opts={})

`ok` default OK

`cancel` default Cancel

`icon` optional url for icon

# example

``` js
dialogs.alert('okidoki', function(ok) {
  console.log('alert', ok)
  dialogs.confirm('ok?', function(ok) {
    console.log('confirm', ok)
    dialogs.prompt('username', 'joe.smith@gmail.com', function(ok) {
      console.log('prompt with default', ok)
      dialogs.prompt('username', function(ok) {
        console.log('prompt', ok)
      })
    })
  })
})
```

The signature of `alert`, `confirm` and `prompt` are the same as the native ones with an extra callback argument.

# install

With [npm](https://npmjs.org) do:

```
npm install dialogs
```

# license

MIT
