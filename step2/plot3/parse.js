/* does not parse correctly: decimal values, negatives values */
function parseExpression(expr) {
	var has_sin = expr.includes("sin");
	if (has_sin) {
		plot_sin(expr);
	} else {
		var ops = expr.split(/\d+/);
		ops = ops.slice(1,ops.length);
		var values= expr.split(/[*+-/]/);
		get_results(ops, values);	
	}
	
}

function get_results(ops, values) {
	var a1 = values.shift();
	var o = ops.shift();
	var a2 = values[0];
	$.get("calculate.php", {arg1: a1, op: o, arg2: a2}, function( data ) {
		values[0] = data;
		console.log("result: "+data);
		console.log("next up: "+values[0]+ops[0]+values[1]);
		if(ops.length != 0) {
			get_results(ops, values);
		} else {
			location.reload();	
		}
	});
	
}

function plot_sin(expr) {
	if (expr.includes("*")) {
		var parsed = expr.split("*");
		multiplier = parsed[0];
	} else {
		multiplier = 1;
	}
	
	var c = document.getElementById("plot");
	var w = c.width;
	var h = c.height;
	var ctx = c.getContext("2d");	
	draw_axes(ctx, multiplier);
	ctx.translate(w/2, h/2);
	ctx.scale(6, 6);
	power(2, 2, 3, 3);
	for (var i = -3.14; i < 3.14; i+=0.1) {
		power(i, i, 3, 3);
	}
	
}



function draw_point(x, y) {
// coordinates should be increased so that they fit in the plot in a way that makes sense
// now with no multipliers the graph is very small	
	var c = document.getElementById("plot");
	var ctx = c.getContext("2d");
	var w = c.width;
	var step = w / 8;
	var sine = multiplier * (x - y);	
	ctx.fillRect(10*x, sine, 0.5, 0.5);

}



// x - x^3/3! + x^5/5! - x^7/7!
// x to the power of p
// data should equal to x when calling this function
// po is p's original value so when calling this function it should be equal to p
// prevt is the value of the previous term in the series, is undefined the first time this is called
function power(data, x, p, po, prevt) {
	$.get("calculate.php", {arg1: data, op: "*", arg2: x}, function( data ) {
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
				power(xo, xo, 5, 5, data);
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
					power(xo, xo, 7, 7, data); });
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
					$.get("calculate.php", {arg1: pt, op:"+", arg2: data}, function( data ) {
						if (jQuery.isNumeric(data) == false) {
							throw new Error("p=5, add had incorrect arguments");
						} 
						draw_point(xo, data) }); 
					});	
		} else {
			factorial(data, n, pow, xo, po, pt);
		}
	});

}


function sanitize(expr) {
	// also check for other illegal characters
	return expr.replace(/ /g,'');
}

function draw_axes(ctx, maxh) {
	var canvas = document.getElementById("plot"); 
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
	// maybe add scales or lines

	}


}
