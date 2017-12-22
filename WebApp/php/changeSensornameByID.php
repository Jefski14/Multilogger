<?php
include 'changeSensornames.php';
$id = $_GET["ID"];
$name = $_GET["Name"];

changeSensorName($id,$name);
echo getSensorNames();
?>