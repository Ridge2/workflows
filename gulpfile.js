var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    mustache = require('mustache');

var coffeeSources = ['components/coffee/tagline.coffee']
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
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
        .pipe(gulp.dest('builds/development/js')); //Destination of file "script.js file that I created above"
});
