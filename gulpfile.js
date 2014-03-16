var gulp = require('gulp'),
  gutil = require('gulp-util'),
  concat = require('gulp-concat'),
  handlebars = require('gulp-ember-handlebars'),
  less = require('gulp-less'),
  clean = require('gulp-clean'),
  uglify = require('gulp-uglify'),
  serve = require('gulp-serve'),
  streamqueue = require('streamqueue'),
  eventStream = require('event-stream'),
  jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src(['src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Cleanup
gulp.task('clean', function() {
  return gulp.src('build/*', { read: false})
    .pipe(clean());
});

// Scripts
gulp.task('scripts', function() {

  return streamqueue({ objectMode: true },
    gulp.src([
      'src/lib/jquery-2.1.0.js',
      'src/lib/handlebars-runtime-1.3.0.js',
      'src/lib/ember-1.4.0.js',
      'src/lib/ember-data.js',
      'src/lib/ember-localstorage-adapter.js'
    ]),
    gulp.src('src/templates/**/*.hbs')
      .pipe(handlebars({ outputType: 'browser' }))
      .on('error', gutil.log),
    gulp.src('src/js/**/*.js')
  )
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./build/js'));
});

// Stylesheets
gulp.task('less', function(){
  return gulp.src('src/css/style.less')
  .pipe(less({
    paths: ['src/less']
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest('./build/css'));
});

// Index, images, fonts
gulp.task('assets', function(){
  return eventStream.concat(
    gulp.src('src/index.html').pipe(gulp.dest('./build/')),
    gulp.src('src/img/**/*').pipe(gulp.dest('./build/img')),
    gulp.src('src/fonts/**/*').pipe(gulp.dest('./build/fonts'))
  );
});

gulp.task('watch', function() {
  gulp.watch('./src/css/**/*', ['less']);
  gulp.watch(['src/js/**/*.js', 'src/templates/**/*.hbs'], ['scripts']);
  gulp.watch(['src/js/**/*.js'], ['lint']);
  gulp.watch(['./src/img/**/*', './src/fonts/**/*', './src/index.html'], ['assets']);
});

gulp.task('serve', serve('./build'));

gulp.task('default', ['scripts', 'less', 'assets', 'watch', 'serve']);