const path = require("path");
const fs = require("fs");

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");
const yamlParse = require("js-yaml");

const config = require("./helpers/config.js");

const constant = {
	DEV: false
};

const getHtmlEnv = () => ({
	dev: constant.DEV,
	all_easings: yamlParse.safeLoad(fs.readFileSync("./src/easings.yml", "utf8"))
});

function html(done) {
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
}

function scripts(done) {
	const rollup = require("rollup");
	const tslint = require("rollup-plugin-tslint");
	const typescript = require("rollup-plugin-typescript");
	const commonjs = require("rollup-plugin-commonjs");
	const babel = require("rollup-plugin-babel");
	const terser = require("rollup-plugin-terser").terser;

	rollup
		.rollup({
			input: path.join(config.path.src.js, "main.ts"),
			plugins: [
				tslint({
					throwOnError: true,
					throwOnWarning: true
				}),
				typescript({
					typescript: require("typescript")
				}),
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
		.then(() => done())
		.catch(() => done());
}

function styles(done) {
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
		.pipe(gulpIf(!constant.DEV, media()))
		.pipe(gulpIf(!constant.DEV, cssMin()))
		.pipe(gulp.dest(config.path.dist.css))
		.on("end", done);
}

function images(done) {
	gulp
		.src(path.join(config.path.src.img, "*"))
		.pipe(gulp.dest(config.path.dist.img))
		.on("end", done);
}

function symbols(done) {
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
}

function cleanDist(done) {
	const del = require("del");
	const pathDel = constant.DEV
		? path.join(config.path.dist.root, "*.html")
		: config.path.dist.root;

	del(pathDel).then(() => done());
}

function server() {
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
}

function staticFiles() {
	return gulp
		.src(path.join(config.path.src.static, "**/*"))
		.pipe(gulp.dest(config.path.dist.static));
}

function buildTask(mode) {
	return gulp.series(
		function setENV(done) {
			constant.DEV = !!mode.match(/dev/gi);
			done();
		},

		cleanDist,

		gulp.parallel(
			scripts,
			styles,
			symbols,
			images,
			staticFiles,
			function startingWatchers(done) {
				if (constant.DEV) {
					gulp.watch(
						path.join(config.path.src.svg, "*.svg"),
						gulp.series(symbols)
					);

					gulp.watch(path.join(config.path.src.img, "*"), gulp.series(images));

					gulp.watch(
						path.join(config.path.src.static, "**/*"),
						gulp.series(staticFiles)
					);

					gulp.watch(
						path.join(config.path.src.js, "**", "*.{js,ts}"),
						gulp.series(scripts)
					);

					gulp.watch(
						path.join(config.path.src.css, "**", "*.{sass,scss,css}"),
						gulp.series(styles)
					);
				}

				done();
			}
		),

		!!mode.match(/dev/i) ? server : html
	);
}

exports.default = buildTask("dev");
exports.start = buildTask("dev");
exports.build = buildTask("build");
