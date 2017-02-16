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


	<div id="calculator" style="float:left;">
		<input type="text" id="expr">
		<button id="calc"> Click! </button>
	</div>

	</body>
</html>
