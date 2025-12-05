// Variables pour stocker les données de session
let sessionData = {
    login: '',
    likes: 0,
    abonnes: 0,
    clickParSeconde: 0.0,
    multiplicateurClick: 1.0,
    postsPublies: [] // tableau d'objets post publiés
};

$(document).ready(function() {
    // Charger les données initiales depuis la session
    loadSessionData();
    // Charger le menu de posts aléatoires au démarrage
    loadRandomPosts();
    // Recharge le menu quand on clique sur Accueil
    $('#home_button').click(loadRandomPosts);
    $('#home_button').click(loadSessionData);
    // Mettre à jour automatiquement les likes par seconde
    setInterval(function() {
        if (sessionData.clickParSeconde > 0) {
            sessionData.likes += sessionData.clickParSeconde;
            updateDisplay();
            // Sauvegarder périodiquement les données dans la session
            saveSessionData();
        }
    }, 1000);
});

function loadSessionData() {
    displayPosts(undefined); // Affiche le loader au démarrage
    $.getJSON('/jeu/getData')
        .done(function(data) {
            sessionData.login = data.login;
            sessionData.likes = data.likes || 0;
            sessionData.abonnes = data.abonnes || 0;
            sessionData.clickParSeconde = data.clickParSeconde || 0.0;
            sessionData.multiplicateurClick = data.multiplicateurClick || 1.0;
            sessionData.postsPublies = data.postsPublies || [];
            updateDisplay();
            displayPosts(sessionData.postsPublies);
            
        })
        .fail(function(error) {
            console.error('Erreur lors de la récupération des données de session:', error);
        });
}

function saveSessionData() {
    // Sauvegarder les données dans la session via une requête POST
    $.ajax({
        url: '/jeu/updateData',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
            likes: sessionData.likes,
            abonnes: sessionData.abonnes,
            clickParSeconde: sessionData.clickParSeconde,
            multiplicateurClick: sessionData.multiplicateurClick,
            postsPublies: sessionData.postsPublies
        })
    })
    .done(function(data) {
        console.log('Données sauvegardées:', data);
    })
    .fail(function(error) {
        console.error('Erreur lors de la sauvegarde:', error);
    });
}

function showDiv(divId) {
    // Masquer tous les divs
    $('#home_div').css('display', 'none');
    $('#market_div').css('display', 'none');
    $('#dm_div').css('display', 'none');

    // Afficher le div sélectionné
    $('#'+divId).css('display', 'block');
    
    // Si on affiche la page d'accueil, afficher les posts publiés depuis la session
    if (divId === 'home_div') {
        displayPosts(sessionData.postsPublies);
    }
}


function displayPosts(posts) {
    const container = $('#posts_container');
    if (typeof posts === 'undefined') {
        container.html('<p>Chargement...</p>');
        return;
    }
    if (!posts || posts.length === 0) {
        container.html('<p>Vous n\'avez pas encore publié de posts. Visitez le magasin pour acheter des posts!</p>');
        return;
    }
    let html = '';
    // Afficher les posts du plus récent au plus ancien
    posts.slice().reverse().forEach(post => {
        html += '<div class="post-item" style="border: 1px solid #ccc; margin: 10px; padding: 15px; border-radius: 5px;">';
        if (post.imagePost) {
            html += `<img src="${post.imagePost}" alt="Image du post" style="max-width: 300px; display: block; margin-bottom: 10px;">`;
        }
        html += `<p><strong>Contenu:</strong> ${post.contenuPost}</p>`;
        html += `<p><strong>Gain Likes:</strong> +${post.gainLike} likes</p>`;
        html += `<p><strong>Gain Abonnés:</strong> +${post.gainAbonné} abonnés</p>`;
        html += '</div>';
    });
    container.html(html);
}

function updateDisplay() {
    $('#display_login').text(sessionData.login);
    $('#display_likes').text(Math.floor(sessionData.likes));
    $('#display_abonnes').text(sessionData.abonnes);
    $('#display_cps').text(sessionData.clickParSeconde.toFixed(1));
    $('#display_multi').text(sessionData.multiplicateurClick.toFixed(1));
}

function addLike() {
    $.post('/jeu/addLike')
        .done(function(data) {
            sessionData.likes = data.likes;
            sessionData.abonnes = data.abonnes;
            sessionData.clickParSeconde = data.clickParSeconde;
            sessionData.multiplicateurClick = data.multiplicateurClick;
            sessionData.postsPublies = data.postsPublies;
            updateDisplay();
        })
        .fail(function(error) {
            console.error('Erreur lors de l\'ajout du like:', error);
        });
}

// Affiche le menu de posts aléatoires
function loadRandomPosts() {
    $.getJSON('/jeu/randomPosts')
        .done(function(posts) {
            const menu = $('#random_posts_menu');
            menu.empty();
            posts.forEach(post => {
                const btn = $(
                    `<button class="post-btn" data-id="${post.idPost}" data-cout="${post.coutLike}">
                        <img src="${post.imagePost || ''}" alt="" style="max-width:50px;max-height:50px;">
                        ${post.contenuPost} (Coût: ${post.coutLike} likes)
                    </button>`
                );
                btn.click(function() {
                    publishPost(post.idPost);
                });
                menu.append(btn);
            });
        })
        .fail(function(error) {
            console.error('Erreur lors du chargement des posts aléatoires:', error);
        });
}

function publishPost(idPost) {
    $.post('/jeu/publishPost', { idPost: idPost })
        .done(function(data) {
            if (data.success) {
                sessionData.likes = data.likes;
                sessionData.abonnes = data.abonnes;
                sessionData.postsPublies = (sessionData.postsPublies || [])
                if (data.post) {
                    sessionData.postsPublies.push(data.post);
                }
                loadRandomPosts(); // recharge le menu
                loadSessionData(); // recharge les données de session
                saveSessionData(); // synchronise la session côté serveur
            } else {
                alert(data.error || 'Erreur');
            }
        })
        .fail(function(error) {
            alert('Pas assez de likes pour publier ce post.');
        });
}