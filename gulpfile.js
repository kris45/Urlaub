var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat 		 = require('gulp-concat'),
	uglify 		 = require('gulp-uglifyjs'),
	cssnano 	 = require('gulp-cssnano'),
	rename 		 = require('gulp-rename'),
	del 		 = require('del'),
	autoprefixer = require('gulp-autoprefixer');
	spritesmith  = require('gulp.spritesmith');

gulp.task('sprite-clean', function() {
    return del.sync('app/img/sprite*.png');
});


gulp.task('sprite', ['sprite-clean'], function() {
    var spriteData = gulp.src('app/img/icons/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.scss',
            cssFormat: 'scss',
            padding: 2,
            cssVarMap: function (sprite) {
                sprite.name = 'icon-' + sprite.name
            },
            imgPath: '../img/sprite.png'
        }));

    spriteData.img
        .pipe(gulp.dest('app/img/'));

    spriteData.css
        .pipe(gulp.dest('app/sass/'));

    return spriteData;
});

gulp.task('sass', function(){

	return gulp.src('app/sass/**/*.scss')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});


gulp.task('scripts', function(){

	return gulp.src([
        'app/libs/tmpl/tmpl.js',
        'app/libs/masonry/masonry.pkgd.js',
        'app/libs/masonry/imagesloaded.pkgd.js'
    ])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('ie-libs', function() {

    return gulp.src('app/libs/html5shiv/html5shiv.js')
    .pipe(concat('ie.libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('cssmin', ['sass'], function(){

	return gulp.src('app/css/main.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
})

gulp.task('browser-sync', function(){

	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');
})

gulp.task('watch', ['browser-sync', 'cssmin', 'scripts', 'ie-libs'], function(){
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'sass', 'scripts'], function(){

	var buildCss = gulp.src([
		'app/css/main.min.css',
		'app/css/reset.css',
		'app/css/ie.css'
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));
	
	var buidImg = gulp.src('app/img/**/*')
	.pipe(gulp.dest('dist/img'));

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
})

gulp.task('default', ['watch']);
