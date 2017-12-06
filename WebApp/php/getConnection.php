<?php
/**
 Don't forget to close the connection afterwards
 */
function getConnection(){
    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "multilogger";
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}
?>