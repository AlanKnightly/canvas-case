var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");

function htmlTask() {
  return gulp.src("src/index.html").pipe(gulp.dest("dist"));
}

function jsTask() {
  return gulp
    .src("src/index.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
}

function cssTask() {
  var plugins = [autoprefixer({}), cssnano()];
  return gulp.src("src/*.css").pipe(postcss(plugins)).pipe(gulp.dest("dist"));
}

exports.css = gulp.task("updateCss", function () {
  return gulp.watch(["src/*.css"], cssTask);
});

exports.default = gulp.parallel(htmlTask, cssTask, jsTask);
