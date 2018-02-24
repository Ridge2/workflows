// Name: Ridge Francis
// Date: 2017/02/13
//
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    gulpif = require('gulp-if'),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    beautify = require('gulp-beautify'),
    connect = require('gulp-connect');
    minifyHtml= require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify');
    

var outputDir,
    coffeeSources,
    jsonSources,
    jsSources,
    env,
    sassSources,
    sassStyle,
    condition,
    htmlSources;

env = process.env.NODE_ENV || 'development';

if (env === 'developement') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
    condition = false;
}
else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
    condition = true;
}

coffeeSources = ['components/coffee/tagline.coffee']
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
// Variables for files
//
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/data.json'];
gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});
// compress the javascript sources
//
gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js')) // Name given to the file to concatenate
        .pipe(browserify()) // js code uses browserify  
        .pipe(gulpif(condition, uglify(), beautify()))
        .pipe(rename('script.js'))
        .pipe(gulp.dest(outputDir + 'js')) //Destination of file "script.js" file that I created above
        .pipe(connect.reload())
});
// use compass on the image files
//
gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});
// Gulp watch waits for changes to files and reload them automatically
//
gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*html', ['html']);
    gulp.watch('builds/production/js/*.json', ['json']);
});
// This code connects you to the server and reloads when there are any changes
//
gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});
// Reload html
//
gulp.task('html', function () {
    gulp.src('builds/development/*html')
    .pipe(gulpif(env === 'production', minifyHtml()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});
// Reload json 
//
gulp.task('json', function () {
    gulp.src('builds/production/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
        .pipe(connect.reload())
});

// default runs this object by default by just running "gulp" in the command line
//
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
