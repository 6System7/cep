// db: database column title, hr: human readable column title
var columns;
var filters;

// can only get slider values nicely on slide event
var minAge = 20,
    maxAge = 50;

$(document).ready(function() {
    initialiseAgeSlider();

    // Generate table
    loadAllPals();

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
                if(filteredDataset.pals[palIndex][column]) {
                    if (column == "dob") {
                         elem.text(filteredDataset.pals[palIndex][column].toLocaleDateString());
                    } else {
                        elem.text(filteredDataset.pals[palIndex][column]);
                    }
                }else {
                    elem.text("-");
                }
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
            db: "_id",
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
    var chkDOB = $("#chkDOB")[0];
    if (chkDOB.checked) {
        columns.push({
            db: "dob",
            hr: chkDOB.value
        });
    }

    // Always go last because it's the edit button --> goes on end.
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
            column: {
                db: "firstName",
                hr: "First Name"
            },
            type: "contains",
            value: txtFname.val()
        });
    }

    var txtLname = $("#txtLastName");
    if (txtLname.val()) {
        filters.push({
            column: {
                db: "lastName",
                hr: "Last Name"
            },
            type: "contains",
            value: txtLname.val()
        });
    }

    var chkProfessionallyDiagnosed = $("#chkProfessionallyDiagnosed")[0];
    if (chkProfessionallyDiagnosed.checked) {
        filters.push({
            column: {
                db: "professionallyDiagnosed", // TODO what is this actually called in db? Is it one column or one per condition?
                hr: "Professionally Diagnosed"
            },
            type: "equals",
            value: true
        });
    };

    filters.push({
        column: {
            db: "dob",
            hr: "DOB"
        },
        type: "range",
        value: "" + minAge + "%" + maxAge
      //  value: [minAge, maxAge]
    });

    refreshTableWithFilters(chosenDataset, filters);
}

function matchesFilters(pal, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filter.type === "contains") {
            if (!pal[filter.column.db].toLowerCase().includes(filter.value.toLowerCase())) {
                return false;
            }
        } else if (filter.type === "range") {
            if (filter.column.db === "dob" && pal[filter.column.db]) {
                var xArray = filter.value.split("%")
                var minAge = parseInt(xArray[0]);
                var maxAge = parseInt(xArray[1]);
                var ageDate = new Date(Date.now() - pal[filter.column.db].getTime()); // miliseconds from epoch
                y = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (!(y > minAge && y < maxAge)){
                    return false;
                }
            }
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
    $.ajax({
        method: "POST",
        url: "addPal",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({
            pals:[pal]
        })
    }).always(function() {
        loadAllPals();
    });
}

function generateReport() {
    // Don't allow the view as report link to remain "active"
    $("#reportGenLi").removeClass("active");

    // Extract pal arrays for report gen
    var databaseFR = dataset.pals;
    var filteredDatabaseFR = filteredDataset.pals;
    // Remove non-database columns (such as edit)
    var columnsFR = columns.filter(c => c.hasOwnProperty("db")); //.map(c => c.db);

    var data = {
        database: databaseFR,
        columns: columnsFR,
        filters: filters,
        filteredDatabase: filteredDatabaseFR
    }

    google.charts.setOnLoadCallback(genReport(data));
}

function loadAllPals() {
    // Now regenerate rows to show new info
    $.ajax("getPal").done(function(pals) {
        /*for (var palIndex = 0; palIndex < dataset.pals.length; palIndex++){
          ///  var column = columns[columnIndex].db;
                //if(filteredDataset.pals[palIndex][column]) {
                    //if (column == "dob") {
                      ///   elem.text(filteredDataset.pals[palIndex][column];
                dataset.pals[palIndex].dob.value = new Date(dataset.pals[palIndex].dob.value);
        }
       */
        
      
         /* ///  var column = columns[columnIndex].db;
                //if(filteredDataset.pals[palIndex][column]) {
                    //if (column == "dob") {
                      ///   elem.text(filteredDataset.pals[palIndex][column];
                pals[palIndex].dob.value = new Date(pals[palIndex].dob.value;
        */
        dataset = {"pals": pals};
       for (var palIndex = 0; palIndex < dataset.pals.length; palIndex++){
            alert(dataset.pals[palIndex].dob);
           dataset.pals[palIndex].dob = new Date( dataset.pals[palIndex].dob);
        }
        
        refreshTable(dataset);
    });
}

 // var x = new Date(1971, 08, 22)
 // var xx = new Date(1981, 08, 22)
 //xx = xx.toLocaleDateString();
// var dataset = {
//
//  pals: [{
//         id: 0,
//         firstName: "Maddy",
//         lastName: "Sands",
//         email: "hereareyour@oa.ts",
//         dob: x
//     }, {
//         id: 1,
//         firstName: "Mike",
//         lastName: "Croall",
//         email: "brothermayihavesome@oa.ts",
//         dob: x
//
//     }, {
//         id: 2,
//         firstName: "John",
//         lastName: "Doe",
//         email: "john@doe.zz.vc",
//         dob: xx
//     }]
// };
var dataset = {
    pals: []
};

var filteredDataset = {
    pals: []
};
