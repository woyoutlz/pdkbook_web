// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var jshint = require('gulp-jshint');
// var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var webserver = require('gulp-webserver');
var less = require('gulp-less');
//web server
gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      host:"0.0.0.0",
      livereload: true,
      directoryListing: true
      // open: true,
       // fallback: 'index.html'
    }));
});
// 检查脚本
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
var buildType = "dev"
var defaultType= "default_"+buildType// 
// 编译Sass
// gulp.task('sass', function() {
//     gulp.src('./scss/*.scss')
//         .pipe(sass())
//         .pipe(gulp.dest('./css'));
// });
//编译less
gulp.task('build-less', function(){
  gulp.src('./views/chajian/less/*')
    .pipe(less())
    .pipe(gulp.dest('./views/chajian/css/'))
});

// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});
//将项目js文件放到相应位置
gulp.task('buildjs',function(){

  gulp.src('./js/*')
      .pipe(gulp.dest('./app/js/'));
  gulp.src('./js/*/*')
      .pipe(gulp.dest('./app/js/'))
});
// 将bower的库文件对应到指定位置
var libjsUrl = 'build/lib/js/';
gulp.task('buildlib',function(){

  gulp.src('./bower_components/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('./app/'+libjsUrl))
});
// 将html主文件生成合适的版本并放到合适的地方
var buildhtmlType = 'buildhtml_'+buildType;
gulp.task('buildhtml', [buildhtmlType]);
gulp.task('buildhtml_dev',function(){

   
  gulp.src('index.html')
    .pipe(htmlreplace({
        'css': ['styles.min.css','hehe.css'],
        'js': [libjsUrl+'jquery.min.js']
    }))
      .pipe(gulp.dest('./app/'))
});

// 默认任务
gulp.task('default_dev', function(){
    gulp.run('lint','webserver','build-less');

    // 监听文件变化
    gulp.watch('./views/chajian/less/*.less', function(){
        gulp.run('lint','build-less');
    });
});
gulp.task('default', [defaultType]);