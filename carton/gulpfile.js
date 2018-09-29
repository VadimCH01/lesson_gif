var gulp      = require('gulp');
var bs        = require('browser-sync');
var sass      = require('gulp-sass');
var concatCSS = require('gulp-concat-css')
var gutil     = require( 'gulp-util' );
var ftp       = require( 'vinyl-ftp' );


// Запускаем сервер, предварительно скопилировав SASS
gulp.task('serve', ['sass'], function() {

    bs.init({
      server: "./src"
    });

    gulp.watch("src/sass/*.sass", ['sass']);
    gulp.watch("src/*.html").on('change', bs.reload);
});

// Делаем компиляцию SASS в CSS 
gulp.task('sass', function() {
 return gulp.src("src/sass/*.sass")
   .pipe(sass())
   .pipe(concatCSS("main.css"))
   .pipe(gulp.dest("src/css"))
   .pipe(bs.stream());
});

gulp.task('default', ['serve']);

gulp.task( 'deploy', function () {

	var conn = ftp.create( {
		host:     'ftp.hovalot5.org.il',
		user:     'vady1@hovalot5.co.il',
		password: 'Pb4TL9[Q}B_}',
		log:      gutil.log
	} );

	var globs = [
		'src/**'
	];

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe( conn.newer( '/www//academy-lesson.top-media24.co.il/lesson-12/' ) ) // only upload newer files
		.pipe( conn.dest( '/www/academy-lesson.top-media24.co.il/lesson-12/' ) );

} );