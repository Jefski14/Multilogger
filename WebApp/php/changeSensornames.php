<?php
/**
 * Change the name which is associated to the sensor ID
 *
 * If the ID is not in use, this function doesn't change anything
 * @param ID des Sensors $sensorID
 * @param Neuer Name für diesen Sensor $newName
 *
 */
function changeSensorName($sensorID,$newName){
    
    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "multilogger";
    
    // Create connection
    $conn =  new mysqli($servername, $username,$password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // UPDATE `sensornames` SET `Name`='test' WHERE `sensorID`=900
    $sql = "UPDATE `sensornames` SET `Name`=? WHERE `sensorID`=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $Name,$sensor_ID);
    
    
    $Name = $newName;
    $sensor_ID = $sensorID;
    $stmt->execute();
    
    echo "New records created successfully";
    
    $stmt->close();
    $conn->close();
}

//changeSensorName(900, "Neuer Name des Sensors");

?>