<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>A simple calculator: step 1</title>
		<link rel="stylesheet" type="text/css" href="../../style.css">
		<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
		<script src="parse.js"></script>
		<script>
			$(document).ready(function() {
		
				$("#calc").click(function(){
					parseExpression(sanitize($("#expr").val()));	
				});
			});
		
	</script>

	</head>
	<body>
<?php 
	include("../../links");
?>

	<div id="calculator" style="float:top;">
		<input type="text" id="expr">
		<button id="calc"> Click! </button>
	</div>
	<div id="result">
<?php
	session_start();
	$calc = end($_SESSION["history"]);
	echo "$calc[0] $calc[1] $calc[2] = $calc[3] <br />\n";


?>

<canvas id="plot" width="400" height="400" style="background-color:white;"></canvas>

	</div>

	</body>
</html>
