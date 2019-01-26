!(function(t) {
	var e = {};
	function n(o) {
		if (e[o]) return e[o].exports;
		var i = (e[o] = { i: o, l: !1, exports: {} });
		return t[o].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
	}
	(n.m = t),
		(n.c = e),
		(n.d = function(t, e, o) {
			n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: o });
		}),
		(n.r = function(t) {
			"undefined" != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(t, "__esModule", { value: !0 });
		}),
		(n.t = function(t, e) {
			if ((1 & e && (t = n(t)), 8 & e)) return t;
			if (4 & e && "object" == typeof t && t && t.__esModule) return t;
			var o = Object.create(null);
			if (
				(n.r(o),
				Object.defineProperty(o, "default", { enumerable: !0, value: t }),
				2 & e && "string" != typeof t)
			)
				for (var i in t)
					n.d(
						o,
						i,
						function(e) {
							return t[e];
						}.bind(null, i)
					);
			return o;
		}),
		(n.n = function(t) {
			var e =
				t && t.__esModule
					? function() {
							return t.default;
					  }
					: function() {
							return t;
					  };
			return n.d(e, "a", e), e;
		}),
		(n.o = function(t, e) {
			return Object.prototype.hasOwnProperty.call(t, e);
		}),
		(n.p = ""),
		n((n.s = 11));
})([
	function(t, e, n) {
		var o = n(3),
			i = n(9),
			r = "[object AsyncFunction]",
			c = "[object Function]",
			u = "[object GeneratorFunction]",
			a = "[object Proxy]";
		t.exports = function(t) {
			if (!i(t)) return !1;
			var e = o(t);
			return e == c || e == u || e == r || e == a;
		};
	},
	function(t, e, n) {
		var o = n(4).Symbol;
		t.exports = o;
	},
	function(t, e, n) {
		var o = n(0),
			i = n(10);
		t.exports = function(t) {
			return null != t && i(t.length) && !o(t);
		};
	},
	function(t, e, n) {
		var o = n(1),
			i = n(7),
			r = n(8),
			c = "[object Null]",
			u = "[object Undefined]",
			a = o ? o.toStringTag : void 0;
		t.exports = function(t) {
			return null == t
				? void 0 === t ? u : c
				: a && a in Object(t) ? i(t) : r(t);
		};
	},
	function(t, e, n) {
		var o = n(5),
			i = "object" == typeof self && self && self.Object === Object && self,
			r = o || i || Function("return this")();
		t.exports = r;
	},
	function(t, e, n) {
		(function(e) {
			var n = "object" == typeof e && e && e.Object === Object && e;
			t.exports = n;
		}.call(this, n(6)));
	},
	function(t, e) {
		var n;
		n = (function() {
			return this;
		})();
		try {
			n = n || new Function("return this")();
		} catch (t) {
			"object" == typeof window && (n = window);
		}
		t.exports = n;
	},
	function(t, e, n) {
		var o = n(1),
			i = Object.prototype,
			r = i.hasOwnProperty,
			c = i.toString,
			u = o ? o.toStringTag : void 0;
		t.exports = function(t) {
			var e = r.call(t, u),
				n = t[u];
			try {
				t[u] = void 0;
				var o = !0;
			} catch (t) {}
			var i = c.call(t);
			return o && (e ? (t[u] = n) : delete t[u]), i;
		};
	},
	function(t, e) {
		var n = Object.prototype.toString;
		t.exports = function(t) {
			return n.call(t);
		};
	},
	function(t, e) {
		t.exports = function(t) {
			var e = typeof t;
			return null != t && ("object" == e || "function" == e);
		};
	},
	function(t, e) {
		var n = 9007199254740991;
		t.exports = function(t) {
			return "number" == typeof t && t > -1 && t % 1 == 0 && t <= n;
		};
	},
	function(t, e, n) {
		"use strict";
		n.r(e);
		var o = n(2),
			i = n.n(o),
			r = n(0),
			c = n.n(r);
		function u(t, e) {
			t && i()(t) && c()(e) && Array.prototype.slice.call(t).forEach(e);
		}
		function a(t) {
			var e = t.to,
				n = t.duration,
				o =
					(window.pageYOffset || document.documentElement.scrollTop) -
					(document.documentElement.clientTop || 0),
				i = e - o,
				r = 0;
			!(function t() {
				var e, c, u;
				(r += 16),
					window.scrollTo(
						0,
						((e = r),
						(c = o),
						(u = i),
						(e /= n / 2) < 1
							? u / 2 * e * e * e + c
							: u / 2 * ((e -= 2) * e * e + 2) + c)
					),
					r < n && requestAnimationFrame(t);
			})();
		}
		function s(t) {
			if (!t) throw "Element must not be empty";
			var e = window.getComputedStyle(t),
				n = /([\d.]+m*s)/i.exec(e.transitionDuration),
				o = Array.isArray(n) ? n[1] : 0,
				i = o.indexOf("ms") > -1 ? 1 : 1e3;
			return parseFloat(o) * i;
		}
		var l = ".js-chart-for-info",
			f = ".js-info",
			d = ".js-columns",
			y = 400,
			m = 50,
			v = 20;
		function p(t) {
			var e = document.getElementById("func-".concat(t));
			if (e && !e.isExpand) {
				e.isExpand = !0;
				var n = e.getAttribute("data-name"),
					o = e.getAttribute("data-func");
				if (n && o) {
					var i = document.querySelector(f),
						r = i.querySelector(".js-info-chart"),
						c = document.querySelector(d),
						p = e.querySelector(l),
						b = e.querySelector(".js-function-chart"),
						g = s(i),
						h = s(e);
					u(i.querySelectorAll(".js-info-name"), function(t) {
						return (t.innerText = n);
					}),
						u(i.querySelectorAll(".js-info-func"), function(t) {
							return (t.innerText = o);
						}),
						(i.style.transitionTimingFunction = o),
						(p.style.transitionTimingFunction = o),
						c.classList.add("b-columns--hide"),
						e.classList.add("b-function--open"),
						(i.style.display = "block"),
						b.classList.remove("b-chart--active"),
						requestAnimationFrame(function() {
							var t = c.getBoundingClientRect(),
								n = p.getBoundingClientRect(),
								o = r.getBoundingClientRect(),
								u = n.height / n.width * 100;
							(p.style.position = "absolute"),
								(p.style.width = "".concat(n.width, "px")),
								(r.style.paddingBottom = "".concat(u, "%")),
								(b.style.paddingBottom = "".concat(u, "%")),
								requestAnimationFrame(function() {
									var u = o.x - n.x,
										s = o.y - n.y - v;
									(p.style.transitionDuration = "".concat(y, "ms")),
										setTimeout(function() {
											(p.style.transform = "translate("
												.concat(u, "px, ")
												.concat(s, "px)")),
												(p.style.width = "".concat(o.width, "px"));
										}, h),
										setTimeout(function() {
											i.classList.add("b-info--evident");
										}, y + 1.5 * h),
										setTimeout(function() {
											var n =
												p.getBoundingClientRect().y - t.y + r.offsetHeight + m;
											(c.style.height = "".concat(n, "px")),
												(c.style.overflow = "hidden"),
												e.classList.add("b-function--opened");
										}, y + h + g),
										setTimeout(function() {
											var t = p.getBoundingClientRect(),
												e = r.getBoundingClientRect(),
												n = e.x - t.x;
											(p.style.transform = "translate("
												.concat(u + n, "px, ")
												.concat(s, "px)")),
												(p.style.width = "".concat(e.width, "px")),
												b.classList.add("b-chart--active");
										}, y + h + g + 100),
										a({ to: 0, duration: 500 });
								});
						});
				}
			}
		}
		var b = document.querySelectorAll(".js-function");
		b &&
			u(b, function(t) {
				var e = t.querySelector(".js-function-chart"),
					n = t.querySelector("a");
				t.addEventListener("mouseenter", function() {
					u(b, function(t) {
						t.classList.remove("b-function--focus");
					}),
						t.classList.add("b-function--active"),
						e.classList.add("b-chart--active");
				}),
					t.addEventListener("mouseleave", function() {
						t.classList.remove("b-function--active"),
							e.classList.remove("b-chart--active");
					}),
					n.addEventListener("blur", function() {
						t.classList.remove("b-function--focus");
					}),
					t.addEventListener("keyup", function(e) {
						("tab" !== e.key.toLowerCase() && "tab" !== e.code.toLowerCase()) ||
							t.classList.add("b-function--focus");
					}),
					t.addEventListener("keydown", function(e) {
						("tab" !== e.key.toLowerCase() && "tab" !== e.code.toLowerCase()) ||
							t.classList.remove("b-function--focus");
					}),
					n.addEventListener("click", function(t) {
						t.preventDefault();
						var e = n.getAttribute("href").slice(1);
						p(e), (window.location.hash = e);
					});
			});
		var g = document.querySelector(".js-more");
		g &&
			g.addEventListener("click", function(t) {
				t.preventDefault(),
					a({
						to: document.getElementById("definition").getBoundingClientRect()
							.top,
						duration: 200
					});
			}),
			u(document.querySelectorAll(".js-goto-main"), function(t) {
				t.addEventListener("click", function(t) {
					var e, n, o, i, r;
					t.preventDefault(),
						(e = document.querySelector(".b-function--open")),
						(n = document.querySelector(f)),
						(o = document.querySelector(d)),
						(i = e.querySelector(l)),
						(r = e.querySelector(".js-function-chart")),
						o.removeAttribute("style"),
						(e.isExpand = !1),
						(i.style.transitionDuration = "".concat(y, "ms")),
						(i.style.transitionTimingFunction = e.getAttribute("data-func")),
						r.removeAttribute("style"),
						requestAnimationFrame(function() {
							n.classList.remove("b-info--evident"),
								(i.style.transform = null),
								(i.style.width = null),
								(i.style.position = null);
						}),
						setTimeout(function() {
							e.classList.remove("b-function--open", "b-function--opened"),
								o.classList.remove("b-columns--hide");
						}, 200),
						setTimeout(function() {
							(n.style.display = null), i.removeAttribute("style");
						}, 400),
						(window.location.hash = "");
				});
			});
		var h = window.location.hash.slice(1);
		h && p(h),
			window.addEventListener("resize", function() {
				var t = document.querySelector(".js-function.b-function--open");
				if (t) {
					var e = t.querySelector(l),
						n = e.parentElement,
						o = document.querySelector(f),
						i = o.querySelector(".js-info-chart"),
						r = document.querySelector(d),
						c = o.getBoundingClientRect(),
						u = r.getBoundingClientRect(),
						a = n.getBoundingClientRect(),
						s = i.getBoundingClientRect(),
						y = s.x - a.x,
						v = s.y - a.y + u.y - c.y,
						p = a.y - u.y + s.height + m;
					(e.style.transition = "none"),
						(e.style.transform = "translate("
							.concat(y, "px, ")
							.concat(v, "px)")),
						(e.style.width = "".concat(s.width, "px")),
						(r.style.height = "".concat(p, "px"));
				}
			});
	}
]);
