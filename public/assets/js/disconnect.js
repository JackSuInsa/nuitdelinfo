function disconnect() {
    // Sauvegarde la session avant de déconnecter
    if (typeof saveSessionData === 'function') {
        saveSessionData();
    }
    setTimeout(() => {
        try {
            $.ajax({
            url: '/disconnect',
            type: 'POST',
            success: function() {
                window.location.href = '/connexion';
            },
            error: function(error) {
                console.error('Erreur lors de la déconnexion:', error);
            }
        });
        } catch (e) {
            console.error('saveSessionData a levé une erreur :', e);
        }
    }, 200);
}