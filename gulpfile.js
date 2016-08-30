/*
* @Author: zhangxinliang
* @Date:   2016-07-04 14:13:20
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-08-30 15:29:34
*/

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    minify = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    del = require('del'),
    rollup = require('rollup').rollup,
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
	source = require('vinyl-source-stream'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    spriter = require('gulp-css-spriter'),
    through = require('through2')

var projects = require('./project.config.js');

projects.forEach(function (item) {
    var pname = item.projectdir,
        port = item.port,
        version = item.version,
        basedir = 'app/' + pname,
        browser = browserSync.create(),
        reload = browser.reload;

    //styles-scss to css
    gulp.task(pname + ':styles', function () {
        return gulp.src(basedir + '/src/sass/*.scss')
            .pipe(sass({ style: 'expanded' }))
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(autoprefixer('last 4 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(gulp.dest(basedir + '/src/css'));
    });

    //mincss-css to min.css
    gulp.task(pname + ':mincss', function () {
        return gulp.src(basedir + '/src/css/**/*.css')
            .pipe(cssnano())
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(gulp.dest(basedir + '/dist/css'));
    });

    //scripts-es6 to es5
    gulp.task(pname + ':babel', function () {
        return gulp.src(basedir + '/src/js/bundle.js')
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(uglify())
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(gulp.dest(basedir + '/dist/js/'));
    });

    gulp.task(pname + ':rollup', function () {
        return rollup({
            entry: basedir + '/src/scripts/app.js',
            plugins: [
                babel({
                    exclude: 'node_modules/**',
                    presets: [
                        [
                            'es2016',
                            {
                                'modules': false
                            }
                        ]
                    ],
                }),
            ]
        }).then(function(bundle) {
            bundle.write({
                format: 'es6',
                globals: {
                    moment: 'moment'
                },
                dest: basedir + "/src/js/bundle.js"
            });
        }).catch(function (err) {
            console.log(err);
        });
    });

    //images-images to min img
    gulp.task(pname + ':images', function() {
        return gulp.src(basedir + '/src/images/**/*')
            .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(gulp.dest(basedir + '/dist/img'));
    });

    //html-src html to html
    gulp.task(pname + ':html', function () {
        return gulp.src(basedir + '/src/html/**/*.html')
            .pipe(gulp.dest(basedir + '/dist/'));
    });

    // clean-delete dist
    gulp.task(pname + ':clean', function(cb) {
        del([basedir + '/dist/'], cb)
    });

    var cssfiles = []
    gulp.task(pname + ':filenames', function () {
        return gulp.src(basedir + '/dist/css/**/*.css')
            .pipe(through.obj(function(file,enc,cb){
                cssfiles.push(file.relative);
                cb();
            }))
    })

    function spriterGroup (pathArr) {
        cssfiles.forEach(function (item) {
            var name = item.replace('.css', '');
            gulp.src(basedir + '/dist/css/' + item)
                .pipe(spriter({
                    'spriteSheet': basedir + '/dist/img/spriteSheet_' + name + '.png',
                    'pathToSpriteSheetFromCSS': '../img/spriteSheet_' + name + '.png'
                }))
                .pipe(minify())
                .pipe(gulp.dest(basedir + '/dist/css/'))

        })
    }

    gulp.task(pname + ':spirter', [pname + ':filenames'],function(){
        spriterGroup(cssfiles);
    })

    gulp.task(pname + ':dev', [pname + ':styles', pname + ':mincss', pname + ':rollup', pname + ':babel', pname + ':images', pname + ':html', pname + ':serve']);

    gulp.task(pname + ':js-watch', [pname + ':rollup', pname + ':babel'], function () {
        browser.reload();
    });
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
