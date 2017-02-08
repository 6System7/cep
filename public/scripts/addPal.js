function editPal(pal) {
    $("#palStore").data("pal", pal);
    $("#firstName").val(pal.firstName);
    $("#lastName").val(pal.lastName);
    $("#email").val(pal.email);
}

function getPalFromInputs() {
    var pal = $("#palStore").data("pal");
    if (!pal) {
        // Adding, not editing, so saved object is just null/undefined
        pal = {};
        // TODO find an id here?
    }
    pal.firstName = $("#firstName").val();
    pal.lastName = $("#lastName").val();
    pal.email = $("#email").val();
    return pal;
}

function submitFunc() {
    // TODO send new/altered pal info to server
    window.parent.alterOrAddPal(getPalFromInputs());
    window.parent.closeModal();
}
