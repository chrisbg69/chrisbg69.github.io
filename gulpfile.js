"use strict";

let gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	exec = require("gulp-exec"),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	cp = require("child_process");

gulp.task("css", function() {
	return gulp.src( 'assets/scss/**/*.scss' )
		.pipe( sass().on('error', sass.logError) )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( './_site/css/' ) )
		.pipe( browserSync.stream({ match: '**/*.css' }) )
	;
});

// Jekyll
gulp.task("jekylldev", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell: true });
});



gulp.task("watch", function() {

	browserSync.init({
		server: {
            baseDir: "./_site/"
		}
	});

	gulp.watch( 'assets/scss/**/*.scss', gulp.series('css') );

	gulp.watch(
		[
			"./*.html",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_posts/**/*.*",
			"./scripts/*.js"
		]
	).on('change', gulp.series('jekylldev', 'css') );

	gulp.watch( '_site/**/*.html' ).on('change', browserSync.reload );
	gulp.watch( '_site/**/*.js' ).on('change', browserSync.reload );
});



gulp.task("default", gulp.series('jekylldev', 'css', 'watch'));