"use strict";

const gulp = require("gulp"),
	plumber = require("gulp-plumber"),
	util = require("gulp-util"),
	cache = require("gulp-cached"),
	rename = require("gulp-rename"),
	sass = require("gulp-sass"),
	postCSS = require("gulp-postcss"),
	autoPrefix = require("autoprefixer"),
	media = require("gulp-group-css-media-queries"),
	cssMin = require("gulp-csso"),
	symbols = require("gulp-svg-symbols"),
	svgMin = require("gulp-svgmin"),
	pug = require("gulp-pug"),
	htmlMin = require("gulp-htmlmin"),
	webpack = require("webpack"),
	webpackConfig = require("./webpack.config.js"),
	constant = {
		DEV: false,
		PROD: false,
		MIN: false,
		VIEW: false
	},
	config = require("./helpers/config.js"),
	path = config.path;

const getHtmlEnv = () => ({
	dev: constant.DEV,
	all_easings: require("./src/easings")
});

gulp.task("html", () => {
	return gulp
		.src(`${path.src.templates}/*.{pug,jade}`)
		.pipe(plumber())
		.pipe(
			pug({
				pretty: true,
				data: getHtmlEnv()
			})
		)
		.pipe(
			constant.MIN
				? htmlMin({
						minifyCSS: true,
						minifyJS: true,
						collapseWhitespace: true,
						conservativeCollapse: true,
						collapseBooleanAttributes: true,
						collapseInlineTagWhitespace: true,
						removeRedundantAttributes: true,
						removeStyleLinkTypeAttributes: true
				  })
				: util.noop()
		)
		.pipe(gulp.dest(path.dist.templates));
});

gulp.task("js", done => {
	webpack(
		Object.assign(webpackConfig, {
			mode: constant.DEV ? "development" : "production",
			watch: constant.DEV || constant.VIEW
		}),

		(err, stats) => {
			if (err || stats.hasErrors()) {
				throw new util.PluginError("webpack", err);
			}

			done();
		}
	);
});

gulp.task("css", done => {
	gulp
		.src(`${path.src.css}/build/*.{sass,scss,css}`)
		.pipe(plumber())
		.pipe(sass())
		.pipe(
			postCSS([
				autoPrefix({
					browsers: config.autoPrefix
				})
			])
		)
		.pipe(!constant.DEV ? media() : util.noop())
		.pipe(constant.MIN ? cssMin() : util.noop())
		.pipe(gulp.dest(path.dist.css))
		.on("end", done);
});

gulp.task("symbols", done => {
	// const fs = require('fs');
	// fs.readdir(path.src.svg, (err, items) => {
	// for (let i = 0; i < items.length; i++) {
	// 	gulp.src(`${path.src.svg}/${items[i]}/*.svg`)

	gulp
		.src(`${path.src.svg}/*.svg`)
		.pipe(plumber())
		.pipe(svgMin())
		.pipe(
			symbols({
				templates: [`${path.helpers}/svg-symbols.svg`],
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
		.pipe(
			rename(path => {
				path.basename = "sprite";
			})
		)
		.pipe(gulp.dest(`${path.dist.img}`));
	// }

	done();

	// });
});

gulp.task("img", () => {
	return gulp
		.src(`${path.src.img}/*.{png,jpg,gif,webp}`)
		.pipe(plumber())
		.pipe(cache("img"))
		.pipe(gulp.dest(path.dist.img));
});

gulp.task("svg", () => {
	return gulp
		.src(`${path.src.img}/*.svg`)
		.pipe(plumber())
		.pipe(cache("svg"))
		.pipe(
			!constant.DEV
				? svgMin({
						plugins: [{ mergePaths: true }]
				  })
				: util.noop()
		)
		.pipe(gulp.dest(path.dist.img));
});

gulp.task("fonts", () => {
	return gulp
		.src(`${path.src.fonts}/**/*`)
		.pipe(plumber())
		.pipe(cache("fonts"))
		.pipe(gulp.dest(path.dist.fonts));
});

gulp.task("cont", () => {
	return gulp
		.src([`${path.src.cont}/**/*`, `!${path.src.cont}/**/*.{png,jpg,gif,webp}`])
		.pipe(plumber())
		.pipe(cache("cont"))
		.pipe(gulp.dest(path.dist.cont));
});

gulp.task("cont:img", () => {
	return gulp
		.src(`${path.src.cont}/**/*.{png,jpg,gif,webp}`)
		.pipe(plumber())
		.pipe(cache("cont:img"))
		.pipe(gulp.dest(path.dist.cont));
});

gulp.task("static", () => {
	return gulp
		.src([
			`${path.src.static}/**/*`,
			`!${path.src.static}/**/*.{png,jpg,gif,webp}`
		])
		.pipe(plumber())
		.pipe(cache("static"))
		.pipe(gulp.dest(path.dist.static));
});

gulp.task("static:img", () => {
	return gulp
		.src(`${path.src.static}/**/*.{png,jpg,gif,webp}`)
		.pipe(plumber())
		.pipe(cache("static:img"))
		.pipe(gulp.dest(path.dist.static));
});

gulp.task("clean", done => {
	require("del")(
		constant.DEV || constant.VIEW
			? `${path.dist.templates}/*.html`
			: [path.dist.templates]
	).then(() => {
		done();
	});
});

gulp.task("server", done => {
	const express = require("express"),
		app = express(),
		listener = app.listen(),
		port = listener.address().port,
		browserSync = require("browser-sync").create();

	app.disable("view cache");

	app.set("view engine", "pug");

	app.set("views", "./");

	app.use(express.static("./dist"));

	app.get("/*.html", function(req, res) {
		const fileName = req.url.replace(/static\/|\..*$/g, "") || "index";

		res.render(`src/templates/${fileName}`, getHtmlEnv());
	});

	app.get("/*", function(req, res) {
		res.render("src/templates/index", getHtmlEnv());
	});

	// редирект на главную страницу
	app.get("/", function(req, res) {
		res.render("src/templates/index", getHtmlEnv());
	});

	browserSync.init({
		proxy: `http://localhost:${port}`,
		startPath: "/",
		notify: false,
		tunnel: false,
		open: false,
		// host: 'localhost',
		port: port,
		logPrefix: "Proxy to localhost:" + port
	});

	// обновляем страницу, если обновились assets файлы
	browserSync
		.watch("./dist/app/**/*")
		.on("add", browserSync.reload)
		.on("change", browserSync.reload);

	browserSync
		.watch(`${path.src.templates}/*.{pug,jade}`)
		.on("add", browserSync.reload)
		.on("change", browserSync.reload);
});

gulp.task("default", buildTask("dev"));
gulp.task("dev", buildTask("dev"));
gulp.task("view", buildTask("view"));
gulp.task("min", buildTask("min"));
gulp.task("prod", buildTask("prod"));

function buildTask(mode) {
	return gulp.series(
		done => {
			constant.DEV = !!mode.match(/dev/gi);
			constant.VIEW = !!mode.match(/view/gi);
			constant.MIN = !!mode.match(/min/gi) || constant.VIEW;
			constant.PROD = !!mode.match(/prod/gi);

			done();
		},

		"clean",

		gulp.parallel(
			"js",
			"img",
			"svg",
			"css",
			"fonts",
			"static",
			"static:img",
			"cont",
			"cont:img",
			"symbols",
			done => {
				if (constant.DEV || constant.VIEW) {
					gulp.watch(
						`${path.src.img}/*.{png,jpg,gif,webp}`,
						gulp.series("img")
					);
					gulp.watch(`${path.src.img}/*.svg`, gulp.series("svg"));
					gulp.watch(`${path.src.fonts}/*`, gulp.series("fonts"));
					gulp.watch(
						`${path.src.static}/**/*`,
						gulp.parallel("static", "static:img")
					);
					gulp.watch(
						`${path.src.cont}/**/*`,
						gulp.parallel("cont", "cont:img")
					);
					gulp.watch(`${path.src.svg}/**/*`, gulp.series("symbols"));

					gulp.watch(
						`${path.src.css}/**/*.{sass,scss,css}`,
						gulp.series("css")
					);
				}

				done();
			}
		),

		!!mode.match(/(dev|view)/gi) ? "server" : "html"
	);
}
