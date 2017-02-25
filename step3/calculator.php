<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>A simple calculator: step 1</title>
		<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
		<script src="parse.js"></script>
		<script>
			$(document).ready(function() {
				init_canvas();
		
				$("#calc").click(function() {
					submit();	
				});

				$("#simplify").click(function() {
					simplify_expression();	
				}); 

				$("#save").click(function() {
					change_cache($("#cachesize").val());	
				}); 
			});
		
	</script>

	</head>
	<body>


	<div id="calculator" style="float:top;">
		<input type="text" id="expr">
		<button id="calc"> Submit </button>
		<button id="simplify"> Simplify </button>
	</div>
	<div id="cache" style="float:top;">
		<input type="text" id="cachesize" placeholder="200">
		<button id="save"> Change cache size </button>
	</div>

	<div id="result" style="float:bottom;background-color:grey;color:white;padding:10px">
		<p></p>
		<canvas id="plot" width="400" height="400" style="background-color:white;"></canvas>
	</div>

	</body>
</html>
