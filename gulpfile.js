var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');

var tsProject = ts.createProject({
    "module": "commonjs",
    "noImplicitAny": false,
    "removeComments": true,
    "preserveConstEnums": true,
    "target": "es5",
    "sourceMap": true ,
    "declaration": true
});


gulp.task('scripts', function() {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest('dist/definitions')),
        tsResult.js.pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task('index', function () {
    var target = gulp.src('./src/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src([
        //'./src/_externals/**/*.js',
        './dist/js/*.js',
        './dist/js/**/*.js'
    ], {read: false});

    return target.pipe(inject(sources, {relative: true}))
        .pipe(gulp.dest('./src'));
});

gulp.task('build', function(cb){
    runSequence(['scripts', 'index'], cb);
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('src/**/*.ts', ['build']);
});