<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>A simple calculator...</title>
	</head>
	<body>
<?php 

session_start();

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

if (!isset($_SESSION['history'])) {
	$_SESSION["history"] = array();
}
 
array_push($_SESSION["history"], $calculation);

echo "<aside style=\"background-color:grey;color:white;padding:10px;float=right;\">\n";
foreach($_SESSION["history"] as &$calc) {
	echo "$calc[0] $calc[1] $calc[2] = $calc[3] <br />\n";
}
echo "</aside>\n";

include("calculator.html");
?>

</body>
</html>
