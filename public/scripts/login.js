/*$(document).ready(function (){
    validate();
    $('#username, #password').change(validate);
});

function validate(){
    if ($('#username').val().length   >   0)   && ($('#password').val().length  >   0 )
    {
        $("#loginbutton").removeAttr("disabled");
    }
    else {
        $("#loginbutton").prop("disabled", true);
    }
}

/*$(document).ready(function(){
    $("input").change(function(){
        alert("The text has been changed.");
    });
});*/
$(document).ready(function() {
  /*  var $submit = $("input[type=submit]"),
        $inputs = $('input[type=text], input[type=password]');

    function checkEmpty() {

        // filter over the empty inputs

        return $inputs.filter(function() {
            return !$.trim(this.value);
        }).length === 0;
    }

    $inputs.on('keyup', function() {
        $submit.prop("disabled", !checkEmpty());
    }).keyup(); // trigger an initial blur */
});
function empty(){
    var x;
    x = document.getElementById("username").value;
    y = document.getElementById("password").value;
    if (x == ""){
        alert("false");
        return false;
    }
    else if(y = ""){
        alert("false");
        return false;
    }
   
    };
$(function() {
  $('form').submit(function(){
      
          window.location.replace("index.html");
          

    
    return false;
  }  );
});