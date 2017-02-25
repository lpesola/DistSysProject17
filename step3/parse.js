
/*

Caching is done very naively. 
Cache size is read from a field on the page. 
Default is 200. Can be changed.
Cache is an object such that 
 cache["arg1oparg2"] = result;

//cache["1+2"] = 3;
//cache["sinXXX"] = 1;

New values are written on top of the old values beginning from 0. 
Checking if an operation is in the cache is more than O(n).
*/

cache = new Object();
cache_index = [];
cache_max = 200;


/* does not parse correctly: decimal values, negatives values */
function parseExpression(expr) {
	var has_sin = expr.includes("sin");
	if (has_sin) {
		plot_sin(expr);
	} else {
/*
naive parser:
will not work if user inputs too many decimal dots
uses valid but superfluous + or - characters
or in other ways inputs ivalid expressions such as ** or // 
*/
		var input = expr.split('');
		var value = [];
		var values = [];
		var ops = [];
		for (var i = 0; i < input.length; i++) {
			var c = input[i];
			if (c == "." || jQuery.isNumeric(c)) {
				value[value.length] = c;
			} else if (c == "*" || c == "+" || c == "/") {
				ops[ops.length] = c;
				values[values.length] = value.join('');
				value = [];
			} else if (c == "-" && jQuery.isNumeric(input[i-1])) {
				ops[ops.length] = c;
				values[values.length] = value.join('');
				value = [];
			} else if (c == "-") {
				value[value.length] = c;
			} else {
				throw new Error("can't parse this");
			}
		}
		// add the last number
		values[values.length] = value.join('');
		get_results(ops, values);	
	}
	
}

/* handle operations other than plotting sin */
function get_results(ops, values) {
	//everything done	
	if(ops.length == 0) {
		// the results should be shown in another way
		$("p").prepend("Result: "+values[0]+" ");
		return "ready";	
	}
 
	var a1 = jQuery.trim(values.shift());
	var o = jQuery.trim(ops.shift());
	var a2 = values[0];

	var result = cache[a1+o+a2];
	if (result != null) {
		values[0] = result;
		get_results(ops, values);
	} else {	
		$.get("calculate.php", {arg1: a1, op: o, arg2: a2}, function( data ) {
			values[0] = jQuery.trim(data);
			cache[a1+o+a2] = values[0];
			console.log("result: "+data);
			get_results(ops, values);
		});
	}
	
}

function plot_sin(expr) {
	if (expr.includes("*")) {
		var parsed = expr.split("*");
		multiplier = parsed[0];
	} else {
		multiplier = 1;
	}
	clear_canvas();	
	for (var i = -3.14; i < 3.14; i+=0.1) {
		var cached = cache["sin"+i];
		if(cached != null) {
			draw_point(i, cached);
		} else {
			power(i, i, 3, 3);
		}
	}
	
}

// x - x^3/3! + x^5/5! - x^7/7!
// x to the power of p
// data should equal to x when calling this function
// po is p's original value so when calling this function it should be equal to p
// prevt is the value of the previous term in the series, is undefined the first time this is called
function power(data, x, p, po, prevt) {

	var cached = cache["*"+a1+x];
	if (cached != null) {
		if (p == 2) {
			factorial(po, po, cached, x, po, prevt);
		} else {
			power(cached, x, p-1, po, prevt);
		}
	} else {
		var a1 = data;
		$.get("calculate.php", {arg1: a1, op: "*", arg2: x}, function( data ) {
			if (jQuery.isNumeric(data) == false) {
				throw new Error("error multiplying in power()");
			}
			if (p == 2) {
				// we then want to calculate the factorial of p's original value
				// pow is needed in factorial() to divide pow with the factorial
				// x is needed in factorial() to draw the point to the canvas
				// the last argument is left out, because here we don't yet know the previous term: though it should be plain x
				factorial(po, po, data, x, po, prevt);
			} else {
				power(data, x, p-1, po, prevt);
			}
		}); 
	} 
}

// factorial of x; n should be equal to x when this function is called
// pow is the result of power function
// xo is the original value of x
// po is the original value of p
// pt is the value of the previous term 
function factorial(x, n, pow, xo, po, pt) {
	n = n-1;
	$.get("calculate.php", {arg1:x , op: "*", arg2: n}, function( data ) {
		if (jQuery.isNumeric(data) == false) {
			throw new Error("multiply in factorial had incorrect input data");
		}
		// first term almost calculated
		if (n == 1 && po == 3) {
			// divide pow with the result
			// call power again to calculate with 5
			$.get("calculate.php", {arg1: pow, op:"/", arg2: data}, function( data ) {
				if (jQuery.isNumeric(data) == false) {
					throw new Error("err");
				}
				$.get("calculate.php", {arg1: xo, op:"-", arg2: data}, function( data ) {
					if (jQuery.isNumeric(data) == false) {
						throw new Error("p=3, substract had incorrect arguments");
					} 
					power(xo, xo, 5, 5, data); 
				});
			});
			
		} else if (n == 1 && po == 5) {	
			// divide pow with the result
			// draw the point
			// also need to add "data" to previous term
			$.get("calculate.php", {arg1: pow, op:"/", arg2: data}, function( data ) {
				if (jQuery.isNumeric(data) == false) { 
					throw new Error("p=5, division had incorrect arguments");
				}
					//add, then call power with 7 to get the last term
					$.get("calculate.php", {arg1: pt, op:"+", arg2: data}, function( data ) {
						if (jQuery.isNumeric(data) == false) {
							throw new Error("p=5, add had incorrect arguments");
						} 
						power(xo, xo, 7, 7, data); 
					});
			});
		} else if (n == 1 && po == 7) {
			// divide pow with the result
			// draw the point
			// substract "data" from previous term
			$.get("calculate.php", {arg1: pow, op:"/", arg2: data}, function( data ) {
				if (jQuery.isNumeric(data) == false) { 
					throw new Error("p=7, division had incorrect arguments");
				}
					//substract, then draw point
					$.get("calculate.php", {arg1: pt, op:"-", arg2: data}, function( data ) {
						if (jQuery.isNumeric(data) == false) {
							throw new Error("p=5, add had incorrect arguments");
						}
						cache["sin"+xo] = data;
						draw_point(xo, data) }); 
					});	
		} else {
			factorial(data, n, pow, xo, po, pt);
		}
	});

}

/*
 * Points are scaled so that they fill the canvas nicely when multiplier is 1 or 2. 
 * Multipliers bigger or smaller than that make the plot possibly very small or so big that it won't fit on the canvas.
 * for multiplier value 1 should be so that -4 == 0 and 4 == 200 => 50 times bigger
 */

function draw_point(x, y) {
	var c = document.getElementById("plot");
	var ctx = c.getContext("2d");
	ctx.fillRect(50*x, multiplier*50*y, 2, 2);

}

// init canvas
function init_canvas() {
	var c = document.getElementById("plot");
	var w = c.width;
	var h = c.height;
	var ctx = c.getContext("2d");
	draw_axes();
	ctx.translate(w/2, h/2);
}

function clear_canvas() {
	var c = document.getElementById("plot");
	var w = c.width;
	var h = c.height;
	var ctx = c.getContext("2d");
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, 400, 400);
	draw_axes();
	ctx.translate(w/2, h/2);
}

function draw_axes() {
	var canvas = document.getElementById("plot"); 
	var ctx = canvas.getContext("2d");
	var w = canvas.width;
	var h = canvas.height;
	// draw y axis
	ctx.beginPath();
	ctx.moveTo(w/2, 0);
	ctx.lineTo(w/2, h);
	ctx.strokeStyle="LightSlateGray"
	ctx.stroke();
	// draw x axis
	ctx.beginPath();
	ctx.moveTo(0, h/2);
	ctx.lineTo(w, h/2);
	ctx.stroke();
}

function sanitize(expr) {
	// also check for other illegal characters
	return expr.replace(/ /g,'');
}
