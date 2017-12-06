<?php
include 'getConnection.php';

echo getFromDB();

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