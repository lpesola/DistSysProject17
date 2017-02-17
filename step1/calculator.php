<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>A simple calculator: step 1</title>
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


	<aside style="background-color:grey;color:white;padding:10px;float:right;width:50%;">
<?php
	session_start();
	foreach($_SESSION["history"] as &$calc) {
		echo "$calc[0] $calc[1] $calc[2] = $calc[3] <br />\n";
	}

?>
	</aside>
	<div id="calculator" style="float:left;">
		<input type="text" id="expr">
		<button id="calc"> Click! </button>
	</div>

	</body>
</html>
