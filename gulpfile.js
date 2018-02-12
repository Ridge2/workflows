var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect');

var coffeeSources = ['components/coffee/tagline.coffee']
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

var sassSources = ['components/sass/style.scss'];

gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});


gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js')) // Name given to the file to concatenate
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js')) //Destination of file "script.js file that I created above"
        .pipe(connect.reload())
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded'
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload())
});

// Gulp watch waits for changes to files and run them automatically
//
gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
});
// This code connects you to the server and reloads when there are any changes
//
gulp.task('connect', function () {
    connect.server({
        root: 'builds/development/',
        livereload: true
    });
});

// default runs this object by default by just running "gulp" in the command line
//
gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);
