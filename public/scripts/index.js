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

    displayPalSet(dataset);
});

function displayPalSet(dataset) {
    var tableHeadRow = $("#tHeadPalsRow");
    var tableBody = $("#tBodyPals");
    tableHeadRow.empty();
    tableBody.empty();

    // TODO check what columns to display from filters, save in columnsToShow
    var columnsToShow = [
        "firstName", "lastName", "email"
    ];

    // Generate column headers
    for (var i = 0; i < columnsToShow.length; i++) {
        var tdColumnHeader = $("<th>");
        tdColumnHeader.text(columnsToShow[i]);
        tableHeadRow.append(tdColumnHeader);
    }

    // Generate rows
    for (var i = 0; i < dataset.pals.length; i++) {
        var row = $("<tr>");

        for (var j = 0; j < columnsToShow.length; j++) {
            var column = columnsToShow[j];
            var elem = $("<td>");
            elem.text(dataset.pals[i][column] || "not present");
            row.append(elem);
        }
        
        tableBody.append(row);
    }
}

var dataset = {
    pals: [{
        firstName: "Maddy",
        lastName: "Sands",
        email: "Madeleine@Sands.com"
    }, {
        firstName: "Mike",
        lastName: "Croall",
        email: "Notmypres@ide.nt"
    }, {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.zz.vc"
    }]
};
