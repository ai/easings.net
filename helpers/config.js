const cwd = process.cwd();

const dist = "docs";
module.exports = {
	autoPrefix: ["Last 5 versions", "IE >= 10"],

	path: {
		helpers: `${cwd}/helpers`,

		src: {
			templates: `${cwd}/src/templates`,

			css: `${cwd}/src/app/css`,
			fonts: `${cwd}/src/app/fonts`,
			img: `${cwd}/src/app/img`,
			js: `${cwd}/src/app/js`,
			svg: `${cwd}/src/app/svg`,

			cont: `${cwd}/src/cont`,

			static: `${cwd}/src/static`
		},
		dist: {
			name: dist,

			templates: `${cwd}/${dist}`,

			css: `${cwd}/${dist}/app/css`,
			fonts: `${cwd}/${dist}/app/fonts`,
			img: `${cwd}/${dist}/app/img`,
			js: `${cwd}/${dist}/app/js`,
			svg: `${cwd}/${dist}/app/svg`,

			cont: `${cwd}/${dist}/cont`,

			static: `${cwd}/${dist}`
		}
	}
};
