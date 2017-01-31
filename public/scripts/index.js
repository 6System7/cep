$(document).ready(function() {
    // Create age slider
    $("#trcAge").slider({
        id: "trcAge"
    });

    // Attach age slider label
    $("#trcAge").on("slide", function(slideEvt) {
        // console.log("Age range selected", slideEvt.value);
        $("#trcAgeSelection").text(slideEvt.value.join(" - "));
    });

    // Generate table
    displayPalSet(dataset);
});

function displayPalSet(dataset) {
    var tableHeadRow = $("#tHeadPalsRow");
    var tableBody = $("#tBodyPals");
    tableHeadRow.empty();
    tableBody.empty();

    // TODO check what columns to display from filters, save in columnsToShow
    var columns = [{
        db: "id",
        hr: "ID"
    }, {
        db: "firstName",
        hr: "First Name"
    }, {
        db: "lastName",
        hr: "Last Name"
    }, {
        db: "email",
        hr: "Email"
    }]; // db: database column title, hr: human readable column title

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
            var column = columns[j].db;
            var elem = $("<td>");
            elem.text(dataset.pals[i][column]);
            row.append(elem);
        }

        tableBody.append(row);
    }
}

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
