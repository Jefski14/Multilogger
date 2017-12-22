<?php
include 'getConnection.php';


/**
 * Change the name which is associated to the sensor ID
 *
 * If the ID is not in use, this function doesn't change anything
 * @param ID des Sensors $sensorID
 * @param Neuer Name f�r diesen Sensor $newName
 *
 */
function changeSensorName($sensorID,$newName){
    
    $conn = getConnection();
    $sql = "UPDATE `sensornames` SET `Name`=? WHERE `sensorID`=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $Name,$sensor_ID);
    
    $Name = $newName;
    $sensor_ID = $sensorID;
    $stmt->execute();
        
    $stmt->close();
    $conn->close();
}

/**
 * Change the name which is associated to the sensor ID
 *
 * If the ID is not in use, this function doesn't change anything
 * @param ID des Sensors $sensorID
 * @param Neuer Name f�r diesen Sensor $newName
 *
 */
function createSensorName($sensorID,$newName){

    $conn = getConnection();
    $sql = "INSERT INTO `sensornames` (`sensorID`, `Name`) VALUES (?,?);";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si",$sensor_ID,$Name);

    $Name = $newName;
    $sensor_ID = $sensorID;
    $stmt->execute();

    $stmt->close();
    $conn->close();
}


/**
 * Change the name which is associated to the sensor name
 *
 * If the name is not in use, this function doesn't change anything
 * @param Name des Sensors $oldName
 * @param Neuer Name f�r diesen Sensor $newName
 *
 */
function changeSensorNameByName($oldName,$newName){
    
    $conn = getConnection();  
    $sql = "UPDATE `sensornames` SET `Name`=? WHERE `Name`=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $Name,$sensor_Name);
       
    $Name = $newName;
    $sensor_Name = $oldName;
    $stmt->execute();  
    
    $stmt->close();
    $conn->close();
}


function getSensorNames(){
    $conn = getConnection();
    $sql = "SELECT `sensorID`,`Name` FROM `sensornames`";
    $stmt = $conn->stmt_init();
    $stmt->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $stack = array();
    
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $arr = array('ID' => $row["sensorID"],
                'Name' => $row["Name"]);
            array_push($stack,$arr);
        }
    }
    $conn->close();
    return json_encode($stack);
}

//changeSensorName(900, "Neuer Name des Sensors");

?>