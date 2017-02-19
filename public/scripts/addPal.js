$(document).ready(function(){
    var $body = $(window.frameElement).parents('body'),
    dlg = $body.find('#myModal');
    
    $(dlg).on('hide.bs.modal', function (e) {
         $('#confirmationModal').modal('toggle');
        // TODO figure this out
        
            
    
    })
})
function editPal(pal) {
    $("#palStore").data("pal", pal);
    $("#firstName").val(pal.firstName);
    $("#lastName").val(pal.lastName);
    $("#email").val(pal.email);
    $("#dob").val(pal.dob);

    $("#firstName").focus();
}

function getPalFromInputs() {
    var pal = $("#palStore").data("pal");
    if (!pal) {
        // Adding, not editing, so saved object is just null/undefined
        pal = {};
    }
    pal.firstName = $("#firstName").val();
    pal.lastName = $("#lastName").val();
    pal.email = $("#email").val();
    pal.dob = $("#dob").val();
    
    // TODO remember to update
    return pal;
}

function clearInputs() {
    $(":input").val("");
}

function submitFunc() {
    window.parent.alterOrAddPal(getPalFromInputs());
    // Clear inputs on closing, erase saved pal - LEAVE NO TRACE
    clearInputs();
    $("#palStore").data("pal", null);
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

