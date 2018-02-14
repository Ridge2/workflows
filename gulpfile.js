// Name: Ridge Francis
// Date: 2017/02/13
//
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect');

var outputDir,
    coffeeSources,
    jsonSources,
    jsSources,
    env,
    sassSources,
    sassStyle,
    htmlSources;

env = process.env.NODE_ENV || 'development';

if (env === 'developement') {
    outputDir = 'builds/developnent/';
    sassStyle = 'expanded';
}
else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
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
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
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
    gulp.src(htmlSources)
        .pipe(connect.reload())

});
// Reload json 
//
gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(connect.reload())
});

// default runs this object by default by just running "gulp" in the command line
//
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
