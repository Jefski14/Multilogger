$(document).ready(getData());

function getData(){
    $.ajax( {
        url: "http://localhost/WebApp/html/ajaxtest.php",
        method: "GET",
        success: function(data) {
            jdata = JSON.parse(data);
            var test = structureData(jdata);
            console.log(test);
            var time = [];

            for(var i in jdata) {
                time.push(jdata[i].datetime);
            }

            var chartdata = {
                labels: time,
                datasets: [
                    {
                        label: test[197964].sID,
                        backgroundColor: 'rgba(200,200,200,0.75)',
                        borderColor: 'rgba(200,200,200,0.75)',
                        hoverBackgroundColor: 'rgba(200,200,200,1)',
                        hoverBorderColor: 'rgba(200,200,200,1)',
                        data: test[197964][1],
                    }
                ]
            };

            var config = {
                type: 'line',
                data: chartdata
            }
            var ctx =  document.getElementById("mycanvas").getContext("2d")
            var barGraph = new Chart(ctx,config )

        },
        error: function(data) {
            console.log(data);
        }
    })
}

function structureData(sensorData) {
    var dataArray = [];
    var currentID = sensorData[0].ID;
    var currentType = sensorData[0].typ;
    dataArray[currentID] = [];
    dataArray[currentID].sID = currentID;
    dataArray[currentID][currentType] = [];

    for(var i in sensorData) {
        if(currentID == sensorData[i].ID) {
            if(currentType == sensorData[i].typ) {
                dataArray[currentID][currentType].push(sensorData[i].value);
            }
            else {
                currentType = sensorData[i].typ;
                dataArray[currentID][currentType] = [];
            }
        }
        else {
            currentID = sensorData[i].ID;
            currentType = sensorData[i].typ;
            dataArray[currentID].sID = currentID;
        }
    }
    return dataArray;
}