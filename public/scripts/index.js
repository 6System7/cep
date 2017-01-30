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
        "First Name", "Last Name", "Email"
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

        if ($.inArray("First Name", columnsToShow) > -1) {
            var firstName = dataset.pals[i].firstName || "not present";
            var tdFirstName = $("<td>");
            tdFirstName.text(firstName);
            row.append(tdFirstName);
        }

        if ($.inArray("Last Name", columnsToShow) > -1) {
            var lastName = dataset.pals[i].lastName || "not present";
            var tdLastName = $("<td>");
            tdLastName.text(lastName);
            row.append(tdLastName);
        }

        if ($.inArray("Email", columnsToShow) > -1) {
            var email = dataset.pals[i].email || "not present";
            var tdEmail = $("<td>");
            tdEmail.text(email);
            row.append(tdEmail);
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
