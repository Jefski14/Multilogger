<?php 
	// multilogger.php 
	// benötigt 6 Variablen, getrennt mittels '&'-Zeichen:
	// zum Beispiel: abcdef&&$d&&$t&&$i&&$v
	// Argument 0 = 'password' (abcdef)
	// Argument 1 = $d  Datum 
	// Argument 2 = $t  Zeit 
	// Argument 3 = $i  Sensor-Identifier
	// Argument 4 = $v  Sensor Wert
	//http://localhost/multilogger.php?abcdef&$d=60&$t&$i&$v
	$args = explode ("&", $_SERVER['QUERY_STRING'] );
	$nargs = count($args);
	print_r($args);
	
	if ($nargs != 5)
	{ 
		die("Wrong number of args");
	} 
	if ($args[0] != "abcdef")
	{ 
		die("Wrong password!"); 
	}
	print('<br>');
	print('Hier Decode: ');
	print(urldecode($args[1]));
	print($args[1]);
	
	
	/*
	$date     = urldecode($args[1])  ;
	$time     = urldecode($args[2])  ;
	$device     = urldecode($args[3]);
	$temperature = urldecode($args[4]);
	$date = str_replace("'", " ", $date);
	$time = str_replace("'", " ", $time);
	$device  = str_replace("'", " ", $device);
	$temperature = str_replace("'", " ", $temperature); 
	// Daten Speichern
	$db = mysql_connect('server', 'user', 'password');
	$result = mysql_select_db('database_name', $db); 
	$result = mysql_query("delete from temperature where (device ='$device')"); 
	$result = mysql_query("INSERT INTO temperature (logdate, logtime, device, temperature)
	VALUES ('$date', '$time', '$device', '$temperature'  )", $db);
	$result = mysql_close($db);*/ 
?>
