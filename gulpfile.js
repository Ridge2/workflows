var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee']
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js',
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
        .pipe(gulp.dest('builds/development/js')); //Destination of file "script.js file that I created above"
});
