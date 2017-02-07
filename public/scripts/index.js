// db: database column title, hr: human readable column title
var columns;

// can only get slider values nicely on slide event
var minAge = 10,
    maxAge = 50;

$(document).ready(function () {
    initialiseAgeSlider();

    // Generate table
    refreshTable(dataset);

    // Attach search button callback
    $("#btnUpdate").click(function () {
        refreshTable(dataset);
    });

    window.closeModal = function () {
        $('#myModal').modal('hide');
    }
});

function initialiseAgeSlider() {
    var sliderElement = $("#trcAge");

    // Create age slider
    sliderElement.slider({
        id: "trcAge"
        // tooltip: "always"
    });

    // Attach age slider label
    sliderElement.on("slide", function (slideEvt) {
        minAge = slideEvt.value[0];
        maxAge = slideEvt.value[1];
        $("#trcAgeSelection").text(slideEvt.value.join(" - "));
    });
}

function generateRows(tableBody) {
    tableBody.empty();
    for (var palIndex = 0; palIndex < filteredDataset.pals.length; palIndex++) {
        var row = $("<tr>");

        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            var elem = $("<td>");
            if (columns[columnIndex].db) {
                var column = columns[columnIndex].db;
                elem.text(filteredDataset.pals[palIndex][column]);
            } else {
                var column = columns[columnIndex].nodb;
                if (column === "edit") {
                    var btn = $("<button>");
                    btn.text("Edit PAL");
                    btn.addClass("btn btn-default btn-sm");
                    btn.attr("type", "button");
                    btn.data("palJson", filteredDataset.pals[palIndex]);
                    btn.attr("data-toggle", "modal");
                    btn.attr("data-target", "#myModal");
                    btn.click(function () {
                        var pal = $(this).data("palJson");
                        window.frames["addPalIframe"].editPal(pal);
                    });
                    elem.append(btn);
                }
            }
            row.append(elem);
        }
        tableBody.append(row);
    }
}
function refreshTableWithFilters(chosenDataset, filters = {}) {
    var tableHeadRow = $("#tHeadPalsRow");
    var tableBody = $("#tBodyPals");
    tableHeadRow.empty();

    // Generate column headers
    for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        var tdColumnHeader = $("<th>");
        tdColumnHeader.addClass("hover-show-arrow");
        tdColumnHeader.text(columns[columnIndex].hr);
        if (columns[columnIndex].db) {
            // Create arrow to show column is sortable (only shown on hover)
            var arrow = $("<div>");
            arrow.addClass("arrow-up");
            tdColumnHeader.append(arrow);
            tdColumnHeader.data("db", columns[columnIndex].db);
            tdColumnHeader.click(function () {
                var db = $(this).data("db");
                // Sort by column and regenerate rows (done by sort method)
                sortByColumn(filteredDataset, db);
            });
        }
        tableHeadRow.append(tdColumnHeader);
    }

    // Generate filtered dataset (Stored separately for report generation to access filtered and full dataset
    filteredDataset.pals = [];
    for (var palIndex = 0; palIndex < chosenDataset.pals.length; palIndex++) {
        if (matchesFilters(chosenDataset.pals[palIndex], filters)) {
            filteredDataset.pals.push(chosenDataset.pals[palIndex]);
        }
    }

    // Generate rows
    generateRows(tableBody);
}

function refreshTable(chosenDataset) {
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
    var chkEdit = $("#chkEdit")[0];
    if (chkEdit.checked) {
        columns.push({
            nodb: "edit",
            hr: chkEdit.value
        })
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

    refreshTableWithFilters(chosenDataset, filters);
}

function matchesFilters(pal, filters) {
    if (filters.firstname && !pal.firstName.toLowerCase().includes(filters.firstname.toLowerCase())) {
        return false;
    }
    if (filters.lastname && !pal.lastName.toLowerCase().includes(filters.lastname.toLowerCase())) {
        return false;
    }
    // TODO add more filters
    return true;
}

function sortByColumn(chosenDataset, db) {
    chosenDataset.pals.sort(function (a, b) {
        if (a[db] < b[db]) {
            return -1;
        } else if (a[db] > b[db]) {
            return 1;
        } else {
            return 0;
        }
    });

    // Regenerate rows of table after sorting
    generateRows($("#tBodyPals"));
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

var filteredDataset = {
    pals: []
};
