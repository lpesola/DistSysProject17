
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
		var multiplier = parsed[0];
	} else {
		var multiplier = 1;
	}	
	var c = document.getElementById("plot");
	var w = c.width;
	var h = c.height;
	var ctx = c.getContext("2d");	
	draw_axes(ctx, multiplier);
	ctx.translate(w/2, h/2);
	draw_point(ctx, 0, 0);
	ctx.scale(6, 6);
	// multiply by 10 to make large enough for canvas
	for (var i = -3.14; i < 3.14; i+=0.1) {
		draw_point(ctx, i*10, multiplier*(Math.sin(i))*10);
	}

}

function draw_point(canvas, x, y) {
	canvas.fillRect(x, y, 0.5, 0.5);

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
	ctx.font = "12px Arial";


}

function sanitize(expr) {
	// also check for other illegal characters
	return expr.replace(/ /g,'');
}
