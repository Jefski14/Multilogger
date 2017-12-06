<?php

echo getFromDB();

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

function getFromDB(){
    $arg1 = $_GET["startDateTime"];
    $arg2 = $_GET["endDateTime"];
    $conn = getConnection();
    
    $sql = "SELECT `sensorID`,`typ`,`datetime`,`value` FROM `messwerte` WHERE `datetime`>? AND `datetime`<? ORDER BY `sensorID`,`typ`,`datetime`";
    
    $fromDatetime = $arg1;
    $untilDatetime = $arg2;
    
    $stmt = $conn->stmt_init();
    $stmt->prepare($sql);
    $stmt->bind_param("ss",
        $fromDatetime,
        $untilDatetime);
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $stack = array();
    
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){            
            $arr = array('ID' => $row["sensorID"],
                'typ' => $row["typ"],
                'datetime' => $row["datetime"],
                'value' => $row["value"]);
            array_push($stack,$arr);            
        }
    }
    $conn->close();
    return json_encode($stack);
}

?>