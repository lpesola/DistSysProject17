<?php 

/* PHP session is used to store history: in step 1 cache is server-side.
 * This script is called on submit.
 * Only print the result. 
 */

if(session_id() =='') {
	session_start();
}

$op = $_GET['op'];
$arg1 = filter_input(INPUT_GET, "arg1", FILTER_VALIDATE_INT); 
$arg2 = filter_input(INPUT_GET, "arg2", FILTER_VALIDATE_INT);

if ($op == "sin") {
	$plotdata = fopen("plot.data", "w");
	for ($i = -3.1412; $i<3.1412; $i+=0.1) {
		$sine = $arg1 * sin($i);
		$line = "$i\t$sine\n";
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
?>

