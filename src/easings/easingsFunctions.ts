const pow = Math.pow;
const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = ( 2 * PI ) / 3;
const c5 = ( 2 * PI ) / 4.5;

function bounceOut(x: number) {
	const n1 = 7.5625;
	const d1 = 2.75;

	if ( x < 1 / d1 ) {
		return n1 * x * x;
	} else if ( x < 2 / d1 ) {
		return n1 * (x -= (1.5 / d1)) * x + .75;
	} else if ( x < 2.5 / d1 ) {
		return n1 * (x -= (2.25 / d1)) * x + .9375;
	} else {
		return n1 * (x -= (2.625 / d1)) * x + .984375;
	}
}

const easingsFunctions: any = {
	easeInQuad(x: number) {
		return x * x;
	},
	easeOutQuad(x: number) {
		return 1 - ( 1 - x ) * ( 1 - x );
	},
	easeInOutQuad(x: number) {
		return x < 0.5 ?
			2 * x * x :
			1 - pow( -2 * x + 2, 2 ) / 2;
	},
	easeInCubic(x: number) {
		return x * x * x;
	},
	easeOutCubic(x: number) {
		return 1 - pow( 1 - x, 3 );
	},
	easeInOutCubic(x: number) {
		return x < 0.5 ?
			4 * x * x * x :
			1 - pow( -2 * x + 2, 3 ) / 2;
	},
	easeInQuart(x: number) {
		return x * x * x * x;
	},
	easeOutQuart(x: number) {
		return 1 - pow( 1 - x, 4 );
	},
	easeInOutQuart(x: number) {
		return x < 0.5 ?
			8 * x * x * x * x :
			1 - pow( -2 * x + 2, 4 ) / 2;
	},
	easeInQuint(x: number) {
		return x * x * x * x * x;
	},
	easeOutQuint(x: number) {
		return 1 - pow( 1 - x, 5 );
	},
	easeInOutQuint(x: number) {
		return x < 0.5 ?
			16 * x * x * x * x * x :
			1 - pow( -2 * x + 2, 5 ) / 2;
	},
	easeInSine(x: number) {
		return 1 - cos( x * PI / 2 );
	},
	easeOutSine(x: number) {
		return sin( x * PI / 2 );
	},
	easeInOutSine(x: number) {
		return -( cos( PI * x ) - 1 ) / 2;
	},
	easeInExpo(x: number) {
		return x === 0 ? 0 : pow( 2, 10 * x - 10 );
	},
	easeOutExpo(x: number) {
		return x === 1 ? 1 : 1 - pow( 2, -10 * x );
	},
	easeInOutExpo(x: number) {
		return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ?
			pow( 2, 20 * x - 10 ) / 2 :
			( 2 - pow( 2, -20 * x + 10 ) ) / 2;
	},
	easeInCirc(x: number) {
		return 1 - sqrt( 1 - pow( x, 2 ) );
	},
	easeOutCirc(x: number) {
		return sqrt( 1 - pow( x - 1, 2 ) );
	},
	easeInOutCirc(x: number) {
		return x < 0.5 ?
			( 1 - sqrt( 1 - pow( 2 * x, 2 ) ) ) / 2 :
			( sqrt( 1 - pow( -2 * x + 2, 2 ) ) + 1 ) / 2;
	},
	easeInBack(x: number) {
		return c3 * x * x * x - c1 * x * x;
	},
	easeOutBack(x: number) {
		return 1 + c3 * pow( x - 1, 3 ) + c1 * pow( x - 1, 2 );
	},
	easeInOutBack(x: number) {
		return x < 0.5 ?
			( pow( 2 * x, 2 ) * ( ( c2 + 1 ) * 2 * x - c2 ) ) / 2 :
			( pow( 2 * x - 2, 2 ) * ( ( c2 + 1 ) * ( x * 2 - 2 ) + c2 ) + 2 ) / 2;
	},
	easeInElastic(x: number) {
		return x === 0 ? 0 : x === 1 ? 1 :
			-pow( 2, 10 * x - 10 ) * sin( ( x * 10 - 10.75 ) * c4 );
	},
	easeOutElastic(x: number) {
		return x === 0 ? 0 : x === 1 ? 1 :
			pow( 2, -10 * x ) * sin( ( x * 10 - 0.75 ) * c4 ) + 1;
	},
	easeInOutElastic(x: number) {
		return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ?
			-( pow( 2, 20 * x - 10 ) * sin( ( 20 * x - 11.125 ) * c5 )) / 2 :
			pow( 2, -20 * x + 10 ) * sin( ( 20 * x - 11.125 ) * c5 ) / 2 + 1;
	},
	easeInBounce(x: number) {
		return 1 - bounceOut( 1 - x );
	},
	easeOutBounce: bounceOut,
	easeInOutBounce(x: number) {
		return x < 0.5 ?
			( 1 - bounceOut( 1 - 2 * x ) ) / 2 :
			( 1 + bounceOut( 2 * x - 1 ) ) / 2;
	},
};

export default easingsFunctions;
