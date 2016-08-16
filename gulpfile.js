/*
* @Author: zhangxinliang
* @Date:   2016-07-04 14:13:20
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-08-16 14:46:29
*/

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    del = require('del'),
    babel = require('gulp-babel'),
    browserify = require('browserify'),
	source = require('vinyl-source-stream'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber');

var projects = require('./project.config.js');

projects.forEach(function (item) {
    var pname = item.projectdir,
        port = item.port,
        version = item.version,
        basedir = './app/' + pname,
        browser = browserSync.create(),
        reload = browser.reload;

    //styles-scss to css
    gulp.task(pname + ':styles', function () {
        return gulp.src(basedir + '/src/sass/**/*.scss')
            .pipe(plumber())
            .pipe(sass({ style: 'expanded' }))
            .pipe(autoprefixer('last 4 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(gulp.dest(basedir + '/src/css'));
    });

    //mincss-css to min.css
    gulp.task(pname + ':mincss', function () {
        return gulp.src(basedir + '/src/css/**/*.css')
            .pipe(plumber())
            .pipe(cssnano())
            .pipe(rename(function (path) {
                path.basename += '.min';
            }))
            .pipe(gulp.dest(basedir + '/dist/css'));
    });

    //scripts-es6 to es5
    gulp.task(pname + ':scripts', function () {
        return gulp.src(basedir + '/src/scripts/**/*.js')
            .pipe(plumber())
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(basedir + '/src/js'));
    });
     
    // browserify-js module to bundle.js
    gulp.task(pname + ":browserify", function () {
        var b = browserify({
            entries: basedir + '/src/scripts/app.js'
        });

        return b.bundle()
            .pipe(source("bundle.js"))
            .pipe(gulp.dest(basedir + "/dist/js"));
    });

    //images-images to min img
    gulp.task(pname + ':images', function() {
        return gulp.src(basedir + '/src/images/**/*')
            .pipe(plumber())
            .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
            .pipe(gulp.dest(basedir + '/dist/img'));
    });

    //html-src html to html
    gulp.task(pname + ':html', function () {
        return gulp.src(basedir + '/src/html/**/*.html')
            .pipe(plumber())
            .pipe(gulp.dest(basedir + '/dist/'));
    });

    // clean-delete dist
    gulp.task(pname + ':clean', function(cb) {
        del([basedir + '/dist/'], cb)
    });


    gulp.task(pname + ':dev', [pname + ':styles', pname + ':mincss', pname + ':scripts', pname + ':images', pname + ':browserify', pname + ':html', pname + ':serve']);

    gulp.task(pname + ':js-watch', [pname + ':scripts', pname + ':browserify'], browser.reload);
    gulp.task(pname + ':sass-watch', [pname + ':styles']);
    gulp.task(pname + ':css-watch', [pname + ':mincss'], function () {
        browser.reload();
    });
    gulp.task(pname + ':img-watch', [pname + ':images'], browser.reload);
    gulp.task(pname + ':html-watch', [pname + ':html'], function () {
        browser.reload();
    });

    //serve-start browsersync
    gulp.task(pname + ':serve', [], function () {
        browser.init({
            server: {
                baseDir: basedir + '/dist/'
            },
            port: port
        });

        gulp.watch(basedir + '/src/sass/**/*.scss', [pname + ':sass-watch']);
        gulp.watch(basedir + '/src/css/**/*.css', [pname + ':css-watch']);
        gulp.watch(basedir + '/src/scripts/**/*.js', [pname + ':js-watch']);
        gulp.watch(basedir + '/src/images/**/*', [pname + ':img-watch']);
        gulp.watch(basedir + '/src/html/**/*.html', [pname + ':html-watch']);
    });
});

