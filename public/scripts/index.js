// db: database column title, hr: human readable column title
var columns;
var filters;

// can only get slider values nicely on slide event
var minAge = 20,
    maxAge = 50;

$(document).ready(function() {
    initialiseAgeSlider();

    // Generate table
    refreshTable(dataset);

    // Attach search button callback
    $("#btnUpdate").click(function() {
        refreshTable(dataset);
    });

    window.closeModal = function() {
        $('#myModal').modal('hide');
    }

    // Dynamically change title
    $("#addPalBtn").click(function() {
        $("#addEditFormTitle").text("Add a new PAL");
        // Ensure inputs are cleared (they get cleared on submit, not on 'Cross' click to exit)
        window.frames["addPalIframe"].clearInputs();
    });

    $("#checkAllPersonal").change(function() {
        $("#personalDataCheckboxes input:checkbox").prop('checked', $(this).prop("checked"));
    });

    $("#checkAllOther").change(function() {
        $("#othercheckboxes input:checkbox").prop('checked', $(this).prop("checked"));
    });

});

function initialiseAgeSlider() {
    var sliderElement = $("#trcAge");

    // Create age slider
    sliderElement.slider({
        id: "trcAge"
        // tooltip: "always"
    });

    // Attach age slider label
    sliderElement.on("slide", function(slideEvt) {
        minAge = slideEvt.value[0];
        maxAge = slideEvt.value[1];
        $("#trcAgeSelection").text(slideEvt.value.join(" - "));
    });
}

function generateRows() {
    var tableBody = $("#tBodyPals");
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
                    btn.click(function() {
                        var pal = $(this).data("palJson");
                        window.frames["addPalIframe"].editPal(pal);
                        $("#addEditFormTitle").text("Edit a PAL");
                    });
                    elem.append(btn);
                }
            }
            row.append(elem);
        }
        tableBody.append(row);
    }
}

function refreshTableWithFilters(chosenDataset, filters = []) {
    var tableHeadRow = $("#tHeadPalsRow");
    tableHeadRow.empty();

    // Generate column headers
    for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        var tdColumnHeader = $("<th>");
        tdColumnHeader.addClass("hover-show-arrow");
        tdColumnHeader.text(columns[columnIndex].hr);
        if (columns[columnIndex].db) {
            // Create arrows to show column is sortable (only shown on hover)
            var arrowContainer = $("<div>");
            arrowContainer.addClass("arrow-container");
            var arrowUp = $("<div>");
            arrowUp.addClass("arrow-up");
            arrowUp.data("db", columns[columnIndex].db);
            var arrowDown = $("<div>");
            arrowDown.addClass("arrow-down");
            arrowDown.data("db", columns[columnIndex].db);
            arrowUp.click(function() {
                var db = $(this).data("db");
                sortByColumn(filteredDataset, db);
            });
            arrowDown.click(function() {
                var db = $(this).data("db");
                sortByColumn(filteredDataset, db, -1);
            });
            arrowContainer.append(arrowUp);
            arrowContainer.append(arrowDown);
            tdColumnHeader.append(arrowContainer);
        }
        tableHeadRow.append(tdColumnHeader);
    }

    // Generate filtered dataset (Stored separately for report generation to access filtered and full dataset)
    filteredDataset.pals = [];
    for (var palIndex = 0; palIndex < chosenDataset.pals.length; palIndex++) {
        if (matchesFilters(chosenDataset.pals[palIndex], filters)) {
            filteredDataset.pals.push(chosenDataset.pals[palIndex]);
        }
    }

    // Generate rows
    generateRows();
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
    filters = [];

    var txtFname = $("#txtFirstName");
    if (txtFname.val()) {
        filters.push({
            column: "firstName",
            type: "contains",
            value: txtFname.val()
        });
    }

    var txtLname = $("#txtLastName");
    if (txtLname.val()) {
        filters.push({
            column: "lastName",
            type: "contains",
            value: txtLname.val()
        });
    }

    filters.push({
        column: "age",
        type: "range",
        value: "" + minAge + "%" + maxAge
    });

    refreshTableWithFilters(chosenDataset, filters);
}

function matchesFilters(pal, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filter.type === "contains") {
            if (!pal[filter.column].toLowerCase().includes(filter.value.toLowerCase())) {
                return false;
            }
        } else if (filter.type === "range") {
            // TODO add age calculation from DOB from db etc blah send help
        }
    }
    return true;
}

function sortByColumn(chosenDataset, db, modifier = 1) {
    // modifier is used to switch between ascending/descending
    chosenDataset.pals.sort(function(a, b) {
        if (a[db] < b[db]) {
            return -1 * modifier;
        } else if (a[db] > b[db]) {
            return 1 * modifier;
        } else {
            return 0;
        }
    });

    // Regenerate rows of table after sorting
    generateRows();
}

function alterOrAddPal(pal) {
    if (pal.hasOwnProperty("id")) {
        for (var i = 0; i < dataset.pals.length; i++) {
            if (dataset.pals[i].id && dataset.pals[i].id === pal.id) {
                // If same pal, update them
                dataset.pals[i] = pal;
                // Stop checking (IDs are unique)
                break;
            }
        }
    } else {
        console.log("No ID found, let database generate one for new pal");
        /* Pal NEEDS an ID for adding/editing to work properly TODO make id come from database auto-gen (send updated pal to server, wait for pal back with ID?)*/
        pal.id = (new Date()).getTime();
        dataset.pals.push(pal);
    }
    // TODO send new/altered pal info to server

    // Now regenerate rows to show new info
    refreshTable(dataset);
}

function generateReport() {
    // Don't allow the view as report link to remain "active"
    $("#reportGenLi").removeClass("active");

    // Extract pal arrays for report gen
    var databaseFR = dataset.pals;
    var filteredDatabaseFR = filteredDataset.pals;
    // Remove non-database columns (such as edit), and pass in 'db' names
    var columnsFR = columns.filter(c => c.hasOwnProperty("db")).map(c => c.db);

    var data = {
        database: databaseFR,
        columns: columnsFR,
        filters: filters,
        filteredDatabase: filteredDatabaseFR
    }

    google.charts.setOnLoadCallback(genReport(data));
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
