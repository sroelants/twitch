var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');



// Tasks

gulp.task('sass', function() {
    return gulp.src('src/sass/*.sass')
      .pipe(sass())
      .pipe(gulp.dest('src/css'))
      .pipe(browserSync.reload({
        stream: true
        }))
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    })
});

gulp.task('babel', function() {
  return gulp.src('src/es6/*.es6.js')
    .pipe(babel({ presets: ['es2015']}))
    .pipe(gulp.dest('src/js'));
});

gulp.task('images', function() {
  return gulp.src('src/img/*')
             .pipe(gulp.dest('dist/img'));
             });

gulp.task('build', ['sass', 'babel', 'images'], function () {
  return gulp.src('src/*.html')
             .pipe(useref())
             .pipe(gulpIf('*.js', uglify()))
             .pipe(gulpIf('*.css', cssnano()))
             .pipe(gulp.dest('dist'));
             });

// browserSync must finish before other watch tasks
gulp.task('watch', ['browserSync', 'sass', 'babel'], function() {
    gulp.watch('src/sass/*.sass', ['sass']);
    gulp.watch('src/es6/*.es6.js', ['babel']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/*.js', browserSync.reload);
});


