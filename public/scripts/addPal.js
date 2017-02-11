function editPal(pal) {
    $("#palStore").data("pal", pal);
    $("#firstName").val(pal.firstName);
    $("#lastName").val(pal.lastName);
    $("#email").val(pal.email);

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
