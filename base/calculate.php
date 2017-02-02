<?php 

session_start();
$_SESSION["history"] = array();

$arg1 = filter_input(INPUT_GET, "arg1", FILTER_VALIDATE_INT);
$arg2 = filter_input(INPUT_GET, "arg2", FILTER_VALIDATE_INT);
$op = $_GET['op'];

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
array_push($_SESSION["history"], $calculation);

echo "<div style=\"background-color:grey;color:white;padding:20px;\">";
/*foreach($_SESSION["history"] as &$calc) {
	echo "$calc[0] $calc[1] $calc[2] = $calc[3] <br />";
}*/
echo "$arg1 $op $arg2 = $result";
echo "</div>";

include("calculator.html");

?>
