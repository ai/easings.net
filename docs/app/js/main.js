!(function(t) {
	var n = {};
	function e(i) {
		if (n[i]) return n[i].exports;
		var o = (n[i] = { i: i, l: !1, exports: {} });
		return t[i].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
	}
	(e.m = t),
		(e.c = n),
		(e.d = function(t, n, i) {
			e.o(t, n) || Object.defineProperty(t, n, { enumerable: !0, get: i });
		}),
		(e.r = function(t) {
			"undefined" != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(t, "__esModule", { value: !0 });
		}),
		(e.t = function(t, n) {
			if ((1 & n && (t = e(t)), 8 & n)) return t;
			if (4 & n && "object" == typeof t && t && t.__esModule) return t;
			var i = Object.create(null);
			if (
				(e.r(i),
				Object.defineProperty(i, "default", { enumerable: !0, value: t }),
				2 & n && "string" != typeof t)
			)
				for (var o in t)
					e.d(
						i,
						o,
						function(n) {
							return t[n];
						}.bind(null, o)
					);
			return i;
		}),
		(e.n = function(t) {
			var n =
				t && t.__esModule
					? function() {
							return t.default;
					  }
					: function() {
							return t;
					  };
			return e.d(n, "a", n), n;
		}),
		(e.o = function(t, n) {
			return Object.prototype.hasOwnProperty.call(t, n);
		}),
		(e.p = ""),
		e((e.s = 12));
})([
	function(t, n, e) {
		var i = e(4),
			o = e(10),
			r = "[object AsyncFunction]",
			a = "[object Function]",
			u = "[object GeneratorFunction]",
			s = "[object Proxy]";
		t.exports = function(t) {
			if (!o(t)) return !1;
			var n = i(t);
			return n == a || n == u || n == r || n == s;
		};
	},
	function(t, n, e) {
		var i = e(5).Symbol;
		t.exports = i;
	},
	function(t, n, e) {
		var i, o, r;
		(o = [n]),
			void 0 ===
				(r =
					"function" ==
					typeof (i = function(t) {
						"use strict";
						Object.defineProperty(t, "__esModule", { value: !0 });
						var n = (function() {
								function t(t, n) {
									for (var e = 0; e < n.length; e++) {
										var i = n[e];
										(i.enumerable = i.enumerable || !1),
											(i.configurable = !0),
											"value" in i && (i.writable = !0),
											Object.defineProperty(t, i.key, i);
									}
								}
								return function(n, e, i) {
									return e && t(n.prototype, e), i && t(n, i), n;
								};
							})(),
							e = (function() {
								function t(n, e) {
									!(function(t, n) {
										if (!(t instanceof n))
											throw new TypeError("Cannot call a class as a function");
									})(this, t),
										(this._target = null),
										(this._padding = 0),
										(this._align = this.ALIGN_TOP),
										(this._onFinish = function() {}),
										(this._easing = this.EASING_EFFECTS[
											this.DEFAULT_EASING_EFFECT
										]),
										(this._duration = 200),
										this._configuration(n, e || {}),
										this._run();
								}
								return (
									n(t, [
										{
											key: "DEFAULT_EASING_EFFECT",
											get: function() {
												return "linear";
											}
										},
										{
											key: "EASING_EFFECTS",
											get: function() {
												return {
													linear: function(t) {
														return t;
													},
													easeInQuad: function(t) {
														return Math.pow(t, 2);
													},
													easeOutQuad: function(t) {
														return t * (2 - t);
													},
													easeInOutQuad: function(t) {
														return t < 0.5
															? 2 * Math.pow(t, 2)
															: (4 - 2 * t) * t - 1;
													},
													easeInCubic: function(t) {
														return Math.pow(t, 3);
													},
													easeOutCubic: function(t) {
														return --t * Math.pow(t, 2) + 1;
													},
													easeInOutCubic: function(t) {
														return t < 0.5
															? 4 * Math.pow(t, 3)
															: (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
													},
													easeInQuart: function(t) {
														return Math.pow(t, 4);
													},
													easeOutQuart: function(t) {
														return 1 - --t * Math.pow(t, 3);
													},
													easeInOutQuart: function(t) {
														return t < 0.5
															? 8 * Math.pow(t, 4)
															: 1 - 8 * --t * Math.pow(t, 3);
													},
													easeInQuint: function(t) {
														return Math.pow(t, 5);
													},
													easeOutQuint: function(t) {
														return 1 + --t * Math.pow(t, 4);
													},
													easeInOutQuint: function(t) {
														return t < 0.5
															? 16 * Math.pow(t, 5)
															: 1 + 16 * --t * Math.pow(t, 4);
													}
												};
											}
										},
										{
											key: "ALIGN_CENTER",
											get: function() {
												return "center";
											}
										},
										{
											key: "ALIGN_BOTTOM",
											get: function() {
												return "bottom";
											}
										},
										{
											key: "ALIGN_TOP",
											get: function() {
												return "top";
											}
										}
									]),
									n(t, [
										{
											key: "_configuration",
											value: function(t, n) {
												(this._target =
													"string" == typeof t ? document.querySelector(t) : t),
													void 0 !== n.padding &&
														n.padding >= 0 &&
														(this._padding = n.padding),
													void 0 !== n.align && (this._align = n.align),
													"function" == typeof n.onFinish &&
														(this._onFinish = n.onFinish),
													void 0 !== n.easing &&
														void 0 !== this.EASING_EFFECTS[n.easing] &&
														(this._easing = this.EASING_EFFECTS[n.easing]),
													void 0 !== n.duration &&
														n.duration >= 0 &&
														(this._duration = n.duration);
											}
										},
										{
											key: "_run",
											value: function() {
												var t = document.documentElement,
													n = t.clientHeight,
													e =
														void 0 !== window.scrollMaxY
															? window.scrollMaxY
															: t.scrollHeight - n,
													i = window.pageYOffset,
													o = isNaN(this._target) ? i : this._target,
													r = isNaN(this._target)
														? this._target.getBoundingClientRect()
														: 0;
												this._align === this.ALIGN_CENTER
													? ((o += isNaN(this._target)
															? r.top + r.height / 2
															: this._target),
													  (o -= n / 2),
													  (o -= this._padding))
													: this._align === this.ALIGN_BOTTOM
														? ((o += r.bottom || this._target),
														  (o -= n),
														  (o += this._padding))
														: ((o += r.top || this._target),
														  (o -= this._padding));
												var a = (o = Math.max(Math.min(e, o), 0)) - i,
													u = {
														targetY: o,
														deltaY: a,
														duration: this._duration,
														easing: this._easing,
														onFinish: this._onFinish,
														startTime: Date.now(),
														lastY: i,
														step: function() {
															if (
																this.deltaY > 0
																	? this.targetY <= this.lastY
																	: this.targetY >= this.lastY
															)
																this.onFinish();
															else {
																var t = Math.min(
																		(Date.now() - this.startTime) /
																			this.duration,
																		1
																	),
																	n =
																		this.targetY -
																		(1 - this.easing(t)) * this.deltaY;
																window.scrollTo(window.scrollX, n),
																	1 !== t
																		? ((this.lastY = window.pageYOffset),
																		  window.requestAnimationFrame(
																				this.step.bind(this)
																		  ))
																		: this.onFinish();
															}
														}
													};
												window.requestAnimationFrame(u.step.bind(u));
											}
										}
									]),
									t
								);
							})();
						t.default = e;
					})
						? i.apply(n, o)
						: i) || (t.exports = r);
	},
	function(t, n, e) {
		var i = e(0),
			o = e(11);
		t.exports = function(t) {
			return null != t && o(t.length) && !i(t);
		};
	},
	function(t, n, e) {
		var i = e(1),
			o = e(8),
			r = e(9),
			a = "[object Null]",
			u = "[object Undefined]",
			s = i ? i.toStringTag : void 0;
		t.exports = function(t) {
			return null == t
				? void 0 === t ? u : a
				: s && s in Object(t) ? o(t) : r(t);
		};
	},
	function(t, n, e) {
		var i = e(6),
			o = "object" == typeof self && self && self.Object === Object && self,
			r = i || o || Function("return this")();
		t.exports = r;
	},
	function(t, n, e) {
		(function(n) {
			var e = "object" == typeof n && n && n.Object === Object && n;
			t.exports = e;
		}.call(this, e(7)));
	},
	function(t, n) {
		var e;
		e = (function() {
			return this;
		})();
		try {
			e = e || new Function("return this")();
		} catch (t) {
			"object" == typeof window && (e = window);
		}
		t.exports = e;
	},
	function(t, n, e) {
		var i = e(1),
			o = Object.prototype,
			r = o.hasOwnProperty,
			a = o.toString,
			u = i ? i.toStringTag : void 0;
		t.exports = function(t) {
			var n = r.call(t, u),
				e = t[u];
			try {
				t[u] = void 0;
				var i = !0;
			} catch (t) {}
			var o = a.call(t);
			return i && (n ? (t[u] = e) : delete t[u]), o;
		};
	},
	function(t, n) {
		var e = Object.prototype.toString;
		t.exports = function(t) {
			return e.call(t);
		};
	},
	function(t, n) {
		t.exports = function(t) {
			var n = typeof t;
			return null != t && ("object" == n || "function" == n);
		};
	},
	function(t, n) {
		var e = 9007199254740991;
		t.exports = function(t) {
			return "number" == typeof t && t > -1 && t % 1 == 0 && t <= e;
		};
	},
	function(t, n, e) {
		"use strict";
		e.r(n);
		var i = e(2),
			o = e.n(i),
			r = e(3),
			a = e.n(r),
			u = e(0),
			s = e.n(u);
		function c(t, n) {
			t && a()(t) && s()(n) && Array.prototype.slice.call(t).forEach(n);
		}
		var f = document.querySelectorAll(".js-function");
		f &&
			c(f, function(t) {
				t.addEventListener("mouseenter", function() {
					var n = t.querySelector(".js-function-chart"),
						e = n.getAttribute("data-length");
					c(f, function(t) {
						return t.classList.add("b-function--inactive");
					}),
						t.classList.remove("b-function--inactive"),
						t.classList.add("b-function--active"),
						n.classList.add("b-chart--active"),
						(t.querySelector(
							".js-function-dot"
						).style.strokeDashoffset = "-".concat(e || 0));
				}),
					t.addEventListener("mouseleave", function() {
						c(f, function(t) {
							return t.classList.remove("b-function--inactive");
						}),
							t.classList.remove("b-function--active"),
							t
								.querySelector(".js-function-chart")
								.classList.remove("b-chart--active"),
							(t.querySelector(
								".js-function-dot"
							).style.strokeDashoffset = null);
					});
			});
		var l = document.querySelector(".js-more");
		l &&
			l.addEventListener("click", function(t) {
				t.preventDefault(),
					new o.a("#definition", {
						duration: 200,
						easing: "ease",
						padding: 0,
						align: "top"
					});
			});
	}
]);
