const gulp = require("gulp");

require("./gulpfile.pack.js");
require("./gulpfile.build.js");

gulp.task("watch", function () {
  gulp.watch("src/**/*", gulp.series("build"));
});

gulp.task("prepublish", function () {
  return gulp.watch("src/**/*", gulp.series("build", "pack"));
});

gulp.task("prepublish", gulp.series("build", "pack"));

require("./gulpfile.publish.js");
