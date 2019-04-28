var gulp = require('gulp');
var util = require('gulp-util');
var rename = require('gulp-rename');
var through2 = require('through2');
var yurine = require('yurine');
var babel = require('@babel/core');

var fs = require('fs');
var path = require('path');

function jsx(file, enc, cb) {
  util.log(path.relative(file.cwd, file.path));
  var content = file.contents.toString('utf-8');
  content = yurine.parse(content);
  content = babel.transformSync(content, {
    presets: ['@babel/preset-env']
  }).code;
  file.contents = Buffer.from(content);
  cb(null, file);
}

gulp.task('build-test', function() {
  return gulp.src(['./tests/**/*.jsx'])
    .pipe(through2.obj(jsx))
    .pipe(rename({
      extname:'.js'
    }))
    .pipe(gulp.dest('./tests/'));
});
