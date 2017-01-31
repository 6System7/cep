// db: database column title, hr: human readable column title
var columns;

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
    });

    // Attach age slider label
    $("#trcAge").on("slide", function(slideEvt) {
        // console.log("Age range selected", slideEvt.value);
        $("#trcAgeSelection").text(slideEvt.value.join(" - "));
    });
}

function displayPalSet(dataset) {
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
        var row = $("<tr>");

        for (var j = 0; j < columns.length; j++) {
            // TODO check dataset.pals[i][column] fits within filters
            var column = columns[j].db;
            var elem = $("<td>");
            elem.text(dataset.pals[i][column]);
            row.append(elem);
        }

        tableBody.append(row);
    }
}

function applyFilters(dataset) {
    // Load columns
    columns = [];
    var id = $("#chkID")[0];
    if (id.checked) {
        columns.push({
            db: "id",
            hr: id.value
        });
    }
    var fname = $("#chkFirstName")[0];
    if (fname.checked) {
        columns.push({
            db: "firstName",
            hr: fname.value
        });
    }
    var lname = $("#chkLastName")[0];
    if (lname.checked) {
        columns.push({
            db: "lastName",
            hr: lname.value
        });
    }
    var email = $("#chkEmail")[0];
    if (email.checked) {
        columns.push({
            db: "email",
            hr: email.value
        });
    }

    // TODO load filters and create sub-dataset for displaying

    displayPalSet(dataset);
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
