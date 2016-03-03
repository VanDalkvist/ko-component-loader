// dependencies

var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
var _ = require('lodash');
var fs = require('fs');

// preparation

var paths = {
    config: './tools/build.config.json',
    src: './src/**/*.js',
    dist: 'dist',
    outFileName: 'component-loader.js',
    outMinFileName: 'component-loader.min.js'
};

// gulp tasks

gulp.task('default', ['build']);

gulp.task('build', function () {
    return _build({
        optimize: 'none',
        out: paths.outFileName
    });
});

gulp.task('minify', function () {
    return _build({
        out: paths.outMinFileName
    });
});

function _build(options) {
    var content = fs.readFileSync(paths.config);
    var config = JSON.parse(content);

    options = _.extend(config, options);

    return gulp.src(paths.src)
        .pipe(requirejsOptimize(options))
        .pipe(gulp.dest(paths.dist));
}

/*
 // todo: add wrappings for not-amd.
 "wrap": {
 "startFile": "wrap.start",
 "endFile": "wrap.end"
 }
 */