
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
	$.get("calculate.php", {arg1: multiplier, op: "sin"}, function( data ) {
		if ($("img").length) {
			$("img").replaceWith(data);
			console.log("replace old img");
		} else {
			$("#result").append(data);
			console.log("append img");	
		}
	});
}

function sanitize(expr) {
	// also check for other illegal characters
	return expr.replace(/ /g,'');
}
