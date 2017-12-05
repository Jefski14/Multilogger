<?php

	echo 'Hello world';
	print('<br>');
	
	//$str = 'one,two,three,four';
	$str = $_SERVER['QUERY_STRING'];
	$args = explode(",",$str);
	print(count($args));
	print('<br>');
	// zero limit
	print_r(explode(',',$str,0));
	print('<br>');

	// positive limit
	print_r(explode(',',$str,2));
	print('<br>');

	// negative limit 
	print_r(explode(',',$str,-1));
	print('<br>');
?>