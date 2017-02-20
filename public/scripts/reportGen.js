/**
 * Created by Jordan Craig for RT Projects on 30/01/2017.
 * Requires PDFMake and Google Charts to work.
 */

function genReport(reportData) {
    console.log("generating report...");

    genGraphs(reportData);
}

function genPDF(reportData, graphs) {

    //var database = reportData.database;
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
                text: '\n\nStatistics',
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
            graphsAsImages(graphs)
        ]
    };

    console.log("report generated...");

    // open the PDF in a new window
    pdfMake.createPdf(docDefinition).open();

}

function genGraphs(reportData){

    /**
     * @param chart         The basic Chart object .
     * @param chart.draw    The draw function of the chart object, draws the graph to chart_div.
     * @param chart.getImageURI
     * @param google
     * @param google.visualization
     * @param google.visualization.ColumnChart
     */

    var ageRangeGraphDetails = genAgeRangeGraph();
    var relationshipStatusGraphDetails = genRelationshipStatusGraph();
    var electoralDivisionGraphDetails = genElectoralDivisionGraph();
    var aapAreaGraphDetails = genAAPAreaGraph();
    var mentalHealthInfoGraphDetails = genMentalHealthInfoGraph();
    var referralRouteGraphDetails = genReferralRouteGraph();

    var chartURIs = [];

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(ageRangeGraphDetails.data, ageRangeGraphDetails.options);
    chartURIs.push(chart.getImageURI());
    //chart.draw(relationshipStatusGraphDetails.data, relationshipStatusGraphDetails.options);
    //chartURIs.push(chart.getImageURI());
    //chart.draw(electoralDivisionGraphDetails.data, electoralDivisionGraphDetails.options);
    //chartURIs.push(chart.getImageURI());
    //chart.draw(aapAreaGraphDetails.data, aapAreaGraphDetails.options);
    //chartURIs.push(chart.getImageURI());
    //chart.draw(mentalHealthInfoGraphDetails.data, mentalHealthInfoGraphDetails.options);
    //chartURIs.push(chart.getImageURI());
    //chart.draw(referralRouteGraphDetails.data, referralRouteGraphDetails.options);
    //chartURIs.push(chart.getImageURI());
    //google.visualization.events.addListener(chart, 'ready', function () {
    genPDF(reportData, chartURIs);
    //});

}

function genAgeRangeGraph(){

    /**
     * @param google
     * @param google.visualization
     * @param google.visualization.DataTable()
     * @param data
     * @param data.addColumn
     * @param data.addRows
     */

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

    return {data: data, options: options};
}

function genRelationshipStatusGraph(){

}

function genElectoralDivisionGraph(){

}

function genAAPAreaGraph(){

}

function genMentalHealthInfoGraph(){

}

function genReferralRouteGraph(){

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

    return statisticsList;
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
    var mentalHealthInfo = {anxiety: 0, bereavement: 0, depression: 0, eatingDisorder: 0, divorce: 0, lowSelfEsteem: 0, suicidalThoughts : 0, selfHarm :0, sleepingDifficulties: 0, stress: 0, panicAttacks: 0, drugMisuse: 0, addiction: 0, attemptedSuicide: 0};
    var mentalHealthStatus = {diagnosed: 0, careCoordinator: 0};
    var referrals = {publicHealthService: 0, councilService: 0, gp: 0, nhs: 0, other: 0, self: 0};
    var isolation = {extraHelp: 0};
    var geographic = {localAuthorityArea: 0, electoralDivision: 0, aapArea: 0, gpPractice: 0, middleLayerSuper: 0, lowerLayerSuper: 0};
    geographic.localAuthorityArea = localAuthorityAreaList();
    geographic.electoralDivision = electoralDivisionList();
    geographic.aapArea = aapAreaList();

    database.forEach(function(entry){

        //Age Range
        console.log(entry);
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
        //Local Authority Area
        Object.keys(geographic.localAuthorityArea).forEach(function(area){
            if(entry.local_authority_area == geographic.localAuthorityArea[area].hr){
                geographic.localAuthorityArea[area].value += 1;
            }
        });

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

        //Middle Layer Super Output Area
        Object.keys(geographic.middleLayerSuper).forEach(function(area){
            if(entry.middle_layer_super_output_area == geographic.middleLayerSuper[area].hr){
                geographic.middleLayerSuper[area].value += 1;
            }
        });

        //Lower Layer Super Output Area
        Object.keys(geographic.lowerLayerSuper).forEach(function(area){
            if(entry.lower_layer_super_output_area == geographic.lowerLayerSuper[area].hr){
                geographic.lowerLayerSuper[area].value += 1;
            }
        });

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
    statistics.push({name: {db: "relationshipStatus_living_together", hr: "Pals living with someone"}, value: relationship_status.livingTogether});
    statistics.push({name: {db: "relationshipStatus_single", hr: "Single Pals"}, value: relationship_status.single});
    statistics.push({name: {db: "relationshipStatus_in_a_relationship", hr: "Pals in a relationship"}, value: relationship_status.inARelationship});
    statistics.push({name: {db: "relationshipStatus_living_alone", hr: "Pals living alone"}, value: relationship_status.livingAlone});
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
    statistics.push({name: {db: "employment_in_work", hr: "Pals in work"}, value: employment.inWork});
    statistics.push({name: {db: "employment_retired", hr: "Retired Pals"}, value: employment.retired});
    statistics.push({name: {db: "employment_not_working", hr: "Pals not working"}, value: employment.notWorking});
    statistics.push({name: {db: "employment_sick_leave", hr: "Pals on sick leave"}, value: employment.sickLeave});
    statistics.push({name: {db: "employment_education", hr: "Pals in education"}, value: employment.education});
    statistics.push({name: {db: "employment_other", hr: "Pals in other employment"}, value: employment.other});
    statistics.push({name: {db: "employment_benefits", hr: "Pals receiving benefits"}, value: employment.benefits});
    //Geographical Data
    statistics.push({name: {db: "heading_local_authority_area", hr: "Pals who live in each local authority area"}, value: null});
    Object.keys(geographic.localAuthorityArea).forEach(function(area){
        statistics.push({name: {db: "geographic_local_authority_area_" + area, hr: geographic.localAuthorityArea[area].hr}, value: geographic.localAuthorityArea[area].value});
    });
    statistics.push({name: {db: "heading_electoral_division", hr: "Pals who live in each electoral division"}, value: null});
    Object.keys(geographic.electoralDivision).forEach(function(division){
        statistics.push({name: {db: "geographic_electoral_division_" + division, hr: geographic.electoralDivision[division].hr}, value: geographic.electoralDivision[division].value});
    });
    statistics.push({name: {db: "heading_aap_area", hr: "Pals who live in each AAP Area"}, value: null});
    Object.keys(geographic.aapArea).forEach(function(area){
        statistics.push({name: {db: "geographic_aap_area_" + area, hr: geographic.aapArea[area].hr}, value: geographic.aapArea[area].value});
    });
    statistics.push({name: {db: "heading_lower_layer_super", hr: "Pals who live in each Lower Layer Super Output Area"}, value: null});
    Object.keys(geographic.lowerLayerSuper).forEach(function(area){
        statistics.push({name: {db: "geographic_lower_layer_super_" + area, hr: geographic.lowerLayerSuper[area].hr}, value: geographic.lowerLayerSuper[area].value});
    });
    statistics.push({name: {db: "heading_middle_layer_super", hr: "Pals who live in each Middle Layer Super Output Area"}, value: null});
    Object.keys(geographic.middleLayerSuper).forEach(function(area){
        statistics.push({name: {db: "geographic_middle_layer_super_" + area, hr: geographic.middleLayerSuper[area].hr}, value: geographic.middleLayerSuper[area].value});
    });
    //Health Info
    statistics.push({name: {db: "heading_healthInfo", hr: "Health Info of Pals"}, value: null});
    statistics.push({name: {db: "healthInfo_disability", hr: "Pals with a disability"}, value: healthInfo.disability});
    statistics.push({name: {db: "healthInfo_physical", hr: "Pals with physical disability"}, value: healthInfo.physical});
    statistics.push({name: {db: "healthInfo_mental", hr: "Pals with mental disability"}, value: healthInfo.mental});
    //Mental Health Info
    statistics.push({name: {db: "heading_mentalHealthInfo", hr: "Mental Health Conditions of Pals"}, value: null});
    statistics.push({name: {db: "mentalHealthInfo_anxiety", hr: "Pals with Anxiety"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_bereavement", hr: "Pals suffering from bereavement/loss"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_depression", hr: "Pals with Depression"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_eating_issues", hr: "Pals with eating issues"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_divorce", hr: "Pals suffering with divorce"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_low_self_esteem", hr: "Pals with low self esteem"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_suicidal_thoughts", hr: "Pals with suicidal thoughts"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_self_harm", hr: "Pals who self harm"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_sleeping_difficulties", hr: "Pals that have difficulties with sleeping"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_stress", hr: "Pals suffering from stress"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_panic_attacks", hr: "Pals who suffer from panic attacks"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_substance_misuse", hr: "Pals that misuse substances"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_addiction", hr: "Pals that suffer from addiction"}, value: mentalHealthInfo.anxiety});
    statistics.push({name: {db: "mentalHealthInfo_attempted_suicide", hr: "Pals that have attempted suicide in the past 12 months"}, value: mentalHealthInfo.anxiety});
    //Mental Health Status
    statistics.push({name: {db: "heading_mentalHealthStatus", hr: "Mental Health Status of Pals"}, value: null});
    statistics.push({name: {db: "mentalHealthStatus_diagnosed", hr: "Pals that have a diagnosed mental health condition"}, value: mentalHealthStatus.diagnosed});
    statistics.push({name: {db: "mentalHealthStatus_care_coordinator", hr: "Pals with a care coordinator"}, value: mentalHealthStatus.careCoordinator});
    //Referrals
    statistics.push({name: {db: "heading_referral", hr: "How were Pals referred to RT"}, value: null});
    statistics.push({name: {db: "referral_public_health", hr: "Pals that were referred by a public health service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_council", hr: "Pals that were referred by a council service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_gp", hr: "Pals that were referred by a/their GP"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_nhs", hr: "Pals that were referred by a NHS service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_other", hr: "Pals that were referred by another service"}, value: referrals.publicHealthService});
    statistics.push({name: {db: "referral_self", hr: "Pals that weren't referred by anyone"}, value: referrals.self});
    //Isolation
    statistics.push({name: {db: "heading_isolation", hr: "Isolation details of Pals"}, value: null});
    statistics.push({name: {db: "isolation_extra_help", hr: "Pals that are using extra help"}, value: isolation.extraHelp});

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

function localAuthorityAreaList(){
    var localAuthorityAreas = [

    ];

    var localAuthorityAreasAsObject = {};

    var dbArea;
    localAuthorityAreas.forEach(function(area){
        dbArea = hrtodb(area);
        localAuthorityAreasAsObject[dbArea] = {hr: area, value: 0};
    });

    return localAuthorityAreasAsObject;
}

function electoralDivisionList(){
    var electoralDivisions = [
        "Annfield Plain", "Aycliffe East", "Aycliffe North and Midridge", "Aycliffe West",
        "Barnard Castle East", "Barnard Castle West", "Belmont", "Benfieldside", "Bishop Auckland Town", "Bishop Middleham and Cornforth", "Blackhalls", "Brandon", "Burnopfield and Dipton",
        "Chester-le-Street East", "Chester-le-Street North", "Chester-le-Street South", "Chester-le-Street West Central", "Chilton", "Consett North", "Consett South", "Coundon", "Coxhoe", "Craghead and South Moor", "Crook",
        "Dawdon", "Deerness", "DelvesLane", "Deneside", "Durham South",
        "Easington", "Elvet and Gilesgate", "Esh and Witton Gilbert", "Evenwood",
        "Ferryhill", "Framwellgate and Newton Hall",
        "Horden",
        "Lanchester", "Leadgate and Medomsley", "Lumley",
        "Murton", "Nevilles Cross", "North Lodge",
        "Passfield", "Pelton", "Peterlee East", "Peterlee West",
        "Sacriston", "Seaham", "Sedgefield", "Sherburn", "Shildon and Dene Valley", "Shotton South Hetton", "Spennymoor", "Stanley",
        "Tanfield", "Tow Law", "Trimdon and Thornley", "Tudhoe",
        "Weardale", "West Auckland", "Willington and Hunwick", "Wingate", "Woodhouse Close"
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
        "Weardale"
        ];

    var aapAreasAsObject = {};

    var dbArea;
    aapAreas.forEach(function(area){
        dbArea = hrtodb(area);
        aapAreasAsObject[dbArea] = {hr: area, value: 0};
    });

    return aapAreasAsObject;
}

function lowerLayerSuperOutputAreaList(){
    var lowerLayerSuperOutputAreas = [

    ];

    var lowerLayerSuperOutputAreasAsObject = {};

    var dbArea;
    lowerLayerSuperOutputAreas.forEach(function(area){
        dbArea = hrtodb(area);
        lowerLayerSuperOutputAreasAsObject[dbArea] = {hr: area, value: 0};
    });

    return lowerLayerSuperOutputAreasAsObject;
}

function middleLayerSuperOutputAreaList(){
    var middleLayerSuperOutputAreas = [

    ];

    var middleLayerSuperOutputAreasAsObject = {};

    var dbArea;
    middleLayerSuperOutputAreas.forEach(function(area){
        dbArea = hrtodb(area);
        middleLayerSuperOutputAreasAsObject[dbArea] = {hr: area, value: 0};
    });

    return middleLayerSuperOutputAreasAsObject;
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