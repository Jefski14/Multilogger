function generateConfig() {
    var time = [];
    var dummydata1 = [5, 5, 6, 10.15, 12, 3, -5, -4, 0, 0, 4, 6, 7, 8, 12];
    var dummydata2 = [5, 8, 6, 10.01, 13, 3, -1];
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
                fill: false,
            }, {
                label: "Sensor2",
                fill: false,
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: dummydata2,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Data from ' + getNiceDate(),
            },
            tooltips: {
                mode: 'index',
                intersect: false,
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

function getNiceDate(){
    var today = new Date();
    return today.getDate() + '/' + (today.getMonth() + 1) +'/'+ today.getFullYear();
}