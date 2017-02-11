/**
 * Created by JCJordan on 30/01/2017.
 */

//Get code from json file where data is entry 1, columns selected entry 2, etc.
//Generate statistics and format data
//Create pdf report using generated statistics and data

function genReport(reportData){
    console.log("generating report...");

    genGraphs(reportData);
}

function genPDF(reportData, graphs){

    var database = reportData.database;
    var columns = reportData.columns;
    var filters = reportData.filters;
    var filteredDatabase = reportData.filteredDatabase;

    var docDefinition = {
        content: [
            {text: 'Filtered Table', style: 'header', alignment: "center", fontSize: 14, bold: true},
            filteredTable(filteredDatabase, columns, filters),
            {text: '\n\nFilters applied', style: 'header', fontSize: 14, bold: true},
            {ol: filterList(filters)},
            {text: '\n\nBase Statistics', style: 'header', fontSize: 14, bold: true},
            {ol: statisticsList(filteredDatabase)},
            {text: '\n\nGraphical Data', style: 'header', fontSize: 14, bold: true},
            {image: graphs, width: 400}
        ]
    };

    console.log("report generated...");

    // open the PDF in a new window
    pdfMake.createPdf(docDefinition).open();

}

function genGraphs(reportData){

    //Male to Female Pie Chart
    //Age Range Bar/Pie Chart
    //Area (Living in) Pie Chart

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Month');
    data.addColumn('number', 'Attendance');

    data.addRows([
        [{v: new Date(2017, 0, 1),f: "1st of Jan"}, 1000],
        [{v: new Date(2017, 1, 1),f: "1st of Feb"}, 2000,],
        [{v: new Date(2017, 2, 1),f: "1st of March"}, 1500],
        [{v: new Date(2017, 3, 1),f: "1st of April"}, 2500],
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

function filterList(filters){

    var filterList = [];
    filters.forEach(function(filter){
        if(filter.type == "contains"){
            filterList.push(filter.column + " contains " + filter.value);
        }
        if(filter.type == "range"){
            filterList.push(filter.column + " is bigger than " + (filter.value).toString().split("%")[1] + " and less than " + (filter.value).toString().split("%")[0]);
        }
    });
    return filterList;

}

function statisticsList(database){
    var statistics = statisticCalc(database);
    var statisticsList = [];

    Object.keys(statistics).forEach(function(statistic){
        statisticsList.push(statistic + " = " + statistics[statistic]);
    });

    return statisticsList;
}

function statisticCalc(database){
    var statistics = {};
    var total = database.length;
    statistics.total = total;
    var ageRange = {20: 0, 40: 0, 60: 0, 80: 0, 100: 0};
    statistics.agerange = ageRange;

    database.forEach(function(entry){
    });

    return statistics;
}

function filteredTable(entries, columns){
    var widths = [];
    columns.forEach(function(){
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

function buildTableBody(entries, columns){

    var body = [];
    var headers = [];

    columns.forEach(function(headerName){
        headers.push({text: headerName, style: 'tableHeader', alignment: 'center', bold: true});
    });
    body.push(headers);
    entries.forEach(function(entryData){
        var entry = [];
        columns.forEach(function(column){
            entry.push(entryData[column]);
        });
        body.push(entry);
    });

    return body;

}