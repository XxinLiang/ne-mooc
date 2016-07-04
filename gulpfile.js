/*
* @Author: zhangxinliang
* @Date:   2016-07-04 14:13:20
* @Last Modified by:   zhangxinliang
* @Last Modified time: 2016-07-04 19:33:20
*/

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    del = require('del'),
    babel = require('gulp-babel'),
    browserify = require('browserify'),
	source = require('vinyl-source-stream'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

gulp.task('styles', function () {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass({ style: 'expanded' }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('src/css'))
		.pipe(cssnano())
    	.pipe(rename(function (path) {
    		path.basename += '.min';
    	}))
    	.pipe(gulp.dest('dist/css'));
});

//es6 to es5
gulp.task('scripts', function () {
	return gulp.src('src/scripts/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'));
});
 
// browserify
gulp.task("browserify", function () {
    var b = browserify({
        entries: "src/app.js"
    });

    return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task('images', function() {
  	return gulp.src('src/images/**/*')
    	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    	.pipe(gulp.dest('src/img'))
    	.pipe(gulp.dest('dist/img'));
});

gulp.task('html', function () {
	return gulp.src('src/html/**/*.html')
		.pipe(gulp.dest('dist/'));
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});
 
// 监视文件变化，自动执行任务
// gulp.task('watch', function(){
//   	gulp.watch('src/sass/**/*.scss', ['styles']);
//   	gulp.watch('src/scripts/**/*.js', ['scripts', 'browserify']);
//  	gulp.watch('src/images/**/*', ['images']);
//   	gulp.watch('src/html/**/*.html', ['html']);
// });

gulp.task('start', ['styles', 'scripts', 'images', 'browserify', 'html', 'serve']);

gulp.task('watch', ['styles', 'scripts', 'browserify', 'images', 'html'], browserSync.reload);

gulp.task('js-watch', ['scripts', 'browserify'], browserSync.reload);
gulp.task('css-watch', ['styles'], browserSync.reload);
gulp.task('img-watch', ['images'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);

// 使用默认任务启动Browsersync，监听JS文件
gulp.task('serve', [], function () {

    // 从这个项目的根目录启动服务器
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 8080
    });

    gulp.watch('src/sass/**/*.scss', ['css-watch']);
    gulp.watch('src/scripts/**/*.js', ['js-watch']);
    gulp.watch('src/images/**/*', ['img-watch']);
    gulp.watch('src/html/**/*.html', ['html-watch']);
});