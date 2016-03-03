// dependencies

var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
var fs = require('fs');

// preparation

var paths = {
    buildConfig: './build/build.config.json',
    minifyConfig: './build/minify.config.json',
    src: './src/**/*.js',
    dist: './dist'
};

// gulp tasks

gulp.task('default', ['build']);

gulp.task('build', function () {
    return _build(paths.buildConfig);
});

gulp.task('minify', function () {
    return _build(paths.minifyConfig);
});

function _build(configPath) {
    var content = fs.readFileSync(configPath);
    var config = JSON.parse(content);

    return gulp.src(paths.src)
        .pipe(requirejsOptimize(config))
        .pipe(gulp.dest(paths.dist));
}

/*
 // todo: add wrappings for not-amd.
 "wrap": {
     "startFile": "wrap.start",
     "endFile": "wrap.end"
 }
 */