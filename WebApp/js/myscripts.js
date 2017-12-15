function generateConfig(titleId) {

    document.getElementById(titleId).innerHTML = "Data from " + getNiceDate();
    var time = [];
    var dummydata1 = [5, 5, 6, 10.15, 12, 3, -5, -4, 0, 0, 4, 6, 7, 8, 12];
    var dummydata2 = [5, 8, 6, 10.01, 13, 3, -1, 15];
    for (var i = 0; i < 24; i++) {
        time.push(i.toString());
    }
    var config = {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: "Sensor1",
                backgroundColor: window.chartColors.orange,
                borderColor: window.chartColors.orange,
                data: dummydata1,
                fill: false
            }, {
                label: "Sensor2",
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: dummydata2
            }]
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Data from ' + getNiceDate()
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    }
    return config;
}

function genGraph() {
    var ctx = document.getElementById("currentData").getContext("2d");
    window.myLine = new Chart(ctx, generateConfig("currentDataTitle"));
}

function getNiceDate() {
    var today = new Date();
    return today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
}

function defaultDate(datePickerID) {
    document.getElementById(datePickerID).valueAsDate = new Date();
}

function getCurrentTime() {
    var date = new Date();
    var currentTime = date.getHours() + ':' + lead(date.getMinutes());
    return currentTime;
}

function lead(number) {
    return (number < 10 ? '0' : '') + number;
}

function calcAvg(type) {
    var avg = [];
    for (var i = 0; i < window.myLine.config.data.datasets.length; i++) {
        for (var j = 0; j < window.myLine.config.data.datasets[i].data.length; j++) {
            if (i == 0) {
                avg[j] = window.myLine.config.data.datasets[i].data[j];
            }
            else {
                avg[j] = parseFloat(avg[j]) + parseFloat(window.myLine.config.data.datasets[i].data[j]);
            }
        }
    }
    for (var i = 0; i < avg.length; i++) {
        avg[i] = avg[i] / window.myLine.config.data.datasets.length;
    }

    return {
        label: "Average",
        backgroundColor: window.chartColors.grey,
        borderColor: window.chartColors.grey,
        data: avg,
        fill: false
    };
}

function updateGraph() {
    window.myLine.config.data.datasets = [];
    var sensorSelect = document.getElementById("sensorSelect");
    var typeSelect = document.getElementById("typeSelect");

    for (var i = 0; i < sensorSelect.options.length; i++) {
        if (sensorSelect.options[i].selected) {
            if (i == sensorSelect.options.length - 1) {
                window.myLine.config.data.datasets.push(calcAvg(typeSelect.selectedIndex));
            }
            else {
                window.myLine.config.data.datasets.push(window.datasetstest[i][typeSelect.selectedIndex]);
            }
        }
        else {
            window.myLine.config.data.datasets.splice(i, 1);
        }
    }
    window.myLine.update(0);
    document.getElementById("currentDataTitle").innerHTML = "Data from " + getNiceDate();
}

function updateGraphInterpolation() {
    if (document.getElementById("interpolateGraph").checked) {
        window.myLine.config.options.elements.line.tension = 0.3;
    }
    else {
        window.myLine.config.options.elements.line.tension = 0
    }
    window.myLine.update(0);
}

function setBaseConfig() {
    var time = [];
    for (var i = 0; i < 25; i++) {
        time.push(i.toString());
    }

    var config = {
        type: 'line',
        data: {
            labels: time,
            datasets: []
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Data from ' + getNiceDate()
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Time'
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 0
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    },
                    ticks: {
                        suggestedMin: 18,
                        suggestedMax: 20,
                        stepSize: 2
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0, //0 = no interpolation //0.5 = normal
                    //steppedline: true //disables bezier curves
                }
            }
        }
    }
    window.ChartConfig = config;
    var ctx = document.getElementById("currentData").getContext("2d");
    window.myLine = new Chart(ctx, config);

    var dummydata1 = [5, 5, 6, 10.15, 12, 3, -5, -4, 0, 0, 4, 6, 7, 8, 12];
    var dummydata1f = [15, 10, 12, 16, 18, 15, 17, 25, 64, 91, 42, 30];
    var dummydata2 = [5, 8, 6, 10.01, null, null, 13, 3, -1, 15];
    var dummydata2f = [10, 12, 50, 50, 50, 30, 50, 30, 12, 60, null, 50];
    var dummydata3 = [5, 9, 3, 4, 6, 8, 21, 5, 2, 4, 3, 4, 1, 6];
    var dummydata3f = [0, 0, 0, 0, 2, 0, 30, 10, 12];

    window.datasetstest = [
        [{
            label: "Sensor1",
            backgroundColor: window.chartColors.orange,
            borderColor: window.chartColors.orange,
            data: dummydata1,
            fill: false
        }, {
            label: "Sensor1",
            backgroundColor: window.chartColors.orange,
            borderColor: window.chartColors.orange,
            data: dummydata1f,
            fill: false
        }, {
            label: "Sensor1",
            backgroundColor: window.chartColors.orange,
            borderColor: window.chartColors.orange,
            data: [],
            fill: false
        }
        ],
        [{
            label: "Sensor2",
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: dummydata2,
            fill: false
        }, {
            label: "Sensor2",
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: dummydata2f,
            fill: false
        }, {
            label: "Sensor2",
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [],
            fill: false
        }
        ]
        , [{
            label: "Sensor3",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: dummydata3,
            fill: false
        }, {
            label: "Sensor3",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: dummydata3f,
            fill: false
        }, {
            label: "Sensor3",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [],
            fill: false
        }]];
}

/**
 * getData: sends a GET request to the webserver and receives sensordata
 * the sensordata gets structured and saved to the window.sensorDataSets variable
 */
window.sensorDataSets = {};

function getData(start, end) {
    // Required date format: yyyy-mm-dd hh:mm:ss
    var d = new Date();
    var from = d.getYear() + "-" + d.getMonth() +"-" + d.getDate() + " " + "00:00:00";
    var until = d.getHours() +":"+d.getMinutes()+":00";
    //var from = "2017-12-01 11:14:50";
    //var until = "2017-12-01 23:59:59";

    if (start != undefined && end != undefined) {
        from = start;
        until = end;
    }

    $.ajax({
        async: false, //zum setzen der
        url: "/WebApp/php/getData.php?startDateTime="+from+"&endDateTime="+until,
        method: "GET",
        success: function (data) {
            jdata = JSON.parse(data);
            var sensorDataSets = [];
            window.sensorDataSets = structureData(jdata);
            var time = [];
            for (var i in jdata) {
                time.push(jdata[i].datetime);
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

/**
 * structureData: Structures the data of a given array with sensordata
 * sensordata must be structure like this: {"ID":197964,"typ":1,"datetime":"2017-12-01 11:59:00","value":"21.1600"}
 * @param sensorData -> array of sensordata
 * @returns {Array}
 */
function structureData(sensorData) {
    var dataArray = [];
    if(sensorData == undefined || sensorData[0] == undefined || sensorData == {}) {
        dataArray.hasData = false;
    }
    else {
        var currentID = sensorData[0].ID;
        var first = currentID;
        var currentType = sensorData[0].typ;
        var firstType = currentType;
        var numSensor = 0;
        dataArray[currentID] = [];
        dataArray[currentID].sID = currentID;
        dataArray[currentID][currentType] = [];
        dataArray.timeLabels = [];
        var colors = ["rgb(54, 162, 235)", "rgb(255, 159, 64)", "rgb(153, 102, 255)", "rgb(75, 192, 192)", "rgb(255, 99, 132)", "rgb(255, 205, 86)", "rgb(201, 203, 207)"];
        dataArray[currentID].color = colors[numSensor];
        //for loop runs through all the data
        for (var i in sensorData) {
            if (currentID == sensorData[i].ID) {
                if (currentType == sensorData[i].typ) { //If sensorID and type stay the same, push the current value in the dataset
                    dataArray[currentID][currentType].push(sensorData[i].value);
                }
                else { //Switch to new dataset with other type
                    currentType = sensorData[i].typ;
                    dataArray[currentID][currentType] = [];
                }
                if(currentID == first && currentType == firstType) {
                    dataArray.timeLabels.push(sensorData[i].datetime.slice(0,-3));
                }
            }
            else { //Switch to new dataset with other sensorID
                currentID = sensorData[i].ID;
                currentType = sensorData[i].typ;
                dataArray[currentID] = [];
                dataArray[currentID].sID = currentID;
                dataArray[currentID][currentType] = [];
                numSensor++;
                dataArray[currentID].color = colors[numSensor];
            }
        }
        dataArray.hasData = true;
    }
    return dataArray;
}

function updateGraph2() {
    window.myLine.config.data.datasets = [];
    var sensorSelect = document.getElementById("sensorSelect");
    var typeSelect = document.getElementById("typeSelect");

    for (var i = 0; i < sensorSelect.options.length; i++) {
        if (sensorSelect.options[i].selected) {
            if (i == sensorSelect.options.length - 1) {
                window.myLine.config.data.datasets.push(calcAvg(typeSelect.selectedIndex));
            }
            else {
                if (window.sensorDataSets[sensorSelect.options[i].innerHTML] != undefined) {
                    window.myLine.config.data.datasets.push(
                        {
                            label: window.sensorDataSets[sensorSelect.options[i].innerHTML].sID,
                            backgroundColor: window.sensorDataSets[sensorSelect.options[i].innerHTML].color,
                            borderColor: window.sensorDataSets[sensorSelect.options[i].innerHTML].color,
                            data: window.sensorDataSets[sensorSelect.options[i].innerHTML][typeSelect.selectedIndex + 1],
                            fill: false
                        });
                }
            }
        }
        else {
            window.myLine.config.data.datasets.splice(i, 1);
        }
    }
    if(window.sensorDataSets != undefined && window.sensorDataSets.hasData) {
        document.getElementById("currentDataTitle").innerHTML = "Daten vom " + window.sensorDataSets.timeLabels[0];
        window.myLine.config.data.labels = window.sensorDataSets.timeLabels;
    }
    else {
        document.getElementById("currentDataTitle").innerHTML = "Es sind keine Daten vorhanden!";
    }
    window.myLine.update(0);
}

function genOwnGraph() {
    var startTime = document.getElementById("StartTimePicker").value;
    var endTime = document.getElementById("EndTimePicker").value;
    var startDate = document.getElementById("StartDatePicker").value;
    var endDate = document.getElementById("EndDatePicker").value;
    //"2017-12-01 11:14:50"
    var zeitraum = startDate + " " + startTime + ":00" + "&" + endDate + " " + endTime + ":00";

    window.name = zeitraum;
    location.href = "owngraph.html";
}

function genGraph(zeitraumString) {
    var zeitraum = zeitraumString.split("&");
    getData(zeitraum[0], zeitraum[1]);
    updateGraph2();
}

function updateSensorSelect() {
    var sensorSelect = document.getElementById("sensorSelect");
    sensorSelect.options.remove(0);
    sensorSelect.options.remove(0);
    sensorSelect.options.remove(0);

    for (var i in window.sensorDataSets) {
        var opt = document.createElement("option");
        opt.text = i.ID;
        sensorSelect.options.add(opt);
    }
}