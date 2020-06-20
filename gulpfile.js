var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");

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
  var plugins = [autoprefixer({}), cssnano()];
  return gulp.src("src/*.css").pipe(postcss(plugins)).pipe(gulp.dest("static"));
  cb();
}

exports.default = gulp.parallel(cssTask, jsTask);
