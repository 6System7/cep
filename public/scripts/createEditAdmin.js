$(document).ready(function(){
    var $body = $(window.frameElement).parents('body'),
    dlg = $body.find('#editAdminModal');
    
    $(dlg).on('hide.bs.modal', function (e) {
         $('#confirmationModal').modal('toggle');
        // TODO figure this out
        
            
    
    })
})
function editAdmin(admin) {
    $("#adminStore").data("admin", admin);
    $("#name").val(admin.name);
    $("#username").val(admin.username);
    $("#email").val(admin.email);

    $("#name").focus();
}

function getAdminFromInputs() {
    var admin = $("#adminStore").data("admin");
    if (!admin) {
        // Adding, not editing, so saved object is just null/undefined
        admin = {};
    }
    admin.name = $("#name").val();
    admin.username = $("#username").val();
    admin.email = $("#email").val();
    
    // TODO remember to update
    return admin;
}

function clearInputs() {
    $(":input").val("");
}

function submitFunc() {
    window.parent.alterOrAddAdmin(getAdminFromInputs());
    // Clear inputs on closing, erase saved pal - LEAVE NO TRACE
    clearInputs();
    $("#adminStore").data("admin", null);
    // Close self
    window.parent.closeModal();
}


function deletePalFunc(){
    //  grab pal - need path to delete
    
    
    /*
    var pal = $("#palStore").data("pal");
    $.ajax({
        url: delPals
        type: 'DELETE',
        success: function(){
        //refresh page
    }
        
    })
    */
    
    // make request to server with pal
   //window.parent.alterOrAddPal(getPalFromInputs());
    
    

    
}

