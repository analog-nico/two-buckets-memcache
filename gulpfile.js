'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var chalk = require('chalk');
var rimraf = require('rimraf');


var paths = {
    libJsFiles: './lib/**/*.js',
    gulpfile: './gulpfile.js',
    specFiles: './test/spec/**/*.js',
    fixtureFiles: './test/fixtures/**/*.js',
    jshintrc: './.jshintrc'
};


function lint() {

    return gulp.src([paths.libJsFiles, paths.gulpfile, paths.specFiles, paths.fixtureFiles])
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish))
        .pipe(jshint.reporter('fail'));

}

function clean(done) {
    rimraf('./coverage', done);
}

function instrument() {
    return gulp.src(paths.libJsFiles)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
}

function runTest() {
    return gulp.src(paths.specFiles)
        .pipe(mocha())
        .on('error', function (err) {
            console.error(String(err));
            console.error(chalk.bold.bgRed(' TESTS FAILED '));
        })
        .pipe(istanbul.writeReports());
}

function test() {
    return gulp.series(clean, instrument, runTest);
}

function testNoCov() {

    return gulp.src(paths.specFiles)
        .pipe(mocha())
        .on('error', function (err) {
            console.error(String(err));
            console.log(chalk.bold.bgRed(' TESTS FAILED '));
        });

}

function watch() {

    gulp.watch([
        paths.libJsFiles,
        paths.gulpfile,
        paths.specFiles,
        paths.fixtureFiles,
        paths.jshintrc
    ], gulp.series(lint, test()));

    gulp.watch([
        paths.gulpfile
    ], lint);

}

module.exports = {
    dev: gulp.series(lint, test(), watch),
    test: gulp.series(lint, testNoCov, test()),
    testNoCov: testNoCov
};
