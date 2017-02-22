/**
 * Created by Jordan Craig for RT Projects on 30/01/2017.
 * Requires PDFMake and Google Charts to work.
 */

const NUM_AGE_RANGES = 5;
const NUM_RELATIONSHIP_STATUSES = 7;
const NUM_ELECTORAL_DIVISIONS = 63;
const NUM_AAP_AREAS = 14;
const NUM_MENTAL_HEALTH_STATUSES = 14;
const NUM_REFERRAL_ROUTES = 6;

function genReport(reportData) {
    console.log("generating report...");

    var tableData = genTableData(reportData);
    var statData = genStatData(reportData);
    var filterData = genFilterData(reportData);

    genGraphs(tableData, filterData, statData);
}

function genTableData(reportData){

    var columns = reportData.columns;
    var filters = reportData.filters;
    var filteredDatabase = reportData.filteredDatabase;

    return filteredTable(filteredDatabase, columns, filters);
}

function genStatData(reportData){
    return statisticsList(reportData.filteredDatabase);
}

function genFilterData(reportData){
    return filterList(reportData.filters);
}

function genPDF(filteredTable, filters, stats, graphs) {

    var today = new Date();
    var statisticList = stats.list;

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
            filteredTable,
            {
                text: '\n\nFilters applied',
                style: 'header',
                fontSize: 14,
                bold: true
            },
            {
                ol: filters
            },
            {
                text: '\n\nStatistics',
                style: 'header',
                fontSize: 14,
                bold: true
            },
            {
                ol: statisticList
            },
            {
                text: '\n\nGraphical Data',
                style: 'header',
                fontSize: 14,
                bold: true
            },
            graphsAsImages(graphs)
        ]
    };

    console.log("report generated...");

    // open the PDF in a new window
    pdfMake.createPdf(docDefinition).open();

}

function genGraphs(tableData, filterData, stats) {

    /**
     * @param chart         The basic Chart object .
     * @param chart.draw    The draw function of the chart object, draws the graph to chart_div.
     * @param chart.getImageURI
     * @param google
     * @param google.visualization
     * @param google.visualization.ColumnChart
     * @param google.visualization.PieChart
     */

    var statData = stats.data;

    var ageRangeGraphDetails = genAgeRangeGraphs(statData);
    var relationshipStatusGraphDetails = genRelationshipStatusGraphs(statData);
    var electoralDivisionGraphDetails = genElectoralDivisionGraphs(statData);
    var aapAreaGraphDetails = genAAPAreaGraphs(statData);
    var mentalHealthInfoGraphDetails = genMentalHealthInfoGraphs(statData);
    var referralRouteGraphDetails = genReferralRouteGraphs(statData);

    var chartURIs = [];

    var columnChart = new google.visualization.ColumnChart(document.getElementById('columnChart_div'));
    var pieChart = new google.visualization.PieChart(document.getElementById('pieChart_div'));
    var totalNumOfCharts = 12;

    google.visualization.events.addOneTimeListener(columnChart, 'ready', function () {
        console.log("Age Range Column Chart Generated");
        chartURIs.push(columnChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });
    google.visualization.events.addOneTimeListener(pieChart, 'ready', function () {
        console.log("Age Range Pie Chart Generated");
        chartURIs.push(pieChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });

    //Age Range Graphs
    columnChart.draw(ageRangeGraphDetails.column.data, ageRangeGraphDetails.column.options);
    pieChart.draw(ageRangeGraphDetails.pie.data, ageRangeGraphDetails.pie.options);

    google.visualization.events.addOneTimeListener(columnChart, 'ready', function () {
        console.log("Relationship Status Column Chart Generated");
        chartURIs.push(columnChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });
    google.visualization.events.addOneTimeListener(pieChart, 'ready', function () {
        console.log("Relationship Status Pie Chart Generated");
        chartURIs.push(pieChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });

    //Relationship Status Graphs
    columnChart.draw(relationshipStatusGraphDetails.column.data, relationshipStatusGraphDetails.column.options);
    pieChart.draw(relationshipStatusGraphDetails.pie.data, relationshipStatusGraphDetails.pie.options);

    google.visualization.events.addOneTimeListener(columnChart, 'ready', function () {
        console.log("Electoral Division Column Chart Generated");
        chartURIs.push(columnChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });
    google.visualization.events.addOneTimeListener(pieChart, 'ready', function () {
        console.log("Electoral Division Pie Chart Generated");
        chartURIs.push(pieChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });

    //Electoral Division Graphs
    columnChart.draw(electoralDivisionGraphDetails.column.data, electoralDivisionGraphDetails.column.options);
    pieChart.draw(electoralDivisionGraphDetails.pie.data, electoralDivisionGraphDetails.pie.options);

    google.visualization.events.addOneTimeListener(columnChart, 'ready', function () {
        console.log("AAP Area Column Chart Generated");
        chartURIs.push(columnChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });
    google.visualization.events.addOneTimeListener(pieChart, 'ready', function () {
        console.log("AAP Area Pie Chart Generated");
        chartURIs.push(pieChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });

    //AAP Area Graphs
    columnChart.draw(aapAreaGraphDetails.column.data, aapAreaGraphDetails.column.options);
    pieChart.draw(aapAreaGraphDetails.pie.data, aapAreaGraphDetails.pie.options);

    google.visualization.events.addOneTimeListener(columnChart, 'ready', function () {
        console.log("Mental Health Info Column Chart Generated");
        chartURIs.push(columnChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });
    google.visualization.events.addOneTimeListener(pieChart, 'ready', function () {
        console.log("Mental Health Info Pie Chart Generated");
        chartURIs.push(pieChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });

    //Mental Health Info Graphs
    columnChart.draw(mentalHealthInfoGraphDetails.column.data, mentalHealthInfoGraphDetails.column.options);
    pieChart.draw(mentalHealthInfoGraphDetails.pie.data, mentalHealthInfoGraphDetails.pie.options);

    google.visualization.events.addOneTimeListener(columnChart, 'ready', function () {
        console.log("Referral Routes Column Chart Generated");
        chartURIs.push(columnChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }

    });
    google.visualization.events.addOneTimeListener(pieChart, 'ready', function () {
        console.log("Referral Routes Pie Chart Generated");
        chartURIs.push(pieChart.getImageURI());
        if(chartURIs.length == totalNumOfCharts){
            genPDF(tableData, filterData, stats, chartURIs);
        }
    });

    //Referral Routes
    columnChart.draw(referralRouteGraphDetails.column.data, referralRouteGraphDetails.column.options);
    pieChart.draw(referralRouteGraphDetails.pie.data, referralRouteGraphDetails.pie.options);

}

function genAgeRangeGraphs(statData){

    /**
     * @param google
     * @param google.visualization
     * @param google.visualization.DataTable()
     * @param data
     * @param data.addColumn
     * @param data.addRows
     */

    var ageRangesFound = 0;
    var statCount = 0;
    var ageRanges = {};
    while(ageRangesFound < NUM_AGE_RANGES){
        if(statData[statCount].value != null) {
            if (statData[statCount].name.db.split("_")[0] == "ageRange") {
                ageRanges[statData[statCount].name.db] = statData[statCount].value;
                ageRangesFound++;
            }
        }
        statCount++;
    }

    var columnData = new google.visualization.DataTable();
    columnData.addColumn('number', 'Age Range');
    columnData.addColumn('number', 'Number of Pals');

    columnData.addRows([
        [{
            v: 12,
            f: "18-24"
        }, ageRanges.ageRange_20.value],
        [{
            v: 34,
            f: "25-44"
        }, ageRanges.ageRange_30.value],
        [{
            v: 54,
            f: "45-64"
        }, ageRanges.ageRange_50.value],
        [{
            v: 69,
            f: "65-74"
        }, ageRanges.ageRange_70.value],
        [{
            v: 80,
            f: "75+"
        }, ageRanges.ageRange_80.value]

    ]);

    var columnOptions = {
        title: 'Pals per Age Range',
        colors: ['#9575cd', '#33ac71'],
        width: 1000,
        height: 750,
        hAxis: {
            //title: 'Age Range',
            slantedText: true
            //viewWindow: {min: 10, max: 100}
        },
        vAxis: {
            title: 'Number of Pals'
        }
    };

    var pieData = google.visualization.arrayToDataTable([
        ['AgeRange', 'Number of Pals'],
        ['18-24', ageRanges.ageRange_20.value],
        ['25-24', ageRanges.ageRange_30.value],
        ['45-64', ageRanges.ageRange_50.value],
        ['65-74', ageRanges.ageRange_70.value],
        ['75+', ageRanges.ageRange_80.value]
    ]);

    var pieOptions = {
        title: 'Pals per Age Range',
        width: 1000,
        height: 750
    };

    return {column: {data: columnData, options: columnOptions}, pie: {data: pieData, options: pieOptions}};
}

function genRelationshipStatusGraphs(statData){

    /**
     * @param google
     * @param google.visualization
     * @param google.visualization.DataTable()
     * @param data
     * @param data.addColumn
     * @param data.addRows
     */

    var relationshipStatusesFound = 0;
    var statCount = 0;
    var relationshipStatuses = {};
    while(relationshipStatusesFound < NUM_RELATIONSHIP_STATUSES){
        if(statData[statCount].value != null) {
            var parts = statData[statCount].name.db.split("_");
            if (parts[0] == "relationshipStatus") {
                relationshipStatuses[parts[1]] = statData[statCount].value;
                relationshipStatusesFound++;
            }
        }
        statCount++;
    }

    var columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'Relationship Status');
    columnData.addColumn('number', 'Number of Pals');

    columnData.addRows([
        [{
            v: "Married"
        }, relationshipStatuses.married.value],
        [{
            v: "Living Together"
        }, relationshipStatuses.livingTogether.value],
        [{
            v: "Single"
        }, relationshipStatuses.single.value],
        [{
            v: "In A Relationship"
        }, relationshipStatuses.inARelationship.value],
        [{
            v: "Living Alone"
        }, relationshipStatuses.livingAlone.value],
        [{
            v: "Divorced"
        }, relationshipStatuses.divorced.value],
        [{
            v: "Widowed"
        }, relationshipStatuses.widowed.value]

    ]);

    var columnOptions = {
        title: 'Pals per Relationship Status',
        colors: ['#9575cd', '#33ac71'],
        width: 1000,
        height: 750,
        hAxis: {
            //title: 'Relationship Status',
            slantedText: true
            //viewWindow: {min: 10, max: 100}
        },
        vAxis: {
            title: 'Number of Pals'
        }
    };

    var pieData = google.visualization.arrayToDataTable([
        ['Relationship Status', 'Number of Pals'],
        ['Married', relationshipStatuses.married.value],
        ['Living Together', relationshipStatuses.livingTogether.value],
        ['Single', relationshipStatuses.single.value],
        ['In A Relationship', relationshipStatuses.inARelationship.value],
        ['Living Alone', relationshipStatuses.livingAlone.value],
        ['Divorced', relationshipStatuses.divorced.value],
        ['Widowed', relationshipStatuses.widowed.value]
    ]);

    var pieOptions = {
        title: 'Pals per Relationship Status',
        width: 1000,
        height: 750
    };

    return {column: {data: columnData, options: columnOptions}, pie: {data: pieData, options: pieOptions}};

}

function genElectoralDivisionGraphs(statData){

    /**
     * @param google
     * @param google.visualization
     * @param google.visualization.DataTable()
     * @param data
     * @param data.addColumn
     * @param data.addRows
     */

    var divisionsFound = 0;
    var statCount = 0;
    var divisions = {};
    while(divisionsFound < NUM_ELECTORAL_DIVISIONS){
        if(statData[statCount].value != null) {
            var parts = statData[statCount].name.db.split("_");
            if (parts[0] == "geographic") {
                if(parts[1] == "electoral" && parts[2] == "division") {
                    divisions[statData[statCount].name.db] = {hr: statData[statCount].name.hr, value: statData[statCount].value};
                    divisionsFound++;
                }
            }
        }
        statCount++;
    }

    var columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'Division');
    columnData.addColumn('number', 'Number of Pals');

    var subColumnData = [];
    var subPieData = [['Electoral Division', 'Number of Pals']];

    Object.keys(divisions).forEach(function(division){
        subColumnData.push(
            [{
                v: (divisions[division].hr).toString()
            },
                divisions[division].value
            ]);
        subPieData.push([divisions[division].hr, divisions[division].value]);
    });

    columnData.addRows(subColumnData);

    var columnOptions = {
        title: 'Pals per Electoral Division',
        colors: ['#9575cd', '#33ac71'],
        width: 1000,
        height: 750,
        hAxis: {
            //title: 'Electoral Division',
            slantedText: true
            //viewWindow: {min: 0, max: 100}
        },
        vAxis: {
            viewWindow: {min: 0},
            title: 'Number of Pals'
        }
    };

    var pieData = google.visualization.arrayToDataTable(subPieData);

    var pieOptions = {
        title: 'Pals per Electoral Division',
        width: 1000,
        height: 750
    };

    return {column: {data: columnData, options: columnOptions}, pie: {data: pieData, options: pieOptions}};

}

function genAAPAreaGraphs(statData){

    /**
     * @param google
     * @param google.visualization
     * @param google.visualization.DataTable()
     * @param data
     * @param data.addColumn
     * @param data.addRows
     */

    var areasFound = 0;
    var statCount = 0;
    var areas = {};
    while(areasFound < NUM_AAP_AREAS){
        if(statData[statCount].value != null) {
            var parts = statData[statCount].name.db.split("_");
            if (parts[0] == "geographic") {
                if(parts[1] == "aap" && parts[2] == "area") {
                    areas[statData[statCount].name.db] = {hr: statData[statCount].name.hr, value: statData[statCount].value};
                    areasFound++;
                }
            }
        }
        statCount++;
    }

    var columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'Area');
    columnData.addColumn('number', 'Number of Pals');

    var subColumnData = [];
    var subPieData = [['AAP Area', 'Number of Pals']];

    Object.keys(areas).forEach(function(area){
        subColumnData.push(
            [{
                v: (areas[area].hr).toString()
            },
                areas[area].value
            ]);
        subPieData.push([areas[area].hr, areas[area].value]);
    });

    columnData.addRows(subColumnData);

    var columnOptions = {
        title: 'Pals per AAP Area',
        colors: ['#9575cd', '#33ac71'],
        width: 1000,
        height: 750,
        hAxis: {
            //title: 'AAP Area',
            slantedText: true
            //viewWindow: {min: 0,max: 100}
        },
        vAxis: {
            viewWindow: {min: 0},
            title: 'Number of Pals'
        }
    };

    var pieData = google.visualization.arrayToDataTable(subPieData);

    var pieOptions = {
        title: 'Pals per AAP Area',
        width: 1000,
        height: 750
    };

    return {column: {data: columnData, options: columnOptions}, pie: {data: pieData, options: pieOptions}};

}

function genMentalHealthInfoGraphs(statData){

    /**
     * @param google
     * @param google.visualization
     * @param google.visualization.DataTable()
     * @param data
     * @param data.addColumn
     * @param data.addRows
     */

    var mentalHealthStatusesFound = 0;
    var statCount = 0;
    var mentalHealthStatuses = {};
    while(mentalHealthStatusesFound < NUM_MENTAL_HEALTH_STATUSES){
        if(statData[statCount].value != null) {
            var parts = statData[statCount].name.db.split("_");
            if (parts[0] == "mentalHealthInfo") {
                mentalHealthStatuses[parts[1]] = statData[statCount].value;
                mentalHealthStatusesFound++;
            }
        }
        statCount++;
    }

    var columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'Mental Health Status');
    columnData.addColumn('number', 'Number of Pals');

    columnData.addRows([
        [{
            v: "Anxiety"
        }, mentalHealthStatuses.anxiety.value],
        [{
            v: "Bereavement"
        }, mentalHealthStatuses.bereavement.value],
        [{
            v: "Depression"
        }, mentalHealthStatuses.depression.value],
        [{
            v: "Eating Disorder"
        }, mentalHealthStatuses.eatingDisorder.value],
        [{
            v: "Divorce"
        }, mentalHealthStatuses.divorce.value],
        [{
            v: "Low Self Esteem"
        }, mentalHealthStatuses.lowSelfEsteem.value],
        [{
            v: "Suicidal Thoughts"
        }, mentalHealthStatuses.suicidalThoughts.value],
        [{
            v: "Self Harm"
        }, mentalHealthStatuses.selfHarm.value],
        [{
            v: "Sleeping Difficulties"
        }, mentalHealthStatuses.sleepingDifficulties.value],
        [{
            v: "Stress"
        }, mentalHealthStatuses.stress.value],
        [{
            v: "Panic Attacks"
        }, mentalHealthStatuses.panicAttacks.value],
        [{
            v: "Substance Misuse"
        }, mentalHealthStatuses.substanceMisuse.value],
        [{
            v: "Addiction"
        }, mentalHealthStatuses.addiction.value],
        [{
            v: "Attempted Suicide"
        }, mentalHealthStatuses.attemptedSuicide.value]

    ]);

    var columnOptions = {
        title: 'Pals per Mental Health Status',
        colors: ['#9575cd', '#33ac71'],
        width: 1000,
        height: 750,
        hAxis: {
            //title: 'Mental Health Status',
            slantedText: true
            //viewWindow: {min: 10, max: 100}
        },
        vAxis: {
            title: 'Number of Pals'
        }
    };

    var pieData = google.visualization.arrayToDataTable([
        ['Mental Status', 'Number of Pals'],
        ['Anxiety', mentalHealthStatuses.anxiety.value],
        ['Bereavement', mentalHealthStatuses.bereavement.value],
        ['Depression', mentalHealthStatuses.depression.value],
        ['Eating Disorder', mentalHealthStatuses.eatingDisorder.value],
        ['Divorce', mentalHealthStatuses.divorce.value],
        ['Low Self Esteem', mentalHealthStatuses.lowSelfEsteem.value],
        ['Suicidal Thoughts', mentalHealthStatuses.suicidalThoughts.value],
        ['Self Harm', mentalHealthStatuses.selfHarm.value],
        ['Sleeping Difficulties', mentalHealthStatuses.sleepingDifficulties.value],
        ['Stress', mentalHealthStatuses.stress.value],
        ['Panic Attacks', mentalHealthStatuses.panicAttacks.value],
        ['Substance Misuse', mentalHealthStatuses.substanceMisuse.value],
        ['Addiction', mentalHealthStatuses.addiction.value],
        ['Attempted Suicide', mentalHealthStatuses.attemptedSuicide.value]
    ]);

    var pieOptions = {
        title: 'Pals per Mental Health Status',
        width: 1000,
        height: 750
    };

    return {column: {data: columnData, options: columnOptions}, pie: {data: pieData, options: pieOptions}};

}

function genReferralRouteGraphs(statData){

    /**
     * @param google
     * @param google.visualization
     * @param google.visualization.DataTable()
     * @param data
     * @param data.addColumn
     * @param data.addRows
     */

    var referralRoutesFound = 0;
    var statCount = 0;
    var referralRoutes = {};
    while(referralRoutesFound < NUM_REFERRAL_ROUTES){
        if(statData[statCount].value != null) {
            var parts = statData[statCount].name.db.split("_");
            if (parts[0] == "referral") {
                referralRoutes[parts[1]] = statData[statCount].value;
                referralRoutesFound++;
            }
        }
        statCount++;
    }

    var columnData = new google.visualization.DataTable();
    columnData.addColumn('string', 'Referral Route');
    columnData.addColumn('number', 'Number of Pals');

    columnData.addRows([
        [{
            v: "Public Health Service"
        }, referralRoutes.publicHealth.value],
        [{
            v: "Council"
        }, referralRoutes.council.value],
        [{
            v: "GP (General Practitioner)"
        }, referralRoutes.gp.value],
        [{
            v: "NHS (National Health Service)"
        }, referralRoutes.nhs.value],
        [{
            v: "Other"
        }, referralRoutes.other.value],
        [{
            v: "Self"
        }, referralRoutes.self.value]

    ]);

    var columnOptions = {
        title: 'Pals per Referral Route',
        colors: ['#9575cd', '#33ac71'],
        width: 1000,
        height: 750,
        hAxis: {
            //title: 'Referral Route',
            slantedText: true
            //viewWindow: {min: 10,max: 100}
        },
        vAxis: {
            title: 'Number of Pals'
        }
    };

    var pieData = google.visualization.arrayToDataTable([
        ['Referral Route', 'Number of Pals'],
        ['Public Health Service', referralRoutes.publicHealth.value],
        ['Council', referralRoutes.council.value],
        ['GP (General Practitioner)', referralRoutes.gp.value],
        ['NHS (National Health Service)', referralRoutes.nhs.value],
        ['Other', referralRoutes.other.value],
        ['Self', referralRoutes.self.value]
    ]);

    var pieOptions = {
        title: 'Pals per Referral Route',
        width: 1000,
        height: 750
    };

    return {column: {data: columnData, options: columnOptions}, pie: {data: pieData, options: pieOptions}};

}

function graphsAsImages(graphs){
    var images = [];
    graphs.forEach(function(graph){
        images.push({image: graph, width: 500});
    });
    return images;
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
    var subList = {ul: []};

    statistics.forEach(function(statistic) {
        if(statistic.value != null && statistic.name.db.split("_")[0] != "heading") {
            subList.ul.push(statistic.name.hr + ": " + statistic.value);
        } else if(subList.ul.length == 0){
            statisticsList.push(statistic.name.hr + ":");
        } else {
            statisticsList.push(subList);
            statisticsList.push(statistic.name.hr + ":");
            subList = {ul: []};
        }
    });
    statisticsList.push(subList);

    return {list: statisticsList, data: statistics};
}

function statisticCalc(database) {

    /**
     * @param entry
     * @param entry.age
     * @param entry.gender
     * @param entry.carer
     * @param entry.relationship_status
     * @param entry.sexual_orientation
     * @param entry.ethnic_origin
     * @param entry.employment_status
     * @param entry.health_info
     * @param entry.local_authority_area
     * @param entry.electoral_division
     * @param entry.aap_area
     * @param entry.gp_practice
     * @param entry.lower_layer_super_output_area
     * @param entry.middle_layer_super_output_area
     * @param entry.conditions
     * @param entry.conditions.details
     * @param entry.care_coordinator
     * @param entry.referral
     * @param entry.extra_help
     *
     */

    var statistics = [];

    var ageRanges = {bracket20: 0, bracket30: 0, bracket50: 0, bracket70: 0, bracket80: 0};
    var genders = {men: 0, women: 0};
    var carers = {yes: 0, parttime: 0, fulltime: 0};
    var relationship_status = {married: 0, livingTogether: 0, single: 0, inARelationship: 0, livingAlone: 0, divorced: 0, widowed: 0};
    var sexuality = {lgbt: 0, straight: 0, other: 0};
    var ethnicity = {white: 0, black: 0, asian: 0, chinese: 0, mixed: 0, other: 0};
    var employment = {inWork: 0, retired: 0, notWorking: 0, sickLeave: 0, education: 0, other: 0, benefits: 0};
    var healthInfo = {disability: 0, mental: 0, physical: 0};
    var mentalHealthInfo = {anxiety: 0, bereavement: 0, depression: 0, eatingDisorder: 0, divorce: 0, lowSelfEsteem: 0, suicidalThoughts : 0, selfHarm :0, sleepingDifficulties: 0, stress: 0, panicAttacks: 0, substanceMisuse: 0, addiction: 0, attemptedSuicide: 0};
    var mentalHealthStatus = {diagnosed: 0, careCoordinator: 0};
    var referrals = {publicHealthService: 0, councilService: 0, gp: 0, nhs: 0, other: 0, self: 0};
    var isolation = {extraHelp: 0};
    var geographic = {electoralDivision: 0, aapArea: 0, gpPractice: 0};
    geographic.electoralDivision = electoralDivisionList();
    geographic.aapArea = aapAreaList();

    database.forEach(function(entry){

        //Age Range
        if(entry.age <= 24 ){
            ageRanges.bracket20 += 1;
        } else if(entry.age <= 44){
            ageRanges.bracket30 += 1;
        } else if(entry.age <= 64){
            ageRanges.bracket50 += 1;
        } else if(entry.age <= 74){
            ageRanges.bracket70 += 1;
        } else if(entry.age > 74){
            ageRanges.bracket80 +=1;
        }

        //Gender
        if(entry.gender == "M"){
            genders.men += 1;
        } else if(entry.gender == "F"){
            genders.women += 1;
        }

        //Carers
        if(entry.carer == "Yes" ){
            carers.yes += 1;
        } else if(entry.carer == "fulltime"){
            carers.fulltime += 1;
        } else if(entry.carer == "parttime"){
            carers.parttime += 1;
        }

        //Relationship Info:
        if(entry.relationship_status == "Married"){
            relationship_status.married += 1;
        } else if(entry.relationship_status == "Living Together"){
            relationship_status.livingTogether += 1;
        } else if(entry.relationship_status == "Single"){
            relationship_status.single += 1;
        } else if(entry.relationship_status == "In A Relationship"){
            relationship_status.inARelationship += 1;
        } else if(entry.relationship_status == "Living Alone"){
            relationship_status.livingAlone += 1;
        } else if(entry.relationship_status == "Divorced/Separated"){
            relationship_status.divorced += 1;
        } else if(entry.relationship_status == "Widowed"){
            relationship_status.widowed += 1;
        }

        //Sexual Orientation
        if(entry.sexual_orientation == "LGBT"){
            sexuality.lgbt += 1;
        } else if(entry.sexual_orientation == "Straight"){
            sexuality.straight += 1;
        } else if(entry.sexual_orientation == "other"){
            sexuality.other += 1;
        }

        //Ethnic Orientation
        if(entry.ethnic_origin == "White"){
            ethnicity.white += 1;
        } else if(entry.ethnic_origin == "Black"){
            ethnicity.black += 1;
        } else if(entry.ethnic_origin == "Asian"){
            ethnicity.asian += 1;
        } else if(entry.ethnic_origin == "Chinese"){
            ethnicity.chinese += 1;
        } else if(entry.ethnic_origin == "Mixed"){
            ethnicity.mixed += 1;
        } else if(entry.ethnic_origin == "Other"){
            ethnicity.other += 1;
        }

        //Employment Status
        if(entry.employment_status == "In Work"){
            employment.inWork += 1;
        } else if(entry.employment_status == "Retired"){
            employment.retired += 1;
        } else if(entry.employment_status == "Not currently working"){
            employment.notWorking += 1;
        } else if(entry.employment_status == "On sick leave"){
            employment.sickLeave += 1;
        } else if(entry.employment_status == "In Education or Training"){
            employment.education += 1;
        } else if(entry.employment_status == "Other"){
            employment.other += 1;
        } else if(entry.employment_status == "In receipt of Benefit"){
            employment.benefits += 1;
        }

        //Geographic Data

        //Electoral Division (Councillor Ward)
        Object.keys(geographic.electoralDivision).forEach(function(division){
           if(entry.electoral_division == geographic.electoralDivision[division].hr){
               geographic.electoralDivision[division].value += 1;
           }
        });

        //AAP Area
        Object.keys(geographic.aapArea).forEach(function(area){
            if(entry.aap_area == geographic.aapArea[area].hr){
                geographic.aapArea[area].value += 1;
            }
        });

        //GP Practice
        //TODO: Add GP Practices

        //Health Info
        if(entry.disability == true){
            healthInfo.disability += 1;
            if(entry.conditions.type == "physical" || entry.conditions.type == "sensory"){
                healthInfo.physical += 1;
            } else if(entry.conditions.type == "mental health" || entry.conditions.type == "cognitive"){
                healthInfo.mental += 1;
            }
        }

        //Mental Health Info
        if(entry.conditions != null) {
            if ((entry.conditions.details).includes("Anxiety")) {
                mentalHealthInfo.anxiety += 1;
            }
            if ((entry.conditions.details).includes("Bereavement/Loss")) {
                mentalHealthInfo.bereavement += 1;
            }
            if ((entry.conditions.details).includes("Depression")) {
                mentalHealthInfo.depression += 1;
            }
            if ((entry.conditions.details).includes("Eating Issues")) {
                mentalHealthInfo.eatingDisorder += 1;
            }
            if ((entry.conditions.details).includes("Divorce/Separation")) {
                mentalHealthInfo.divorce += 1;
            }
            if ((entry.conditions.details).includes("Low Self Esteem")) {
                mentalHealthInfo.lowSelfEsteem += 1;
            }
            if ((entry.conditions.details).includes("Suicidal Thoughts")) {
                mentalHealthInfo.suicidalThoughts += 1;
            }
            if ((entry.conditions.details).includes("Self Harm")) {
                mentalHealthInfo.selfHarm += 1;
            }
            if ((entry.conditions.details).includes("Sleeping Difficulties")) {
                mentalHealthInfo.sleepingDifficulties += 1;
            }
            if ((entry.conditions.details).includes("Stress")) {
                mentalHealthInfo.stress += 1;
            }
            if ((entry.conditions.details).includes("Panic Attacks")) {
                mentalHealthInfo.panicAttacks += 1;
            }
            if ((entry.conditions.details).includes("Substance Misuse")) {
                mentalHealthInfo.substanceMisuse += 1;
            }
            if ((entry.conditions.details).includes("Addiction")) {
                mentalHealthInfo.addiction += 1;
            }
            if ((entry.conditions.details).includes("Attempted suicide in last 12 months")) {
                mentalHealthInfo.attemptedSuicide += 1;
            }
        }

        //Status in Mental Health
        if(entry.conditions != null) {
            if (entry.conditions.diagnosed == true) {
                mentalHealthStatus.diagnosis += 1;
            }
        }
        if(entry.care_coordinator == true){
            mentalHealthStatus.careCoordinator += 1;
        }

        //Referrals
        if(entry.referral == "Public Health Service"){
            referrals.publicHealthService += 1;
        } else if(entry.referral == "Council Service"){
            referrals.councilService += 1;
        } else if(entry.referral == "GP"){
            referrals.gp += 1;
        } else if(entry.referral == "NHS Service"){
            referrals.nhs += 1;
        } else if(entry.referral == "Other"){
            referrals.other += 1;
        } else if(entry.referral == "Self"){
            referrals.self += 1;
        }

        //Isolation
        if(entry.extra_help == true){
            isolation.extraHelp += 1;
        }

    });

    //Age Ranges
    statistics.push({name: {db: "heading_ageRange", hr: "Age Range of Pals"}, value: null});
    statistics.push({name: {db: "ageRange_20", hr: "Age Range: 18-24"}, value: ageRanges.bracket20});
    statistics.push({name: {db: "ageRange_30", hr: "Age Range: 25-44"}, value: ageRanges.bracket30});
    statistics.push({name: {db: "ageRange_50", hr: "Age Range: 45-64"}, value: ageRanges.bracket50});
    statistics.push({name: {db: "ageRange_70", hr: "Age Range: 65-74"}, value: ageRanges.bracket70});
    statistics.push({name: {db: "ageRange_80", hr: "Age Range: 75+"}, value: ageRanges.bracket80});
    //Genders
    statistics.push({name: {db: "heading_gender", hr: "Gender of Pals"}, value: null});
    statistics.push({name: {db: "gender_male", hr: "Male pals"}, value: genders.men});
    statistics.push({name: {db: "gender_female", hr: "Female pals"}, value: genders.women});
    //Carers
    statistics.push({name: {db: "heading_carer", hr: "How many Pals are Carers"}, value: null});
    statistics.push({name: {db: "carer_yes", hr: "\"Yes\" carers"}, value: carers.yes});
    statistics.push({name: {db: "carer_fulltime", hr: "Full-time carers"}, value: carers.fulltime});
    statistics.push({name: {db: "carer_partime", hr: "Part-time carers"}, value: carers.parttime});
    //Relationship Statuses
    statistics.push({name: {db: "heading_relationshipStatus", hr: "Relationship Status of Pals"}, value: null});
    statistics.push({name: {db: "relationshipStatus_married", hr: "Married pals"}, value: relationship_status.married});
    statistics.push({name: {db: "relationshipStatus_livingTogether", hr: "Pals living with someone"}, value: relationship_status.livingTogether});
    statistics.push({name: {db: "relationshipStatus_single", hr: "Single Pals"}, value: relationship_status.single});
    statistics.push({name: {db: "relationshipStatus_inARelationship", hr: "Pals in a relationship"}, value: relationship_status.inARelationship});
    statistics.push({name: {db: "relationshipStatus_livingAlone", hr: "Pals living alone"}, value: relationship_status.livingAlone});
    statistics.push({name: {db: "relationshipStatus_divorced", hr: "Divorced or separated Pals"}, value: relationship_status.divorced});
    statistics.push({name: {db: "relationshipStatus_widowed", hr: "Widowed Pals"}, value: relationship_status.widowed});
    //Sexuality
    statistics.push({name: {db: "heading_sexuality", hr: "Sexual Orientation of Pals"}, value: null});
    statistics.push({name: {db: "sexuality_lgbt", hr: "LGBT Pals"}, value: sexuality.lgbt});
    statistics.push({name: {db: "sexuality_straight", hr: "Straight Pals"}, value: sexuality.straight});
    statistics.push({name: {db: "sexuality_other", hr: "Pals with Other sexual orientation"}, value: sexuality.other});
    //Ethnicity
    statistics.push({name: {db: "heading_ethnicity", hr: "Ethnicity of Pals"}, value: null});
    statistics.push({name: {db: "ethnicity_white", hr: "White Pals"}, value: ethnicity.white});
    statistics.push({name: {db: "ethnicity_black", hr: "Black Pals"}, value: ethnicity.black});
    statistics.push({name: {db: "ethnicity_asian", hr: "Asian Pals"}, value: ethnicity.asian});
    statistics.push({name: {db: "ethnicity_chinese", hr: "Chinese Pals"}, value: ethnicity.chinese});
    statistics.push({name: {db: "ethnicity_mixed", hr: "Mixed Pals"}, value: ethnicity.mixed});
    statistics.push({name: {db: "ethnicity_other", hr: "Other Pals"}, value: ethnicity.other});
    //Employment
    statistics.push({name: {db: "heading_employment", hr: "Employment Status of Pals"}, value: null});
    statistics.push({name: {db: "employment_inWork", hr: "Pals in work"}, value: employment.inWork});
    statistics.push({name: {db: "employment_retired", hr: "Retired Pals"}, value: employment.retired});
    statistics.push({name: {db: "employment_notWorking", hr: "Pals not working"}, value: employment.notWorking});
    statistics.push({name: {db: "employment_sickLeave", hr: "Pals on sick leave"}, value: employment.sickLeave});
    statistics.push({name: {db: "employment_education", hr: "Pals in education"}, value: employment.education});
    statistics.push({name: {db: "employment_other", hr: "Pals in other employment"}, value: employment.other});
    statistics.push({name: {db: "employment_benefits", hr: "Pals receiving benefits"}, value: employment.benefits});
    //Geographical Data
    statistics.push({name: {db: "heading_electoral_division", hr: "Pals who live in each electoral division"}, value: null});
    Object.keys(geographic.electoralDivision).forEach(function(division){
        statistics.push({name: {db: "geographic_electoral_division_" + division, hr: geographic.electoralDivision[division].hr}, value: geographic.electoralDivision[division].value});
    });
    statistics.push({name: {db: "heading_aap_area", hr: "Pals who live in each AAP Area"}, value: null});
    Object.keys(geographic.aapArea).forEach(function(area){
        statistics.push({name: {db: "geographic_aap_area_" + area, hr: geographic.aapArea[area].hr}, value: geographic.aapArea[area].value});
    });
    //Health Info
    statistics.push({name: {db: "heading_healthInfo", hr: "Health Info of Pals"}, value: null});
    statistics.push({name: {db: "healthInfo_disability", hr: "Pals with a disability"}, value: healthInfo.disability});
    statistics.push({name: {db: "healthInfo_physical", hr: "Pals with physical disability"}, value: healthInfo.physical});
    statistics.push({name: {db: "healthInfo_mental", hr: "Pals with mental disability"}, value: healthInfo.mental});
    //Mental Health Info
    statistics.push({name: {db: "heading_mentalHealthInfo", hr: "Mental Health Conditions of Pals"}, value: null});
    statistics.push({name: {db: "mentalHealthInfo_anxiety", hr: "Pals with Anxiety"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_bereavement", hr: "Pals suffering from bereavement/loss"}, value: mentalHealthInfo.bereavement});
    statistics.push({name: {db: "mentalHealthInfo_depression", hr: "Pals with Depression"}, value: mentalHealthInfo.depression});
    statistics.push({name: {db: "mentalHealthInfo_eatingDisorder", hr: "Pals with eating disorder"}, value: mentalHealthInfo.eatingDisorder});
    statistics.push({name: {db: "mentalHealthInfo_divorce", hr: "Pals suffering with divorce"}, value: mentalHealthInfo.divorce});
    statistics.push({name: {db: "mentalHealthInfo_lowSelfEsteem", hr: "Pals with low self esteem"}, value: mentalHealthInfo.lowSelfEsteem});
    statistics.push({name: {db: "mentalHealthInfo_suicidalThoughts", hr: "Pals with suicidal thoughts"}, value: mentalHealthInfo.suicidalThoughts});
    statistics.push({name: {db: "mentalHealthInfo_selfHarm", hr: "Pals who self harm"}, value: mentalHealthInfo.selfHarm});
    statistics.push({name: {db: "mentalHealthInfo_sleepingDifficulties", hr: "Pals that have difficulties with sleeping"}, value: mentalHealthInfo.sleepingDifficulties});
    statistics.push({name: {db: "mentalHealthInfo_stress", hr: "Pals suffering from stress"}, value: mentalHealthInfo.stress});
    statistics.push({name: {db: "mentalHealthInfo_panicAttacks", hr: "Pals who suffer from panic attacks"}, value: mentalHealthInfo.panicAttacks});
    statistics.push({name: {db: "mentalHealthInfo_substanceMisuse", hr: "Pals that misuse substances"}, value: mentalHealthInfo.substanceMisuse});
    statistics.push({name: {db: "mentalHealthInfo_addiction", hr: "Pals that suffer from addiction"}, value: mentalHealthInfo.addiction});
    statistics.push({name: {db: "mentalHealthInfo_attemptedSuicide", hr: "Pals that have attempted suicide in the past 12 months"}, value: mentalHealthInfo.attemptedSuicide});
    //Mental Health Status
    statistics.push({name: {db: "heading_mentalHealthStatus", hr: "Mental Health Status of Pals"}, value: null});
    statistics.push({name: {db: "mentalHealthStatus_diagnosed", hr: "Pals that have a diagnosed mental health condition"}, value: mentalHealthStatus.diagnosed});
    statistics.push({name: {db: "mentalHealthStatus_careCoordinator", hr: "Pals with a care coordinator"}, value: mentalHealthStatus.careCoordinator});
    //Referrals
    statistics.push({name: {db: "heading_referral", hr: "How were Pals referred to RT"}, value: null});
    statistics.push({name: {db: "referral_publicHealth", hr: "Pals that were referred by a public health service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_council", hr: "Pals that were referred by a council service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_gp", hr: "Pals that were referred by a/their GP"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_nhs", hr: "Pals that were referred by a NHS service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_other", hr: "Pals that were referred by another service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_self", hr: "Pals that weren't referred by anyone"}, value: referrals.self});
    //Isolation
    statistics.push({name: {db: "heading_isolation", hr: "Isolation details of Pals"}, value: null});
    statistics.push({name: {db: "isolation_extraHelp", hr: "Pals that are using extra help"}, value: isolation.extraHelp});

    return statistics;

}

function filteredTable(entries, columns) {
    var widths = [];
    columns.forEach(function() {
        widths.push('auto');
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
            if(column.db == "dob") {
                entry.push(dateToDob(entryData[column.db]).toString());
            } else {
                entry.push(entryData[column.db].toString());
            }
        });
        body.push(entry);
    });

    return body;

}

function dateToDob(date){
    //Mon Apr 07 1997 00:00:00 GMT+0100 (GMT Daylight Time)
    //to 07 Apr 1997
    var dateParts = date.toString().split(" ");
    return dateParts[2] + " " + dateParts[1] + " " + dateParts[3];
}

function electoralDivisionList(){
    var electoralDivisions = [
        "Annfield Plain", "Aycliffe East", "Aycliffe North and Midridge", "Aycliffe West", //4
        "Barnard Castle East", "Barnard Castle West", "Belmont", "Benfieldside", "Bishop Auckland Town", "Bishop Middleham and Cornforth", "Blackhalls", "Brandon", "Burnopfield and Dipton", //9 //13
        "Chester-le-Street East", "Chester-le-Street North", "Chester-le-Street South", "Chester-le-Street West Central", "Chilton", "Consett North", "Consett South", "Coundon", "Coxhoe", "Craghead and South Moor", "Crook", //11 //24
        "Dawdon", "Deerness", "DelvesLane", "Deneside", "Durham South", //5 //29
        "Easington", "Elvet and Gilesgate", "Esh and Witton Gilbert", "Evenwood", //4 //33
        "Ferryhill", "Framwellgate and Newton Hall", //2 //35
        "Horden", //1 //36
        "Lanchester", "Leadgate and Medomsley", "Lumley", //3 //39
        "Murton", "Nevilles Cross", "North Lodge", //3 //42
        "Passfield", "Pelton", "Peterlee East", "Peterlee West", //4 //46
        "Sacriston", "Seaham", "Sedgefield", "Sherburn", "Shildon and Dene Valley", "Shotton South Hetton", "Spennymoor", "Stanley", //8 //54
        "Tanfield", "Tow Law", "Trimdon and Thornley", "Tudhoe", //4 //58
        "Weardale", "West Auckland", "Willington and Hunwick", "Wingate", "Woodhouse Close" //5 //63
    ];

    var electoralDivisionsAsObject = {};

    var dbDivision;
    electoralDivisions.forEach(function(division){
        dbDivision = hrtodb(division);
        electoralDivisionsAsObject[dbDivision] = {hr: division, value: 0};
    });

    return electoralDivisionsAsObject;

}

function aapAreaList(){
    var aapAreas = [
        "Three Towns Partnership", "Four Together Partnership",
        "Bishop Auckland and Shildon",
        "Chester-le-Street and District",
        "Derwent Valley", "Durham",
        "East Durham", "East Durham Rural Corridor",
        "Mid Durham", "Great Aycliffe and Middridge Partnership",
        "Spennymoor", "Stanley",
        "Teesdale",
        "Weardale" //14
        ];

    var aapAreasAsObject = {};

    var dbArea;
    aapAreas.forEach(function(area){
        dbArea = hrtodb(area);
        aapAreasAsObject[dbArea] = {hr: area, value: 0};
    });

    return aapAreasAsObject;
}

function hrtodb(hrName){

    var processedName = hrName.replace("-", "");
    var parts = processedName.split(" ");
    var dbName = "";
    dbName += parts[0];
    for(var i = 1; i < parts.length; i++){
        dbName += parts[i].substring(0,1).toUpperCase() + parts[i].substring(1);
    }
    return dbName;

}