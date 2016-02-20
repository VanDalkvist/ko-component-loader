define(function () {

  var extensions = {js: '.js', html: '.html'};

  return {
    useFormats: function _useFormats(formats) {
      this.formats = formats;
    },
    getProvider: function _getFormatter() {
      var formats = this.formats;

      return {
        template: _partial(_format, 'text!' + formats.template + extensions.html),
        vm: _partial(_map, formats.vm, extensions.js),
        factory: _partial(_map, formats.factory, extensions.js)
      };
    }
  };

  function _map(str, extension, map) {
    if (map.app && map.app.startsWith('/') && extension) {
      str += extension;
    }
    return _format(str, map);
  }

  function _format(format, map) {
    for (var key in map) {
      if (!map.hasOwnProperty(key)) return;

      format = format.replace(new RegExp('{' + key + '}', 'g'), map[key]);
    }

    return format;
  }

  function _partial(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
      var newArgs = Array.prototype.slice.call(arguments);
      args.push.apply(args, newArgs);
      return fn.apply(fn, args);
    };
  }

});