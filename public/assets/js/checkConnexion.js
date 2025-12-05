function tryConnexion() {
    const login = $('#login').val().trim();
    const password = $('#password').val().trim();

    // Simple validation
    if (!login || !password) {
        $('#error').text('Veuillez remplir tous les champs.').css('color', 'red');
        return;
    }
    $.ajax({
        url: '/connexion/try_connexion',
        method: 'POST',
        data: { login, password },
        success: function (response) {
            if (response.success) {
                // Redirection vers la page du jeu
                window.location.href = '/jeu';
            } else {
                $('#error').text('Identifiants invalides.').css('color', 'red');
            }
        }
    });
}