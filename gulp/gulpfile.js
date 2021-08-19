let gulp = require('gulp'), //Подключаем все пакеты из node_modules, т.е. gulp
    sass = requite('gulp-sass')(require('sass')), //Подключаем плагин sass
    browserSync = require('browser-sync'), //Подключаем плагин browser sync для автоматической перезагрузки страницы
    concat = require('gulp-concat'), //Плагин для конкатенации scss файлов в один
    uglify = require('gulp-uglifyjs'),  //Плагин для сжатия JS
    del = require('del'), //Библиотека для удаления файлов и папок
    autoprefixer = require('gulp-autoprefixed'), //Плагин для авто-префиксов в css
    rename = require('gulp-rename');

gulp.task('scss', function(){
    return gulp.src('app/scss/**/*.scss') //Собираем все файлы .scss из папки scss и ее дочерних папок 
               .pipe(sass({outputStyle: compressed})) //Применяем к нему плагин sass
               .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie8', 'ie7'], {cascade: true})) //Создаем префиксы
               .pipe(rename({suffix: '.min'}))
               .pipe(gulp.dest('app/css')) //Выгружаем файлы в app/css
               .pipe(browserSync.reload({stream: true})) //Перезагружает страничку
}); //Создаем таск для scss

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app' //Папка, которая запустится на сервере
        },
        notify: false //Отключаем уведомления
    }); 
}); //Создаем таск для browser sync

gulp.task('html', function(){
    return gulp.src('app/*.html')
               .pipe(browserSync.reload({stream: true}))
}); //Создаем таск для html

gulp.task('js', function(){
    return gulp.src('app/js/**/*.js')
               .pipe(concat('main.js')) //Складываем все js файлы в main.js
               .pipe(uglify()) //Сжимаем файл
               .pipe(gulp.dest('app/js')) //Выгружаем файл в app/js
               .pipe(browserSync.reload({stream: true}))
}); //Создаем таск для js

gulp.task('clean', function(){
    return del.sync('dist'); //Удаляет папку dist перед сборкой
}); //Таск для очистки папки перед продакшеном

gulp.task('prebuild', function(){
    let buildCss = gulp.src('app/css/style.css').pipe(gulp.dest('dist/css'));

    let buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));

    let buildHtml = gulp.src('app/*.html').pipe(gulp.dest('dist'));

    let buildJs = gulp.src('app/js/**/*.js').pipe(gulp.dest('dist/js'));

    let buildImg = gulp.src('app/img/**/*.*').pipe(gulp.dest('dist/img'))
}); //Переделать под gulp 4

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss')); //Отслеживает файлы и, при обнаружении изменений, выполняет таск scss
    gulp.watch('app/*.html', gulp.parallel('html')); //Слежка за html файлами
    gulp.watch('app/js/**/*.js', gulp.parallel('js')); //Слежка за js файлами
}); //Создаем таск для слежки за изменениями в файлах

gulp.task('default', gulp.parallel('html', 'scss', 'js', 'browser-sync', 'watch')); //Дефолтный таск (запускается командой gulp)
gulp.task('build', gulp.parallel('clean', 'prebuild')); //Таск для выхода в продакшн