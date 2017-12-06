<?php

include 'getConnection.php';

// multilogger.php
// benötigt 6 Variablen, getrennt mittels '&'-Zeichen:
// zum Beispiel: abcdef&&$d&&$t&&$i&&$v
// URL: insertData.php?abcdef&10%2D11%2D2017&14%3A18&1234&12%2E300&1
// Argument 0 = 'password' (abcdef)
// Argument 1 = $d  Datum
// Argument 2 = $t  Zeit
// Argument 3 = $i  Sensor-Identifier
// Argument 4 = $v  Sensor Wert
// Argument 5 = $q  Sensor Typ

$args = explode ("&",$_SERVER['QUERY_STRING']);
$nargs = count($args);

if ($nargs != 6)
{
    echo "Zu wenig Parameter im GET";
    die();
}
if ($args[0] != "abcdef")
{
    echo "Falsches Passwort";
    die();
}

$date     = urldecode($args[1]);
$time     = urldecode($args[2]);
$sensorID = urldecode($args[3]);
$value    = urldecode($args[4]);
$typ      = urldecode($args[5]);

$date = str_replace("'", " ", $date);
$time = str_replace("'", " ", $time);
$device  = str_replace("'", " ", $device);
$temperature = str_replace("'", " ", $temperature);

$dateFormated = explode('-', $date);
$datetime = $dateFormated[2].'-'.$dateFormated[1].'-'.$dateFormated[0]. " ".$time;

// parse multilogger data-format to mysql date format
if($datetime[5]== " "){
    $datetime[5]="0";
}
if($datetime[8]== " "){
    $datetime[8]="0";
}


$conn = getConnection();


// prepare and bind
$sql = "INSERT INTO `messwerte`(`value`, `sensorID`, `typ`, `datetime`) VALUES (?,?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("diis", $value, $sensorID, $typ,$datetime);
$stmt->execute();


$stmt->close();
$conn->close();
?>