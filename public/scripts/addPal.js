$(document).ready(function() {
    var $body = $(window.frameElement).parents('body'),
        dlg = $body.find('#myModal');

    $(dlg).on('hide.bs.modal', function(e) {
        $('#confirmationModal').modal('toggle');
        // TODO figure this out
    });
});

function editPal(pal) {
    $("#palStore").data("pal", pal);
    $("#firstName").val(pal.firstName);
    $("#lastName").val(pal.lastName);
    $("#email").val(pal.email);
    $("#gender").val(pal.gender);
    $("#chkDisability")[0].checked = pal.disability;
    $("#chkExtraHelp")[0].checked = pal.extra_help;

    if (pal.dob) {
        var dobString = pal.dob.getUTCFullYear() + "/" + (1 + pal.dob.getMonth()) + "/" + pal.dob.getDate();
        $("#dob").val(dobString);
    }

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
    pal.gender = $("#gender").val();
    pal.disability = $("#chkDisability")[0].checked;
    pal.extra_help = $("#chkExtraHelp")[0].checked;
    // TODO remember to update
    return pal;
}

function clearInputs() {
    $(":input").val("");
}

function submitFunc() {
    // TODO only allow if all inputs have something?

    window.parent.alterOrAddPal(getPalFromInputs());
    // Clear inputs on closing, erase saved pal - LEAVE NO TRACE
    clearInputs();
    $("#palStore").data("pal", null);
    // Close self
    window.parent.closeModal();
}

function deletePalFunc() {
    //  grab pal - need path to delete
    var pal = $("#palStore").data("pal");

    // make request to server with pal, then refresh main page
    $.ajax({
        method: "POST",
        url: "delPal",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({
            pals: [pal]
        })
    }).always(function() {
        window.parent.loadAllPals();
    })

    // Close self
    window.parent.closeModal();
}
