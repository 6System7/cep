$(document).ready(function() {
    $("#trcAge").slider({
        id: "trcAge"
    });
    $("#trcAge").on("slide", function(slideEvt) {
        console.log("Age range selected", slideEvt.value);
        $("#trcAgeSelection").text(slideEvt.value.join(" - "));
    });
});
