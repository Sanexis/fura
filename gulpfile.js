"use strict";

const { src, dest, watch, series, parallel } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const svgSprite = require("gulp-svg-sprite");
const browserSync = require("browser-sync").create();

/* Paths */
const srcPath = "src/";
const distPath = "dist/";
const path = {
  build: {
    html: distPath,
    php: distPath,
    js: distPath + "assets/js/",
    css: distPath + "assets/css/",
    images: distPath + "assets/images/",
    sprite: distPath + "assets/images/",
    fonts: distPath + "assets/fonts/",
    videos: distPath + "assets/videos/"
  },
  src: {
    html: srcPath + "*.html",
    php: srcPath + "*.php",
    js: srcPath + "assets/js/*.js",
    css: srcPath + "assets/scss/*.scss",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    sprites: srcPath + "assets/images/sprites/*.svg",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    videos: srcPath + "assets/videos/**/*.{mp4,webm}",
  },
  watch: {
    html: srcPath + "**/*.html",
    php: srcPath + "**/*.php",
    js: srcPath + "assets/js/**/*.js",
    css: srcPath + "assets/scss/**/*.scss",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,glb,gif,ico,webp,webmanifest,xml,json}",
    sprites: srcPath + "assets/images/sprites/*.svg",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    videos: srcPath + "assets/videos/**/*.{mp4,webm}",
  },
  clean: "./" + distPath,
};

/* Tasks */
function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
  });
}

function html(cb) {
  panini.refresh();
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(
      panini({
        root: srcPath,
        layouts: srcPath + "layouts/",
        partials: srcPath + "partials/",
        helpers: srcPath + "helpers/",
        data: srcPath + "data/",
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function php(cb) {
  return src(path.src.php, { base: srcPath })
    .pipe(dest(path.build.php))
    .pipe(browserSync.reload({ stream: true }));
}

function css(cb) {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      sass({
        includePaths: "./node_modules/",
      })
    )
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        autoprefixer: {
          remove: false
        },
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function js(cb) {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}

function images(cb) {
  return src(path.src.images)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 95, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function sprites(cb) {
  return src(path.src.sprites)
    .pipe(svgSprite({
      shape: {
        transform: [{
          svgo: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeUnusedNS: false,
                    cleanupIds: false,
                  }
                }
              },
              'removeComments',
              'removeEmptyAttrs',
              'removeEmptyText',
              'collapseGroups',
            ]
          }
        }]
      },
      mode: {
        symbol: {
          dest : '.',
          sprite: 'sprite.svg'
        }
      }
  }))
    .pipe(dest(path.build.sprite))
    .pipe(browserSync.reload({ stream: true }));
}

function videos(cb) {
  return src(path.src.videos)
    .pipe(dest(path.build.videos))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts(cb) {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.reload({ stream: true }));
}

function clean(cb) {
  return del(path.clean);
}

function watchFiles() {
  watch([path.watch.html], html);
  watch([path.watch.php], php);
  watch([path.watch.css], css);
  watch([path.watch.js], js);
  watch([path.watch.images], images);
  watch([path.watch.sprites], sprites);
  watch([path.watch.videos], videos);
  watch([path.watch.fonts], fonts);
}

function imagesWithoutMin() {
  return src(path.src.images)
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

const build = series(
  clean,
  parallel(html, php, css, js, images, sprites, videos, fonts)
);
const dev = parallel(build, watchFiles, serve);
const buildNMin = gulp.series(clean, html, css, js, imagesWithoutMin, sprites, fonts);

/* Exports Tasks */
exports.html = html;
exports.php = php;
exports.css = css;
exports.js = js;
exports.images = images;
exports.sprites = sprites;
exports.videos = videos;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports.default = dev;
exports.buildNMin = buildNMin;
