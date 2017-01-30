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
});
