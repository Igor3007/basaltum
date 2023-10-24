"use strict";

import {
    paths
} from "../gulpfile.babel";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import gulp from "gulp";
import gulpif from "gulp-if";
import rename from "gulp-rename";
import browsersync from "browser-sync";
import debug from "gulp-debug";
import yargs from "yargs";
import concat from "gulp-concat";
import uglify from 'gulp-uglify';

const webpackConfig = require("../webpack.config.js"),
    argv = yargs.argv,
    production = !!argv.production;

webpackConfig.mode = production ? "production" : "development";
webpackConfig.devtool = production ? false : "source-map";

// gulp.task("scripts", () => {
//     return gulp.src(paths.scripts.src)
//         .pipe(webpackStream(webpackConfig), webpack)
//         .pipe(gulpif(production, rename({
//             suffix: ".min"
//         })))
//         .pipe(gulp.dest(paths.scripts.dist))
//         .pipe(debug({
//             "title": "JS files"
//         }))
//         .on("end", browsersync.reload);
// });

gulp.task("libs", () => {
    return gulp.src(paths.libs.src)
        // .pipe(webpackStream(webpackConfig), webpack)
        // .pipe(gulpif(production, rename({
        //     suffix: ".min"
        // })))
        .pipe(gulp.dest(paths.libs.dist))
        .pipe(debug({
            "title": "libs"
        }))
        .on("end", browsersync.reload);
});


gulp.task('vendor', function () {
    return gulp.src('./src/js/vendor/*.js')
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('json', function () {
    return gulp.src('./src/json/*.**')
        .pipe(gulp.dest('./dist/json/'));
});



gulp.task("common", () => {
    return gulp.src('./src/js/common/*.{js,json}')

        .pipe(gulp.dest('./dist/js/'))
        .pipe(debug({
            "title": "common"
        }))
        .on("end", browsersync.reload);
});