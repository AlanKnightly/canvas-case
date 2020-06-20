var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");

function jsTask(cb) {
  return gulp
    .src("src/index.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("static"));
  cb();
}
function cssTask(cb) {
  return gulp.src("src/*.css").pipe(postcss()).pipe(gulp.dest("static"));
  cb();
}

exports.default = gulp.parallel(cssTask, jsTask);
