<?php 

/* PHP session is used to store history: in step 1 cache is server-side.
 * This script is called on submit.
 * Only print the result. 
 */

if(session_id() =='') {
	session_start();
}

$arg1 = filter_input(INPUT_GET, "arg1", FILTER_VALIDATE_FLOAT); 
$arg2 = filter_input(INPUT_GET, "arg2", FILTER_VALIDATE_FLOAT);
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

if (!isset($_SESSION['history'])) {
	$_SESSION["history"] = array();
} 
array_push($_SESSION["history"], $calculation);

echo $result;
?>

