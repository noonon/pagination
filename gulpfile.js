/**
 * Created by noonon on 4/17/16.
 */
var gulp = require('gulp');
var restEmulator = require('gulp-rest-emulator');

gulp.task('run', function () {
    // Options not require
    var options = {
        port: 8000,
        root: ['./'],
        rewriteNotFound: false,
        rewriteTemplate: 'index.html',
        corsEnable: false, // Set true to enable CORS
        corsOptions: {}, // CORS options, default all origins
        headers: {} // Set headers for all response, default blank
    };
    return gulp.src('./mocks/**/*.js')
        .pipe(restEmulator(options));
});

gulp.task('watch', ['run'], function () {
    gulp.watch('./mocks/**/*.js', ['run']);
});