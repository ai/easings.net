"use strict";

const path = require("path");

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const util = require("gulp-util");

const config = require("./config.js");

const constant = {
	DEV: false
};

const getHtmlEnv = () => ({
	dev: constant.DEV,
	all_easings: require("../src/easings")
});

gulp.task("html", done => {
	const pug = require("gulp-pug");
	const htmlMin = require("gulp-htmlmin");

	return gulp
		.src(path.join(config.path.src.templates, "*.pug"))
		.pipe(plumber())
		.pipe(
			pug({
				pretty: true,
				data: getHtmlEnv()
			})
		)
		.pipe(
			htmlMin({
				minifyCSS: true,
				minifyJS: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				collapseBooleanAttributes: true,
				collapseInlineTagWhitespace: true,
				removeRedundantAttributes: true,
				removeStyleLinkTypeAttributes: true
			})
		)
		.pipe(gulp.dest(config.path.dist.root))
		.on("end", done);
});

gulp.task("js", done => {
	const rollup = require("rollup");
	const resolve = require("rollup-plugin-node-resolve");
	const commonjs = require("rollup-plugin-commonjs");
	const babel = require("rollup-plugin-babel");
	const terser = require("rollup-plugin-terser").terser;

	rollup
		.rollup({
			input: path.join(config.path.src.js, "main.js"),
			plugins: [
				resolve(),
				commonjs(),
				babel({
					exclude: "node_modules/**" // only transpile our source code
				}),
				!constant.DEV && terser()
			]
		})
		.then(bundle => {
			return bundle.write({
				file: path.join(config.path.dist.js, "main.js"),
				format: "iife",
				sourcemap: constant.DEV,
				compact: true
			});
		})
		.then(() => done());
});

gulp.task("css", done => {
	const sass = require("gulp-sass");
	const postCSS = require("gulp-postcss");
	const media = require("gulp-group-css-media-queries");
	const cssMin = require("gulp-csso");

	gulp
		.src(path.join(config.path.src.css, "build", "*.{sass,scss,css}"))
		.pipe(plumber())
		.pipe(sass())
		.pipe(
			postCSS([
				require("postcss-flexbugs-fixes"),
				require("postcss-preset-env")
			])
		)
		.pipe(!constant.DEV ? media() : util.noop())
		.pipe(!constant.DEV ? cssMin() : util.noop())
		.pipe(gulp.dest(config.path.dist.css))
		.on("end", done);
});

gulp.task("symbols", done => {
	const symbols = require("gulp-svg-symbols");
	const svgMin = require("gulp-svgmin");

	gulp
		.src(path.join(config.path.src.svg, "*.svg"))
		.pipe(plumber())
		.pipe(svgMin())
		.pipe(
			symbols({
				templates: [path.join(config.path.helpers, "sprite.svg")],
				transformData: (svg, defaultData) => {
					return {
						id: defaultData.id,
						width: svg.width,
						height: svg.height,
						name: svg.name
					};
				}
			})
		)
		.pipe(
			svgMin({
				plugins: [
					{ mergePaths: true },
					{ cleanupIDs: false },
					{ convertStyleToAttrs: false }
				]
			})
		)
		.pipe(gulp.dest(config.path.dist.svg))
		.on("end", done);
});

gulp.task("clean", done => {
	const del = require("del");
	const pathDel = constant.DEV
		? path.join(config.path.dist.root, "*.html")
		: config.path.dist.root;

	del(pathDel, { force: true }).then(() => done());
});

gulp.task("server", () => {
	const express = require("express");
	const app = express();
	const port = 3000;
	const browserSync = require("browser-sync").create();

	app.listen(port);

	app.disable("view cache");
	app.set("view engine", "pug");
	app.set("views", "./");
	app.use(express.static(config.path.dist.root));

	app.get("/*.html", function(req, res) {
		const fileName = req.url.replace(/static\/|\..*$/g, "") || "index";

		res.render(path.join(config.path.src.templates, fileName), getHtmlEnv());
	});

	app.get("/*", function(req, res) {
		res.render(path.join(config.path.src.templates, "index"), getHtmlEnv());
	});

	app.get("/", function(req, res) {
		res.render(path.join(config.path.src.templates, "index"), getHtmlEnv());
	});

	browserSync.init({
		proxy: `http://localhost:${port}`,
		startPath: "/",
		notify: false,
		tunnel: false,
		open: false,
		port: port,
		logPrefix: "Proxy to localhost:" + port
	});

	browserSync
		.watch(path.join(config.path.dist.root, "**", "*"))
		.on("add", browserSync.reload)
		.on("change", browserSync.reload);

	browserSync
		.watch(path.join(config.path.src.templates, "*.pug"))
		.on("add", browserSync.reload)
		.on("change", browserSync.reload);
});

gulp.task("default", buildTask("dev"));
gulp.task("start", buildTask("dev"));
gulp.task("build", buildTask("build"));

function buildTask(mode) {
	return gulp.series(
		done => {
			constant.DEV = !!mode.match(/dev/gi);

			done();
		},

		"clean",

		gulp.parallel("js", "css", "symbols", done => {
			if (constant.DEV) {
				gulp.watch(
					path.join(config.path.src.svg, "*.svg"),
					gulp.series("symbols")
				);

				gulp.watch(
					path.join(config.path.src.js, "**", "*.js"),
					gulp.series("js")
				);

				gulp.watch(
					path.join(config.path.src.css, "**", "*.{sass,scss,css}"),
					gulp.series("css")
				);
			}

			done();
		}),

		!!mode.match(/dev/i) ? "server" : "html"
	);
}
