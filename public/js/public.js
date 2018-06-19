$(function() {
    $('#btnRegister').on('click', function(event) {
        event.preventDefault();

        var full_name = $("#registerForm input[name=full_name]").val();
        var gender = $("#registerForm select[name=gender]").val();

        var role_id = $("#registerForm select[name=role_id]").val();
        var department_id = $("#registerForm select[name=department_id]").val();

        if (gender == '#' || role_id == '#' || department_id == '#') {
            $('#message').text('Vui lòng chọn đúng Cấp Bậc, Phòng Ban, Vị trí!');
            $('#myModal').css('display', 'block');
            return
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
            return
        }

        $.post("/register", {
            full_name: full_name,
            gender: gender,
            email: email,
            username: username,
            password: password,
            dob: dob,
            phone: phone,
            address: address,
            role_id: role_id,
            department_id: department_id,
            job_title: job_title,
            join_date: join_date,
            contract_code: contract_code,
            staff_code: staff_code
        },
        function(data, status) {
            $('#message').text(data.message);
            $('#myModal').css('display', 'block');
        });
    });
});
