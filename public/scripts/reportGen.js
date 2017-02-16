/**
 * Created by JCJordan on 30/01/2017.
 */

//Get code from json file where data is entry 1, columns selected entry 2, etc.
//Generate statistics and format data
//Create pdf report using generated statistics and data

function genReport(reportData) {
    console.log("generating report...");

    genGraphs(reportData);
}

function genPDF(reportData, graphs) {

    var database = reportData.database;
    var columns = reportData.columns;
    var filters = reportData.filters;
    var filteredDatabase = reportData.filteredDatabase;
    var today = new Date();

    var docDefinition = {
        content: [{
                text: 'Report ' + today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear(),
                style: 'header',
                alignment: "center",
                fontSize: 18,
                bold: true
            },
            {
                text: 'Filtered Table',
                style: 'header',
                alignment: "center",
                fontSize: 14,
                bold: true
            },
            filteredTable(filteredDatabase, columns, filters),
            {
                text: '\n\nFilters applied',
                style: 'header',
                fontSize: 14,
                bold: true
            },
            {
                ol: filterList(filters)
            },
            {
                text: '\n\nBase Statistics',
                style: 'header',
                fontSize: 14,
                bold: true
            },
            {
                ol: statisticsList(filteredDatabase)
            },
            {
                text: '\n\nGraphical Data',
                style: 'header',
                fontSize: 14,
                bold: true
            },
            {
                image: graphs,
                width: 500
            }
        ]
    };

    console.log("report generated...");

    // open the PDF in a new window
    pdfMake.createPdf(docDefinition).open();

}

function genGraphs(reportData) {

    //Male to Female Pie Chart
    //Age Range Bar/Pie Chart
    //Area (Living in) Pie Chart

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Month');
    data.addColumn('number', 'Attendance');

    data.addRows([
        [{
            v: new Date(2017, 0, 1),
            f: "1st of Jan"
        }, 1000],
        [{
            v: new Date(2017, 1, 1),
            f: "1st of Feb"
        }, 2000],
        [{
            v: new Date(2017, 2, 1),
            f: "1st of March"
        }, 1500],
        [{
            v: new Date(2017, 3, 1),
            f: "1st of April"
        }, 2500]
    ]);

    var options = {
        title: 'Attendance per Month',
        colors: ['#9575cd', '#33ac71'],
        hAxis: {
            title: 'Month',
            //format: 'h:mm a',
            viewWindow: {
                min: new Date(2017, -1, 15),
                max: new Date(2017, 3, 15)
            }
        },
        vAxis: {
            title: 'Attendance'
        }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    //google.visualization.events.addListener(chart, 'ready', function () {
    genPDF(reportData, chart.getImageURI());
    //});

}

function filterList(filters) {

    var filterList = [];
    filters.forEach(function(filter) {
        if (filter.type == "contains") {
            filterList.push(filter.column.hr + " contains " + filter.value);
        }
        if (filter.type == "range") {
            filterList.push(filter.column.hr + " is between " + (filter.value).toString().split("%")[0] + " and " + (filter.value).toString().split("%")[1]);
        }
    });
    return filterList;

}

function statisticsList(database) {
    var statistics = statisticCalc(database);
    var statisticsList = [];

    statistics.forEach(function(statistic) {
        statisticsList.push(statistic.name.hr + " = " + statistic.value);
    });

    return statisticsList;
}

function statisticCalc(database) {
    var statistics = [];
    var total = database.length;
    statistics.push({name: {db: "total", hr: "Total Pals"}, value: total});
    var ageRange =
        "0" + " 20 yr old(s) (or younger), " +
        "0" + " 20-40 yr old(s), " +
        "0" + " 40-60 yr old(s), " +
        "0" + " 60-80 yr old(s), " +
        "0" + " 80 yr old(s) (or older)"
    ;
    statistics.push({name: {db: "ageRange", hr: "Age Range"}, value: ageRange});

    database.forEach(function(entry) {});

    return statistics;
}

function filteredTable(entries, columns) {
    var widths = [];
    columns.forEach(function() {
        widths.push('*');
    });
    return {
        style: 'tableExample',
        color: '#444',
        alignment: "center",
        table: {
            widths: widths,
            headerRows: 1,
            body: buildTableBody(entries, columns)
        },
        layout: 'lightHorizontalLines'
    };
}

function buildTableBody(entries, columns) {

    var body = [];
    var headers = [];

    columns.forEach(function(columnData) {
        headers.push({
            text: columnData.hr,
            style: 'tableHeader',
            alignment: 'center',
            bold: true
        });
    });
    body.push(headers);
    entries.forEach(function(entryData) {
        var entry = [];
        columns.forEach(function(column) {
            entry.push(entryData[column.db]);
        });
        body.push(entry);
    });

    return body;

}
