var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var base64 = require('gulp-base64');

gulp.task('sass', function () {
    return gulp.src(['./*.scss', './**/*.scss', './**/**/*.scss', '!./node_modules/**/*.scss', '!./common.scss'])
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(base64({
            maxImageSize: 2000 * 1024, // bytes
        }))
        .pipe(rename(function (path) {
            console.log(path)
            path.extname = ".wxss";
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('sass:watch', function () {
    gulp.watch(['./*.scss', './**/*.scss', './**/**/*.scss'], ['sass']);
});