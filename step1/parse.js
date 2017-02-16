
function parseExpression(expr) {
	var ops = expr.split(/\d+/);
	ops = ops.slice(1,ops.length);
	var values= expr.split(/[*+-/]/);
	getResults(ops, values);	
	
}

function getResults(ops, values) {
	var a1 = values.shift();
	var o = ops.shift();
	var a2 = values[0];
	$.get("calculate.php", {arg1: a1, op: o, arg2: a2}, function( data ) {
		values[0] = data;
		console.log("result: "+data);
		console.log("next up: "+values[0]+ops[0]+values[1]);
		if(ops.length != 0) {
			getResults(ops, values);
		} else {
			location.reload();
		}
	}
	);
	
}

function sanitize(expr) {
	// also check for other illegal characters
	return expr.replace(/ /g,'');
}
