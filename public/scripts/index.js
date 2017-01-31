// db: database column title, hr: human readable column title
var columns;

// can only get slider values nicely on slide event
var minAge = 10,
    maxAge = 50;

$(document).ready(function() {
    initialiseAgeSlider();

    // Generate table
    applyFilters(dataset);

    // Attach search button callback
    $("#btnUpdate").click(function() {
        applyFilters(dataset);
    });
});

function initialiseAgeSlider() {
    // Create age slider
    $("#trcAge").slider({
        id: "trcAge"
        // tooltip: "always"
    });

    // Attach age slider label
    $("#trcAge").on("slide", function(slideEvt) {
        minAge = slideEvt.value[0];
        maxAge = slideEvt.value[1];
        $("#trcAgeSelection").text(slideEvt.value.join(" - "));
    });
}

function displayPalSet(dataset, filters = {}) {
    var tableHeadRow = $("#tHeadPalsRow");
    var tableBody = $("#tBodyPals");
    tableHeadRow.empty();
    tableBody.empty();

    // Generate column headers
    for (var i = 0; i < columns.length; i++) {
        var tdColumnHeader = $("<th>");
        tdColumnHeader.text(columns[i].hr);
        tableHeadRow.append(tdColumnHeader);
    }

    // Generate rows
    for (var i = 0; i < dataset.pals.length; i++) {
        if (matchesFilter(dataset.pals[i], filters)) {
            var row = $("<tr>");

            for (var j = 0; j < columns.length; j++) {
                var column = columns[j].db;
                var elem = $("<td>");
                elem.text(dataset.pals[i][column]);
                row.append(elem);
            }

            tableBody.append(row);
        }
    }
}

function applyFilters(dataset) {
    // Load columns
    columns = [];
    var chkId = $("#chkID")[0];
    if (chkId.checked) {
        columns.push({
            db: "id",
            hr: chkId.value
        });
    }
    var chkFname = $("#chkFirstName")[0];
    if (chkFname.checked) {
        columns.push({
            db: "firstName",
            hr: chkFname.value
        });
    }
    var chkLname = $("#chkLastName")[0];
    if (chkLname.checked) {
        columns.push({
            db: "lastName",
            hr: chkLname.value
        });
    }
    var chkEmail = $("#chkEmail")[0];
    if (chkEmail.checked) {
        columns.push({
            db: "email",
            hr: chkEmail.value
        });
    }

    // Load filters
    var filters = {};

    var txtFname = $("#txtFirstName");
    if (txtFname.val()) {
        filters.firstname = txtFname.val();
    }

    var txtLname = $("#txtLastName");
    if (txtLname.val()) {
        filters.lastname = txtLname.val();
    }

    filters.minAge = minAge;
    filters.maxAge = maxAge;

    displayPalSet(dataset, filters);
}

function matchesFilter(pal, filters) {
    if (filters.firstname && !pal.firstName.toLowerCase().includes(filters.firstname.toLowerCase())) {
        return false;
    }
    if (filters.lastname && !pal.lastName.toLowerCase().includes(filters.lastname.toLowerCase())) {
        return false;
    }
    return true;
}

// TODO get dataset from database
var dataset = {
    pals: [{
        id: 0,
        firstName: "Maddy",
        lastName: "Sands",
        email: "Madeleine@Sands.com"
    }, {
        id: 1,
        firstName: "Mike",
        lastName: "Croall",
        email: "Notmypres@ide.nt"
    }, {
        id: 2,
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.zz.vc"
    }]
};
