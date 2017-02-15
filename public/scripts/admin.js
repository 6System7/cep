var columns;

$(document).ready(function(){
    refreshTable(dataset);
})

function refreshTable(dataset){
    columns = [];
    columns.push({
        db: "name",
        hr: "Name"
    });
    columns.push({
        db: "username",
        hr: "Username"
    });
    columns.push({
        db: "email",
        hr: "Email"
    });
    columns.push({
        db: "edit",
        hr: " "
    });
  
    var tableHeadRow = $("#tHeadAdminsRow");
    tableHeadRow.empty();
    for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        var tdColumnHeader = $("<th>");
        tableHeadRow.append(tdColumnHeader)
        tdColumnHeader.text(columns[columnIndex].hr);
        tableHeadRow.append(tdColumnHeader);
    }
    var tableBody = $("#tBodyAdmins");
    tableBody.empty();
   
    for (var adminIndex = 0; adminIndex < dataset.admins.length; adminIndex++) {
        var row = $("<tr>");
        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++){
            var elem = $("<td>");
           // alert(columns[columnIndex].db);
            if (columns[columnIndex].db != "edit") {
                var column = columns[columnIndex].db;
                elem.text(dataset.admins[adminIndex][column]);
            } 
            else{
                // TODO button not addening
                var btn = $("<button>");
                    btn.text("Edit Admin");
                    btn.addClass("btn btn-default btn-sm");
                    btn.attr("type", "button");
                    btn.data("adminJson", dataset.admins[adminIndex]);
                    btn.attr("data-toggle", "modal");
                    btn.attr("data-target", "#editAdminModal");
                    btn.click(function() {
                        var admin = $(this).data("adminJson");
                        window.frames["addAdminIframe"].editAdmin(admin);
                        $("#addEditFormTitle").text("Edit an Admin");
                    });
                elem.append(btn);
            
                              
            }
        row.append(elem);
        }
    tableBody.append(row);
    }
}

var dataset = {
    admins: [{
        name: "Madeleine Sands",
        username: "madeleine28",
        email: "madeleine28@gmail.comm"
    },
    {
        name: "Kai Biegun",
        username: "kaliape63",
        email: "kaiisweird@gmail.com"
    }]
};

function alterOrAddAdmin(admin) {
    if (admin.hasOwnProperty("Name")) {
        for (var i = 0; i < dataset.admins.length; i++) {
            if (dataset.admins[i].id && dataset.admins[i].name === admin.name) {
                // If same pal, update them
                dataset.admins[i] = admin;
                // Stop checking (IDs are unique)
                break;
            }
        }
    } else {
        console.log("No ID found, let database generate one for new pal");
        /* Pal NEEDS an ID for adding/editing to work properly TODO make id come from database auto-gen (send updated pal to server, wait for pal back with ID?)*/
        admin.name = (new Date()).getTime();
        dataset.pals.push(pal);
    }
    // TODO send new/altered pal info to server

    // Now regenerate rows to show new info
    refreshTable(dataset);
}