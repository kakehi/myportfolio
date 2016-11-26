// //////////////////////////////////////
// Required
// //////////////////////////////////////

var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    compass = require('gulp-compass'),
    jade = require('gulp-jade'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    os = require('os'),
    gulp = require('gulp'),
    open = require('gulp-open');

// //////////////////////////////////////
// Scripts Task
// //////////////////////////////////////
gulp.task('scripts', function(){
    gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
    .pipe(plumber())
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

// //////////////////////////////////////
// Compass / Sass Tasks
// //////////////////////////////////////
/*gulp.task('style', function(){
    gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(compass({
            config_file: './../config.rb',
            css: 'css',
            sass: 'scss',
            require: ['susy']
        }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('public/css/'))
        .pipe(reload({stream:true}));
});*/

// //////////////////////////////////////
// Style
// //////////////////////////////////////
gulp.task('style', function(){
    gulp.src('src/css/**/*.css')
        .pipe(plumber())
        .pipe(gulp.dest('public/css/'))
        .pipe(reload({stream:true}));
});
gulp.task('sass', function(){
    gulp.src('src/sass/**/*.sass')
        .pipe(sass())
        .pipe(plumber())
        .pipe(rename({suffix:'.min'}))
        //.pipe(cleanCSS())
        .pipe(gulp.dest('public/css/'))
        .pipe(reload({stream:true}));
});


// //////////////////////////////////////
// JADE Tasks
// //////////////////////////////////////
gulp.task('jade', function(){
    gulp.src('src/jade/**/*.jade')
        .pipe(plumber())
        .pipe(jade())
        .pipe(rename(function(path) {
            var filename = path.basename;
            path.basename = filename;
            path.extname = '.html';
            return path;
        }))
        .pipe(gulp.dest('public'))
        .pipe(reload({stream:true}));
});

// //////////////////////////////////////
// HTML Tasks
// //////////////////////////////////////
gulp.task('html', function(){
    gulp.src('**/*.html')
    .pipe(reload({stream:true}));
});

// //////////////////////////////////////
// Browser-Sync Tasks
// //////////////////////////////////////
gulp.task('browser-sync', function(){
    browserSync({
        server:{
            baseDir: "."
        }
    });
});

// //////////////////////////////////////
// Watch Task
// //////////////////////////////////////
gulp.task('watch', function(){
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    /*gulp.watch('src/css/** /*.css', ['style']);*/
    gulp.watch('src/jade/**/*.jade', ['jade']);
    gulp.watch('src/*.html', ['html']);
});

// //////////////////////////////////////
// Default Task
// //////////////////////////////////////
gulp.task('default', ['open', 'scripts', 'sass', /*'style', */'jade', 'browser-sync', 'watch']);



// //////////////////////////////////////
// Open
// //////////////////////////////////////
gulp.task('open', function(){
    var options = {
        uri: 'http://localhost:3000/public/index.html',
        app: '/Applications/Google\ Chrome.app'
    };
  gulp.src('./public/index.html')
  .pipe(open());
});