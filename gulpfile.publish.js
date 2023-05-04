const gulp = require("gulp");
const shell = require("gulp-shell");

module.exports = gulp.task(
  "publish",
  gulp.series("prepublish", shell.task(["cd ./lib && yarn publish"]))
);
