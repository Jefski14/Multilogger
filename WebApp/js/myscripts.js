function getNiceDate() {
    var today = new Date();
    return today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
}

function getCurrentTime() {
    var date = new Date();
    var currentTime = date.getHours() + ':' + lead(date.getMinutes());
    return currentTime;
}

function lead(number) {
    return (number < 10 ? '0' : '') + number;
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
        time.push(lead(i).toString() + ":00");
    }

    var config = {
        type: 'line',
        data: {
            labels: time,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, //false removes the responsive issue but then the chart grows to infinity
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
                        labelString: 'Uhrzeit'
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 10,
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Grad C°'
                    },
                    ticks: {
                        suggestedMin: 18,
                        suggestedMax: 24,
                        maxTicksLimit: 5,
                        stepSize: 3
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
}

/**
 * getData: sends a GET request to the webserver and receives sensordata
 * the sensordata gets structured and saved to the window.sensorDataSets variable
 */
window.sensorDataSets = {};

function getData(start, end) {
    // Required date format: yyyy-mm-dd hh:mm:ss
    var d = new Date();
    var from = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + "00:00:00";
    var until = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":00";
    if (start != undefined && end != undefined) {
        from = start;
        until = end;
    }

    $.ajax({
        async: false, //zum setzen der
        url: "/WebApp/php/getData.php?startDateTime=" + from + "&endDateTime=" + until,
        method: "GET",
        success: function (data) {
            jdata = JSON.parse(data);
            var sensorDataSets = [];
            //window.sensorDataSets = structureData(jdata);
            window.sensorDataSets = structureData(jdata, from, until);
            //console.log(structureData(jdata));
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

function getSensorName(id) {
    for (var i in window.sensorNames) {
        if (id == window.sensorNames[i].ID) {
            return window.sensorNames[i].Name;
        }
    }
    createSensorNamePHP(id);
    return id;
}


function genTimeStamps(from, until) {
    var von = new Date(from);
    var bis = new Date(until);
    var timespamps = [];
    while (von < bis) {
        timespamps.push(von.getDate() + "." + (von.getMonth() + 1) + "." + von.getFullYear() + " " + lead(von.getHours()) + ":" + lead(von.getMinutes()));
        von.setMinutes(von.getMinutes() + 1);
    }
    return timespamps;
}

function convertToJapan(timestampGer) {
    var timestamp = timestampGer.split(".");
    var yearTime = timestamp[2].split(" ");
    return yearTime[0] + "-" + timestamp[1] + "-" + timestamp[0] + " " + yearTime[1];
}

function printDate(von) {
    return von.getDate() + "." + (von.getMonth() + 1) + "." + von.getFullYear() + " " + lead(von.getHours()) + ":" + lead(von.getMinutes());
}

/**
 * structureData: Structures the data of a given array with sensordata
 * sensordata must be structure like this: {"ID":197964,"typ":1,"datetime":"2017-12-01 11:59","value":"21.1600"}
 * @param sensorData -> array of sensordata
 * @returns {Array}
 */
function structureData(sensorData, from, until) {
    console.log(genTimeStamps(from, until));
    var timestamps = genTimeStamps(from, until);
    getSensorNames();
    var dataArray = {
        hasData: false,
        sensors: [],
        timeStamps: [],
    };
    dataArray.timeStamps = genTimeStamps(from, until);
    if (sensorData == undefined || sensorData[0] == undefined || sensorData == {}) {
        dataArray.hasData = false;
    }
    else {
        var colors = ["rgb(201, 203, 207)", "rgb(54, 162, 235)", "rgb(255, 159, 64)", "rgb(153, 102, 255)", "rgb(255, 99, 132)", "rgb(75, 192, 192)", "rgb(255, 205, 86)"];
        var currentID = sensorData[0].ID;
        var first = currentID;
        var currentType = sensorData[0].typ;
        var firstType = currentType;
        var sensorDataBlock = {
            name: getSensorName(currentID),
            sID: currentID,
            color: "rgb(54, 162, 235)",
            t1data: [],
            t2data: [],
            t3data: [],
            t1dTime: [],
            t2dTime: [],
            t3dTime: []
        };
        var nextDate = new Date(from);
        for (var i in sensorData) {
            if (currentID == sensorData[i].ID) {
                currentType = sensorData[i].typ;
                if (currentType == "1") { //If sensorID and type stay the same, push the current value in the dataset
                    var sensorDate = new Date(convertToJapan(sensorData[i].datetime) + ":00");
                    while (sensorDate > nextDate) {
                        sensorDataBlock.t1data.push(null);
                        sensorDataBlock.t1dTime.push(printDate(nextDate));
                        nextDate.setMinutes(nextDate.getMinutes() + 1);
                    }
                    if (sensorDate.toString() == nextDate.toString()) {
                        sensorDataBlock.t1data.push(sensorData[i].value);
                        sensorDataBlock.t1dTime.push(sensorData[i].datetime);
                        nextDate.setMinutes(nextDate.getMinutes() + 1);
                    }
                    //else SensorDate < NextDate -> überspring den zweiten wert bei selber minute

                }
                else if (currentType == "2") { //Switch to new dataset with other type
                    var sensorDate = new Date(convertToJapan(sensorData[i].datetime) + ":00");
                    while (sensorDate > nextDate) {
                        sensorDataBlock.t2data.push(null);
                        sensorDataBlock.t2dTime.push(printDate(nextDate));
                        nextDate.setMinutes(nextDate.getMinutes() + 1);
                    }
                    if (sensorDate.toString() == nextDate.toString) {
                        sensorDataBlock.t2data.push(sensorData[i].value);
                        sensorDataBlock.t2dTime.push(sensorData[i].datetime);
                        nextDate.setMinutes(nextDate.getMinutes() + 1);
                    }
                    //else SensorDate < NextDate -> überspring den zweiten wert bei selber minute

                    //sensorDataBlock.t2data.push(sensorData[i].value);
                    //sensorDataBlock.t2dTime.push(sensorData[i].datetime);
                }
                else if (currentType == "3") {
                    var sensorDate = new Date(convertToJapan(sensorData[i].datetime) + ":00");
                    while (sensorDate > nextDate) {
                        sensorDataBlock.t3data.push(null);
                        sensorDataBlock.t3dTime.push(printDate(nextDate));
                        nextDate.setMinutes(nextDate.getMinutes() + 1);
                    }
                    if (sensorDate.toString() == nextDate.toString) {
                        sensorDataBlock.t3data.push(sensorData[i].value);
                        sensorDataBlock.t3dTime.push(sensorData[i].datetime);
                        nextDate.setMinutes(nextDate.getMinutes() + 1);
                    }

                    //sensorDataBlock.t3data.push(sensorData[i].value);
                    //sensorDataBlock.t3dTime.push(sensorData[i].datetime);
                }
            }
            else { //next Sensor
                nextDate = new Date(from);
                sensorDataBlock.color = colors[colors.length - 1];
                colors.pop();
                dataArray.sensors.push(sensorDataBlock);
                currentID = sensorData[i].ID;
                var sensorDataBlock = {
                    name: getSensorName(currentID),
                    sID: currentID,
                    color: "rgb(54, 162, 235)",
                    t1data: [],
                    t2data: [],
                    t3data: [],
                    t1dTime: [],
                    t2dTime: [],
                    t3dTime: []
                };
            }
        }
        sensorDataBlock.color = colors[colors.length - 1];
        colors.pop();
        dataArray.sensors.push(sensorDataBlock);
        dataArray.hasData = true;
    }
    return dataArray;
}

/**
 * Returns the array index of the dataset from sensor with ID @param id
 * @param id
 * @returns {*}
 */
function getSensorIndex(id) {
    for (var i in window.sensorDataSets.sensors) {
        if (window.sensorDataSets.sensors[i].sID == id) {
            return i;
        }
    }
    return undefined;
}

/**
 * Returns array of data from sensor at @param sensorIndex from type @param type
 * @param sensorIndex
 * @param type
 * @returns {*}
 */
function getDataByType(sensorIndex, type) {
    switch (type) {
        case 0:
            return window.sensorDataSets.sensors[sensorIndex].t1data;
        case 1:
            return window.sensorDataSets.sensors[sensorIndex].t2data;
        case 2:
            return window.sensorDataSets.sensors[sensorIndex].t3data;
        default:
            return undefined;
    }

}

/**
 * Calculates the Average of the Sensordata in current Datasets
 * @param type
 * @returns {{label: string, backgroundColor: string, borderColor: string, data: Array, fill: boolean}}
 */
function calcAvg(type) {
    var avg = [];
    for (var i = 0; i < window.myLine.config.data.datasets.length; i++) {
        for (var j = 0; j < window.myLine.config.data.datasets[i].data.length; j++) {
            var wert = window.myLine.config.data.datasets[i].data[j];
            if (wert == null) {
               wert = 0;
            }
            if (i == 0) {
                avg[j] = wert;
            }
            else {
                avg[j] = parseFloat(avg[j]) + parseFloat(wert);
            }
        }
    }
    for (var i = 0; i < avg.length; i++) {
        avg[i] = avg[i] / window.myLine.config.data.datasets.length;
    }

    return {
        label: "Durchschnitt",
        backgroundColor: window.chartColors.grey,
        borderColor: window.chartColors.grey,
        data: avg,
        fill: false
    };
}

/**
 * Checks which sensors & type are selected and changes the data displayed by the line chart accordingly
 */
function updateGraph() {
    window.myLine.config.data.datasets = [];
    //update Data
    console.log(window.sensorDataSets);
    var sensorSelect = document.getElementById("sensorSelect");
    var typeSelect = document.getElementById("typeSelect");
    for (var i = 0; i < sensorSelect.options.length; i++) {
        if (sensorSelect.options[i].selected) {
            if (sensorSelect.options[i].value == "0") {
                //console.log("calcAvg");
                window.myLine.config.data.datasets.push(calcAvg(typeSelect.selectedIndex));
            }
            else {
                var sensorIndex = getSensorIndex(sensorSelect.options[i].value);
                var test = typeSelect.selectedIndex;
                if (window.sensorDataSets.sensors[sensorIndex] != undefined) {
                    window.myLine.config.data.datasets.push(
                        {
                            label: window.sensorDataSets.sensors[sensorIndex].name,
                            backgroundColor: window.sensorDataSets.sensors[sensorIndex].color,
                            borderColor: window.sensorDataSets.sensors[sensorIndex].color,
                            data: getDataByType(sensorIndex, typeSelect.selectedIndex),
                            fill: false
                        }
                    );
                }
            }
        }
        else {
            window.myLine.config.data.datasets.splice(i, 1);
        }
    }
    //Update Scales
    var sensorType = typeSelect.selectedIndex;
    switch (sensorType) {
        case 0:
            window.myLine.config.options.scales.yAxes[0].scaleLabel.labelString = "Grad C°";
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMin = 18;
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMax = 22;
            window.myLine.config.options.scales.yAxes[0].ticks.stepSize = 2;
            break;
        case 1:
            window.myLine.config.options.scales.yAxes[0].scaleLabel.labelString = "CO2";
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMin = 18;
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMax = 22;
            window.myLine.config.options.scales.yAxes[0].ticks.stepSize = 1;
            break;
        case 2:
            window.myLine.config.options.scales.yAxes[0].scaleLabel.labelString = "% Luftfeuchtigkeit";
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMin = 60;
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMax = 80;
            window.myLine.config.options.scales.yAxes[0].ticks.stepSize = 10;
            break;
        default:
            window.myLine.config.options.scales.yAxes[0].scaleLabel.labelString = "No Data";
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMin = 0;
            window.myLine.config.options.scales.yAxes[0].ticks.suggestedMax = 1;
            window.myLine.config.options.scales.yAxes[0].ticks.stepSize = 1;
    }

    if (window.sensorDataSets != undefined && window.sensorDataSets.hasData) {
        document.getElementById("currentDataTitle").innerHTML = "Daten vom " + window.sensorDataSets.timeStamps[0];
        window.myLine.config.data.labels = window.sensorDataSets.timeStamps;
    }
    else {
        document.getElementById("currentDataTitle").innerHTML = "Es sind keine Daten vorhanden!";
    }
    window.myLine.update(0);
}

/**
 * Changes date(expected in this Layout: dd.mm.yyyy) to this layout yyyy-mm-dd
 * @param date
 * @returns {string}
 */
function changeDateFormat(date) {
    var dateArr = date.split(".");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
}

/**
 * Sets timespan string for owngraph.html to use for graph generation
 */
function genOwnGraph() {
    var startTime = document.getElementById("StartTimePicker").value;
    var endTime = document.getElementById("EndTimePicker").value;
    var startDate = document.getElementById("StartDatePicker").value;
    var endDate = document.getElementById("EndDatePicker").value;
    //"2017-12-01 11:14:50"
    var zeitraum = changeDateFormat(startDate) + " " + startTime + ":00" + "&" + changeDateFormat(endDate) + " " + endTime + ":00";

    window.name = zeitraum;
    location.href = "owngraph.html";
}

/**
 * Generates the Graph config for the given timeperiod
 * @param zeitraumString
 */
function genGraph(zeitraumString) {
    var zeitraum = zeitraumString.split("&");
    getData(zeitraum[0], zeitraum[1]);
    updateGraph();
}

/**
 * Updates Sensor select in dependency of the current chartdata
 */
function updateSensorSelect() {
    var sensorSelect = document.getElementById("sensorSelect");
    for (var i in sensorSelect.options) {
        sensorSelect.options.remove(0);
    }

    for (var i in window.sensorDataSets.sensors) {
        var opt = document.createElement("option");
        opt.text = window.sensorDataSets.sensors[i].name;
        opt.innerHTML = window.sensorDataSets.sensors[i].name;
        opt.value = window.sensorDataSets.sensors[i].sID;
        opt.selected = true;
        sensorSelect.options.add(opt);
    }
    var opt = document.createElement("option");
    opt.text = "Durchschnitt";
    opt.innerHTML = "Durchschnitt";
    opt.value = 0;
    sensorSelect.options.add(opt);

    $('#sensorSelect').material_select();
}

/**
 * retrieves sensornames from db
 */
function getSensorNames() {
    $.ajax({
        async: false, //zum setzen der
        url: "/WebApp/php/getSensornames.php",
        method: "GET",
        success: function (data) {
            jdata = JSON.parse(data);
            //console.log(jdata);
            window.sensorNames = jdata;
        },
        error: function (data) {
            console.log(data);
        }
    });
}

/**
 * Generates the Settings dialog
 */
function genSettings() {
    getSensorNames();
    var tbody = document.getElementById("settingsBody");
    tbody.innerHTML = "";
    for (var i in window.sensorNames) {
        var tr = tbody.insertRow(0);
        for (var j = 0; j < 4; j++) {
            var td = tr.insertCell();
            if (j == 0) {
                td.appendChild(document.createTextNode(window.sensorNames[i].Name));
            }
            else if (j == 1) {
                td.appendChild(document.createTextNode(window.sensorNames[i].ID));
            }
            else if (j == 2) {
                var input = document.createElement("input");
                td.setAttribute("class", "td-withfield");
                input.setAttribute("type", "text");
                input.setAttribute("id", "Name" + window.sensorNames[i].ID);
                td.appendChild(input);
            }
            else {
                var btn = document.createElement("a");
                btn.setAttribute("class", "btn-floating waves-effect waves-light orange");
                btn.setAttribute("onclick", "updateSensorName(" + window.sensorNames[i].ID + ")");
                var i = document.createElement("i");
                i.setAttribute("class", "material-icons");
                i.appendChild(document.createTextNode("done"));
                btn.appendChild(i);
                td.appendChild(btn);
            }
        }

    }
}

/**
 * updates name of sensor with id
 * @param id
 * @param name
 */
function updateSensorNamePHP(id, name) {
    $.ajax({
        async: false, //zum setzen der
        url: "/WebApp/php/changeSensornameByID.php?ID=" + id + "&Name=" + name,
        method: "GET",
        success: function (data) {
            jdata = JSON.parse(data);
            console.log(jdata);
            window.sensorNames = jdata;
        },
        error: function (data) {
            console.log(data);
        }
    });
}

/**
 * Creates a new entry for sensor with id in the name database
 * @param id
 */
function createSensorNamePHP(id) {
    $.ajax({
        async: false, //zum setzen der
        url: "/WebApp/php/newSensorName.php?ID=" + id,
        method: "GET",
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function updateSensorName(id) {
    //console.log(id);
    var newName = document.getElementById("Name" + id);
    if (newName.value.length > 0) {
        //console.log(newName.value);
        updateSensorNamePHP(id, newName.value);
    }
    genSettings();
}

/**
 * Validates if StartTime < EndTime
 */
function validateTimeSpan(){
    var startTime = document.getElementById("StartTimePicker").value;
    var endTime = document.getElementById("EndTimePicker").value;
    //Bad Workaround for when the startdatepicker doesnt get prepopulated because this function gets called when the endtimepicker get prepopulated
    if(document.getElementById("StartDatePicker").value == "") {
        var $input = $('#StartDatePicker').pickadate();
        var picker = $input.pickadate('picker');
        picker.set('select', new Date());
    }
    var startDate = document.getElementById("StartDatePicker").value;
    var endDate = document.getElementById("EndDatePicker").value;
    var startstamp = new Date(convertToJapan(startDate + " " + startTime + ":00"));
    var endstamp = new Date(convertToJapan(endDate + " " + endTime + ":00"));
    if(startstamp >= endstamp) {
        //Set Warning Label & disable button
        document.getElementById("warningLabel").style.visibility = "visible";
        document.getElementById("generateBtn").classList.add("disabled");
    }
    else {
        //hide Warning Label & enable Button again
        document.getElementById("warningLabel").style.visibility = "hidden";
        document.getElementById("generateBtn").classList.remove("disabled");
    }
}