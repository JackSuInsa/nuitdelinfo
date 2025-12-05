let loginStatus = false;

function checkLogin() {
    let loginInput = $('#login');
    if (loginInput.val().trim().length === 0 || loginInput.val().length > 50 || loginInput.val().includes(' ')) {
        loginStatus = true;
        checkConfirmPassword();
        $('#error').text('Login invalide').css('color', 'red');
        $('#password').prop('disabled', true);
        $('#confirm_password').prop('disabled', true);
        $('#submit').prop('disabled', true);
        return;
    }
    loginInput = loginInput.val().trim();
    $.ajax({
        url: '/inscription/check_login',
        method: 'GET',
        data: { login: loginInput },
        success: function(response) {
            if (response.exists) {
                loginStatus = true;
                checkConfirmPassword();
                $('#error').text('Login déjà pris').css('color', 'red');
                $('#password').prop('disabled', true);
                $('#confirm_password').prop('disabled', true);
                $('#submit').prop('disabled', true);
            } else {
                loginStatus = false;
                $('#error').text('Login disponible').css('color', 'green');
                $('#password').prop('disabled', false);
                $('#confirm_password').prop('disabled', false);
                checkConfirmPassword();
            }
        }
    }); 
};

function checkConfirmPassword() {
    const password = $('#password').val();
    const confirmPassword = $('#confirm_password').val();

    if (loginStatus) {
        $('#submit').prop('disabled', true);
        return;
    }

    if (password !== confirmPassword || password.length === 0) {
        $('#submit').prop('disabled', true);
        if (password.length > 0 || confirmPassword.length > 0) {
            $('#error').text('Les mots de passe ne correspondent pas').css('color', 'red');
        }
    } else {
        $('#error').text('');
        $('#submit').prop('disabled', false);
    }
}
