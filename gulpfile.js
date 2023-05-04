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
    .src("./src/sass/myle.scss")
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest("lib/css"));
});

gulp.task("copy:sass", function () {
  return gulp.src("./src/sass/**/*").pipe(gulp.dest("lib/sass"));
});

gulp.task("watch", function () {
  gulp.watch("src/**/*", gulp.series("build"));
});

const ts = require("gulp-typescript");
gulp.task("script", function () {
  const tsProject = ts.createProject("tsconfig.json");
  const result = gulp.src("src/index.ts").pipe(tsProject());

  return merge([
    result.dts.pipe(gulp.dest("lib/typings")),
    result.js.pipe(gulp.dest("lib")),
  ]);
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("script", "build:sass", "copy:sass"))
);
