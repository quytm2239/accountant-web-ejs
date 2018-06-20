$(function() {
    function handleFocusOut(){
        if ($(this).val().length == 0 || $(this).val() == '#') {
            $(this).css("border", "1px solid #FF0000");
            $(this).next().children().children().css("color", "#FF0000");
            $(this).next().children().css("border", "1px solid #FF0000");
        } else {
            $(this).css("border", "1px solid #00FF00");
            $(this).next().children().children().css("color", "#00FF00");
            $(this).next().children().css("border", "1px solid #00FF00");
        }
    };

    function handleFocusIn(){
        $(this).css("border", "1px solid #e5e5e5");
        $(this).next().children().children().css("color", "#e5e5e5");
        $(this).next().children().css("border", "1px solid #e5e5e5");
    }

    $("#registerForm select").on('change', handleFocusOut);

    $("#registerForm select").focusout(handleFocusOut);
    $("#registerForm input").focusout(handleFocusOut);

    $("#registerForm select").focusin(handleFocusIn);
    $("#registerForm input").focusin(handleFocusIn);

    $("input:file").change(function (){
        var fileName = $(this).val();
        if (fileName == null || fileName.length == 0 ){
            $(this).css("border", "1px solid #FF0000");
            $(this).next().children().children().css("color", "#FF0000");
            $(this).next().children().css("border", "1px solid #FF0000");
        } else {
            $(this).css("border", "1px solid #00FF00");
            $(this).next().children().children().css("color", "#00FF00");
            $(this).next().children().css("border", "1px solid #00FF00");
        }
    });

    $('#registerForm').submit(function(event){
        event.preventDefault();

        var valid = true;
        $( "input" ).each(function( index ) {
            if ($( this ).val().length == 0) {
                $('#message').text('Xin vui lòng điền đầy đủ thông tin!');
                $('#myModal').css('display', 'block');
                valid = false;
                return;
            }
        });
        if (!valid) return;

        var full_name = $("#registerForm input[name=full_name]").val();
        var gender = $("#registerForm select[name=gender]").val();

        var role_id = $("#registerForm select[name=role_id]").val();
        var department_id = $("#registerForm select[name=department_id]").val();

        if (gender == '#' || role_id == '#' || department_id == '#') {
            $('#message').text('Vui lòng chọn đúng Cấp Bậc, Phòng Ban, Vị trí!');
            $('#myModal').css('display', 'block');
            return;
        }
        var email = $("#registerForm input[name=email]").val();
        var username = $("#registerForm input[name=username]").val();

        var password = $("#registerForm input[name=password]").val();
        var retype_password = $("#registerForm input[name=retype_password]").val();

        var dob = $("#registerForm input[name=dob]").val();
        var phone = $("#registerForm input[name=phone]").val();

        var address = $("#registerForm input[name=address]").val();

        var job_title = $("#registerForm input[name=job_title]").val();
        var join_date = $("#registerForm input[name=join_date]").val();

        var contract_code = $("#registerForm input[name=contract_code]").val();
        var staff_code = $("#registerForm input[name=staff_code]").val();

        if (retype_password != password) {
            $('#message').text('Nhắc lại mật khẩu không giống!');
            $('#myModal').css('display', 'block');
            return;
        }

        $("#btnRegister").prop("disabled", true);

        var form = new FormData($('#registerForm')[0]);
        var url = $('#registerForm').attr("action");

        $.ajax({
            url: url,
            method: "POST",
            dataType: 'json',
            data: form,
            processData: false,
            contentType: false,
            success: function(result){
                console.log("SUCCESS : ", result);
                $('#message').text(result.message);
                $('#myModal').css('display', 'block');
                $("#btnRegister").prop("disabled", false);
            },
            error: function(er){
                console.log("ERROR : ", er);
                $('#message').text(er.responseText);
                $('#myModal').css('display', 'block');
                $("#btnRegister").prop("disabled", false);
            }
        });
    });
});
