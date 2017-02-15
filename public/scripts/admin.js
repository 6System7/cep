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
  
    var tableHeadRow = $("#tHeadAdminsRow");
    tableHeadRow.empty();
    
    //alert(columns.length);
    for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        var tdColumnHeader = $("<th>");
        //alert(columnIndex);
        tableHeadRow.append(tdColumnHeader)
        //alert(tdColumnHeader);
        tdColumnHeader.text(columns[columnIndex].hr);
        
       // alert(columns[columnIndex].hr);
        tableHeadRow.append(tdColumnHeader);
    }
    var tableBody = $("#tBodyAdmins");
    tableBody.empty();
    alert(dataset.admins.length);
    for (var adminIndex = 0; adminIndex < dataset.admins.length; adminIndex++) {
        var row = $("<tr>");
        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++){
            var elem = $("<td>");
            if (columns[columnIndex].db) {
                var column = columns[columnIndex].db;
                elem.text(dataset.admins[adminIndex][column]);
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
        name: "Madeleine Sands",
        username: "madeleine28",
        email: "madeleine28@gmail.com"
    }]
};