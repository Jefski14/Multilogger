<?php

$code = getFromDB();
echo $code;

/**
Don't forget to close the connection afterwards
 */
function getConnection(){
    $servername = "localhost";
    $username = "root";
    $password = "root";
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
    $conn = getConnection();

    $sql = "SELECT `sensorID` ,`datetime`,`value`,`typ` FROM `messwerte` WHERE `datetime`>? AND `datetime`<? ORDER BY  `sensorID`, `typ`, `datetime`";

    $fromDatetime='0000-00-00 00:00:00';
    $untilDatetime='2040-01-01 23:59:59';
    //$sensorID=197964;
    //$sensorTyp=1;

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
            // echo "Date: ".$row["datetime"]. "Wert: ". $row["value"]."<br/>";

            $arr = array('ID' => $row["sensorID"], 'typ' => $row["typ"], 'datetime' => $row["datetime"], 'value' => $row["value"]);
            array_push($stack,$arr);
            //array_push($stack,json_encode($arr));

        }
    }
    $conn->close();
    //echo json_encode($stack);
    return json_encode($stack);
}

?>