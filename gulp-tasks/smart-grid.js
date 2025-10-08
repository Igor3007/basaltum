"use strict";

import gulp from "gulp";
const smartgrid = require("smart-grid");

gulp.task("smart-grid", (cb) => {
    smartgrid("./src/styles/vendor/import/", {
        outputStyle: "scss",
        filename: "_smart-grid",
        columns: 12, // number of grid columns
        offset: "24px", // gutter width - 20px
        mobileFirst: true,
        mixinNames: {
            container: "container"
        },
        container: {
            fields: "1rem" // side fields - 10px
        },
        breakPoints: {
            w360: {
                width: "374.98px"
            },
            w480: {
                width: "480px"
            },
            w580: {
                width: "580px"
            },
            w680: {
                width: "679px"
            },
            w760: {
                width: "769px"
            },
            w940: {
                width: "940px"
            },
            w1024: {
                width: "1025px"
            },
            w1100: {
                width: "1100px"
            },
            w1280: {
                width: "1280px"
            },
            w1376: {
                width: "1376px"
            },
            w1440: {
                width: "1440px"
            },
            w1660: {
                width: "1660px"
            },
        }
    });
    cb();
});