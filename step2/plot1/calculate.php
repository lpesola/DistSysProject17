<?php 

/* PHP session is used to store history: in step 2 the cache is still server-side.
 * This script is called on submit.
 * Only print the result. 
 * Use gnuplot to plot sine.
 */

if(session_id() =='') {
	session_start();
}

$op = $_GET['op'];
$arg1 = filter_input(INPUT_GET, "arg1", FILTER_VALIDATE_FLOAT); 
$arg2 = filter_input(INPUT_GET, "arg2", FILTER_VALIDATE_FLOAT);

if ($op == "sin") {
	$plotdata = fopen("plot.data", "w");
	for ($i = -3.1412; $i<3.1412; $i+=0.1) {
		$sinx = $arg1 * approx_sine($i);
		$line = "$i\t$sinx\n";
		fwrite($plotdata, $line);
	}
	fclose($plotdata);	
	$cmd = "gnuplot sin.plot > plot.png";
	exec($cmd);
	echo "<img src=\"plot.png\">";

} else {

	if($arg1 == NULL || $arg1 == False)
		exit("invalid or no argument1");
	if($arg2 == NULL || $arg2 == False)
		exit("invalid or no argument1");

	switch ($op) {
		case "+":
			$result = $arg1 + $arg2;
			break;
		case "-":
			$result = $arg1 - $arg2;       
			break;
		case "*":
			$result = $arg1 * $arg2;
			break;
		case "/":
			$result = $arg1 / $arg2;
			break;
		default:
			exit("invalid operator");
	}

	$calculation = array($arg1, $op, $arg2, $result);

	if (!isset($_SESSION['history'])) {
		$_SESSION["history"] = array();
	} 
	array_push($_SESSION["history"], $calculation);

	echo $result;

 }

function approx_sine($x) {
// x - x^3/3! + x^5/5! - x^7/7!
	$sine = $x - (power($x, 3)/factorial(3));
	$sine = $sine + (power($x, 5)/factorial(5));
	$sine = $sine - (power($x, 7)/factorial(7));

	return $sine;
}

function power($x, $p) {
	$res = $x;
		error_log("$x to the power of $p:\n", 3, "/home/userlogs/lpesola.error");
	for ($i = 1; $i < $p; $i++) {
		$res = $res*$x;
		error_log("$res\n", 3, "/home/userlogs/lpesola.error");
	}

	error_log("$x to the power of $p = $res\n", 3, "/home/userlogs/lpesola.error");
	return $res;
}

function factorial($x) {
	$res = $x;
	for ($i = 1; $i < $x; $i++) {
		$res = $i * $res;
	}

	error_log("factorial of $x is $res\n", 3, "/home/userlogs/lpesola.error");
	return $res;
}

?>

