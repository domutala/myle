const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const merge = require("merge2");
const del = require("del");

gulp.task("clean", function () {
  return del(["lib"]);
});
gulp.task("build:sass", function () {
  return gulp
    .src("./src/style/myle.scss")
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest("lib/css"));
});

gulp.task("copy:sass", function () {
  return gulp.src("./src/style/**/*").pipe(gulp.dest("lib/sass"));
});

gulp.task("copy:package", function () {
  return gulp.src("./package.json").pipe(gulp.dest("lib"));
});

const ts = require("gulp-typescript");
gulp.task("script", function () {
  const tsProject = ts.createProject("tsconfig.json");
  const result = gulp.src("src/*.ts").pipe(tsProject());

  return merge([
    result.dts.pipe(gulp.dest("lib/typings")),
    result.js.pipe(gulp.dest("lib")),
  ]);
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel("script", "build:sass", "copy:sass", "copy:package")
  )
);
