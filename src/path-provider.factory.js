define(function () {

    var extensions = {js: '.js', html: '.html'};

    return {
        buildProvider: function _getFormatter(formats) {
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
            var nextArgs = Array.prototype.slice.call(arguments);
            var firstArgs = Array.prototype.slice.call(args);
            firstArgs.push.apply(firstArgs, nextArgs);
            return fn.apply(fn, firstArgs);
        };
    }

});