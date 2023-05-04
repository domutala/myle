const gulp = require("gulp");
const shell = require("gulp-shell");
const del = require("del");

gulp.task("pack:zipper", shell.task(["cd ./lib && yarn pack"]));

gulp.task("pack:copy", function () {
  return gulp.src("./lib/**/*.tgz").pipe(gulp.dest("./"));
});

gulp.task("pack:clean", function () {
  return del(["lib/**/*.tgz"]);
});

module.exports = gulp.task(
  "pack",
  gulp.series("pack:clean", "pack:zipper", "pack:copy", "pack:clean")
);
