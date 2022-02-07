const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./src/",
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
        port: 3000,
        notify: true
    });
    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/js/**/*.js").on("change", browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/*.+(scss|sass)")
            .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
             .pipe(rename({
                prefix: "",
                suffix: "",
              })) 
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
                cascade: false
            }))
            // .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest("src/css"))
            .pipe(browserSync.stream());
})

gulp.task('watch', function(){
    gulp.watch("src/sass/*.+(scss|sass)", gulp.parallel("styles"))
    gulp.watch("src/*.html").on("change", browserSync.reload)
})

gulp.task('default', gulp.parallel('watch', 'server', 'styles'));