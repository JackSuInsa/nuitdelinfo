(function(){
    let typed1 = '', typed2 = '', typed3 = '';
    const code1 = 'snake', code2 = 'music', code3 = 'johnpork';
    
    document.addEventListener('keypress', function(e) {
        const key = e.key.toLowerCase();
        
        // Code 1: snake
        typed1 += key;
        if (typed1.length > code1.length) typed1 = typed1.slice(-code1.length);
        if (typed1 === code1) window.location.href = '/sn4k3';
        
        // Code 2: music
        typed2 += key;
        if (typed2.length > code2.length) typed2 = typed2.slice(-code2.length);
        if (typed2 === code2) window.location.href = '/v1su4l1z3r';
        
        // Code 3: johnpork
        typed3 += key;
        if (typed3.length > code3.length) typed3 = typed3.slice(-code3.length);
        if (typed3 === code3) {
            // Créer et jouer la sonnerie en boucle
            const ringSound = new Audio('/assets/audio/call.wav');
            ringSound.loop = true;
            ringSound.volume = 1.0;
            ringSound.play().catch(err => console.log('Erreur lecture call.wav:', err));
            
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle, rgba(139,0,139,0.3) 0%, rgba(0,0,0,0.98) 100%);z-index:99999;display:flex;justify-content:center;align-items:center;flex-direction:column;cursor:pointer;backdrop-filter:blur(10px);';
            
            // Stocker la référence audio pour l'arrêter plus tard
            overlay.setAttribute('data-ring-audio', 'active');
            overlay._ringSound = ringSound;
            
            // Container téléphone
            const phoneContainer = document.createElement('div');
            phoneContainer.style.cssText = 'position:relative;animation:phoneVibrate 0.1s infinite,phoneFloat 3s ease-in-out infinite;max-width:90vw;max-height:90vh;';
            
            // Écran du téléphone
            const phone = document.createElement('div');
            phone.style.cssText = 'background:linear-gradient(145deg, #1a1a1a, #0a0a0a);border-radius:40px;padding:15px;box-shadow:0 30px 90px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1);border:3px solid #333;position:relative;width:min(400px, 85vw);height:min(700px, 85vh);display:flex;flex-direction:column;';
            
            // Encoche du téléphone
            const notch = document.createElement('div');
            notch.style.cssText = 'background:#000;width:120px;height:20px;border-radius:0 0 20px 20px;margin:0 auto 10px;box-shadow:inset 0 -2px 5px rgba(255,255,255,0.1);flex-shrink:0;';
            
            // Écran intérieur
            const screen = document.createElement('div');
            screen.style.cssText = 'background:#000;border-radius:30px;padding:20px;box-shadow:inset 0 0 30px rgba(255,0,255,0.3);position:relative;overflow:hidden;flex:1;display:flex;flex-direction:column;justify-content:center;';
            
            // Effet de reflet sur l'écran
            const glare = document.createElement('div');
            glare.style.cssText = 'position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);animation:glareMove 3s infinite;pointer-events:none;';
            
            // Nom de l'appelant
            const caller = document.createElement('div');
            caller.style.cssText = 'text-align:center;margin-bottom:20px;flex-shrink:0;';
            const callerName = document.createElement('h3');
            callerName.style.cssText = 'color:#fff;font-size:clamp(1.2em, 4vw, 1.8em);margin:0 0 10px 0;font-weight:300;letter-spacing:2px;';
            callerName.textContent = 'JOHN PORK';
            const callerSubtext = document.createElement('p');
            callerSubtext.style.cssText = 'color:#888;font-size:clamp(0.7em, 2.5vw, 0.9em);margin:0;';
            callerSubtext.textContent = 'Appel entrant...';
            caller.appendChild(callerName);
            caller.appendChild(callerSubtext);
            
            // Photo de John Pork (circulaire)
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = 'width:clamp(150px, 40vw, 200px);height:clamp(150px, 40vw, 200px);margin:0 auto 20px;border-radius:50%;overflow:hidden;border:5px solid rgba(255,0,255,0.5);box-shadow:0 0 40px rgba(255,0,255,0.8), 0 0 80px rgba(0,255,255,0.6);animation:porkPulse 2s ease-in-out infinite;position:relative;flex-shrink:0;';
            
            const img = document.createElement('img');
            img.src = '/assets/img/thomas_pork.jpg';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
            imgContainer.appendChild(img);
            
            // Icônes d'appel
            const callIcons = document.createElement('div');
            callIcons.style.cssText = 'display:flex;justify-content:space-around;align-items:center;margin-top:auto;padding-top:20px;flex-shrink:0;';
            
            const rejectBtn = document.createElement('div');
            rejectBtn.style.cssText = 'width:clamp(60px, 15vw, 70px);height:clamp(60px, 15vw, 70px);border-radius:50%;background:#e74c3c;display:flex;align-items:center;justify-content:center;font-size:clamp(1.5em, 4vw, 2em);cursor:pointer;box-shadow:0 10px 30px rgba(231,76,60,0.5);transition:transform 0.2s;';
            rejectBtn.innerHTML = '📵';
            rejectBtn.onmouseover = () => rejectBtn.style.transform = 'scale(1.1)';
            rejectBtn.onmouseout = () => rejectBtn.style.transform = 'scale(1)';
            rejectBtn.onclick = (e) => {
                e.stopPropagation();
                // Arrêter la sonnerie
                if (overlay._ringSound) {
                    overlay._ringSound.pause();
                    overlay._ringSound.currentTime = 0;
                }
                // Jouer le son de fin d'appel
                const hangupSound = new Audio('/assets/audio/fin_call.wav');
                hangupSound.volume = 1.0;
                hangupSound.play().catch(err => console.log('Erreur lecture fin_call.wav:', err));
                
                // Supprimer l'overlay après un court délai
                setTimeout(() => overlay.remove(), 100);
            };
            
            const acceptBtn = document.createElement('div');
            acceptBtn.style.cssText = 'width:clamp(60px, 15vw, 70px);height:clamp(60px, 15vw, 70px);border-radius:50%;background:#2ecc71;display:flex;align-items:center;justify-content:center;font-size:clamp(1.5em, 4vw, 2em);cursor:pointer;box-shadow:0 10px 30px rgba(46,204,113,0.5);transition:transform 0.2s;animation:acceptPulse 1.5s ease-in-out infinite;';
            acceptBtn.innerHTML = '📞';
            acceptBtn.onmouseover = () => acceptBtn.style.transform = 'scale(1.1)';
            acceptBtn.onmouseout = () => acceptBtn.style.transform = 'scale(1)';
            acceptBtn.onclick = (e) => {
                e.stopPropagation();
                // Arrêter la sonnerie
                if (overlay._ringSound) {
                    overlay._ringSound.pause();
                    overlay._ringSound.currentTime = 0;
                }
                startCall(screen, phoneContainer);
            };
            
            callIcons.appendChild(rejectBtn);
            callIcons.appendChild(acceptBtn);
            
            // Texte du bas
            const bottomText = document.createElement('p');
            bottomText.style.cssText = 'color:#666;font-size:clamp(0.7em, 2vw, 0.85em);text-align:center;margin-top:15px;font-style:italic;flex-shrink:0;';
            bottomText.textContent = 'Cliquez n\'importe où pour raccrocher';
            
            // Animations CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes phoneVibrate {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    25% { transform: translateX(-3px) rotate(-1deg); }
                    75% { transform: translateX(3px) rotate(1deg); }
                }
                @keyframes phoneFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes porkPulse {
                    0%, 100% { 
                        box-shadow: 0 0 40px rgba(255,0,255,0.8), 0 0 80px rgba(0,255,255,0.6);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 60px rgba(255,0,255,1), 0 0 120px rgba(0,255,255,0.9);
                        transform: scale(1.05);
                    }
                }
                @keyframes acceptPulse {
                    0%, 100% { box-shadow: 0 10px 30px rgba(46,204,113,0.5); }
                    50% { box-shadow: 0 10px 50px rgba(46,204,113,0.9); }
                }
                @keyframes glareMove {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
            `;
            document.head.appendChild(style);
            
            // Assemblage
            screen.appendChild(glare);
            screen.appendChild(caller);
            screen.appendChild(imgContainer);
            screen.appendChild(callIcons);
            screen.appendChild(bottomText);
            phone.appendChild(notch);
            phone.appendChild(screen);
            phoneContainer.appendChild(phone);
            overlay.appendChild(phoneContainer);
            document.body.appendChild(overlay);
            
            // Son de vibration (optionnel)
            const vibratePattern = [100, 50, 100, 50, 100];
            if (navigator.vibrate) {
                setInterval(() => navigator.vibrate(vibratePattern), 2000);
            }
            
            overlay.addEventListener('click', function() {
                if (navigator.vibrate) navigator.vibrate(0);
                // Arrêter la sonnerie
                if (overlay._ringSound) {
                    overlay._ringSound.pause();
                    overlay._ringSound.currentTime = 0;
                }
                // Jouer le son de fin d'appel
                const hangupSound = new Audio('/assets/audio/fin_call.wav');
                hangupSound.volume = 1.0;
                hangupSound.play().catch(err => console.log('Erreur lecture fin_call.wav:', err));
                
                // Supprimer l'overlay après un court délai pour que le son se joue
                setTimeout(() => overlay.remove(), 100);
            });
            
            typed3 = '';
        }
    });
    
    function startCall(screen, phoneContainer) {
        // Arrêter la vibration
        phoneContainer.style.animation = 'phoneFloat 3s ease-in-out infinite';
        if (navigator.vibrate) navigator.vibrate(0);
        
        // Jouer le son de décrochage
        const pickupSound = new Audio('/assets/audio/ben.wav');
        pickupSound.volume = 1.0;
        pickupSound.play().catch(err => console.log('Erreur lecture audio ben.wav:', err));
        
        // Phrases de John Pork (style Talking Ben)
        const phrases = [
            { text: "Oui ?", emoji: "🐷", sound: "oui" },
            { text: "Non.", emoji: "😤", sound: "non" },
            { text: "Ho ho ho !", emoji: "😄", sound: "rire" },
            { text: "Ugh...", emoji: "😒", sound: "ugh" },
            { text: "*manger*", emoji: "🍕", sound: "eat" },
            { text: "Hein ?", emoji: "🤨", sound: "hein" },
            { text: "Au revoir !", emoji: "👋", sound: "bye" }
        ];
        
        let currentPhraseIndex = 0;
        
        // Vider l'écran
        screen.innerHTML = '';
        
        // Container du visage
        const faceContainer = document.createElement('div');
        faceContainer.style.cssText = 'text-align:center;padding:20px;';
        
        // Grande photo circulaire
        const bigFace = document.createElement('div');
        bigFace.style.cssText = 'width:clamp(200px, 50vw, 280px);height:clamp(200px, 50vw, 280px);margin:20px auto;border-radius:50%;overflow:hidden;border:5px solid rgba(255,0,255,0.5);box-shadow:0 0 40px rgba(255,0,255,0.8);position:relative;';
        const faceImg = document.createElement('img');
        faceImg.src = '/assets/img/thomas_pork.jpg';
        faceImg.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform 0.3s;';
        bigFace.appendChild(faceImg);
        
        // Bulle de dialogue
        const speechBubble = document.createElement('div');
        speechBubble.style.cssText = 'background:#fff;color:#000;padding:15px 25px;border-radius:25px;margin:20px auto;max-width:80%;font-size:clamp(1em, 3.5vw, 1.5em);font-weight:bold;position:relative;box-shadow:0 10px 30px rgba(0,0,0,0.3);transform:scale(0);transition:transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);';
        
        // Petit triangle de la bulle
        const bubbleTail = document.createElement('div');
        bubbleTail.style.cssText = 'position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-bottom:20px solid #fff;';
        speechBubble.appendChild(bubbleTail);
        
        const speechText = document.createElement('span');
        speechText.textContent = 'Appuyez sur l\'écran pour parler';
        speechBubble.appendChild(speechText);
        
        // Boutons d'interaction (style Talking Ben)
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex;justify-content:center;gap:10px;margin-top:20px;flex-wrap:wrap;padding:0 10px;';
        
        const buttons = [
            { text: '👍 Oui', action: () => showPhrase(0) },
            { text: '👎 Non', action: () => showPhrase(1) },
            { text: '😂 Rire', action: () => showPhrase(2) },
            { text: '😒 Ugh', action: () => showPhrase(3) }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = 'background:linear-gradient(145deg, #667eea, #764ba2);color:white;border:none;padding:10px 15px;border-radius:20px;font-size:clamp(0.8em, 2.5vw, 1em);cursor:pointer;transition:all 0.3s;box-shadow:0 5px 15px rgba(102,126,234,0.4);';
            button.onmouseover = () => {
                button.style.transform = 'translateY(-3px)';
                button.style.boxShadow = '0 8px 20px rgba(102,126,234,0.6)';
            };
            button.onmouseout = () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 5px 15px rgba(102,126,234,0.4)';
            };
            button.onclick = (e) => {
                e.stopPropagation();
                btn.action();
            };
            buttonContainer.appendChild(button);
        });
        
        // Bouton raccrocher
        const hangupBtn = document.createElement('button');
        hangupBtn.textContent = '📵 Raccrocher';
        hangupBtn.style.cssText = 'background:#e74c3c;color:white;border:none;padding:12px 30px;border-radius:25px;font-size:clamp(0.9em, 2.5vw, 1.1em);cursor:pointer;margin-top:20px;transition:all 0.3s;box-shadow:0 5px 15px rgba(231,76,60,0.4);display:block;margin-left:auto;margin-right:auto;';
        hangupBtn.onmouseover = () => {
            hangupBtn.style.transform = 'scale(1.05)';
            hangupBtn.style.boxShadow = '0 8px 20px rgba(231,76,60,0.6)';
        };
        hangupBtn.onmouseout = () => {
            hangupBtn.style.transform = 'scale(1)';
            hangupBtn.style.boxShadow = '0 5px 15px rgba(231,76,60,0.4)';
        };
        hangupBtn.onclick = (e) => {
            e.stopPropagation();
            // Jouer le son de fin d'appel
            const hangupSound = new Audio('/assets/audio/fin_call.wav');
            hangupSound.volume = 1.0;
            hangupSound.play().catch(err => console.log('Erreur lecture fin_call.wav:', err));
            
            // Supprimer l'overlay après un court délai
            setTimeout(() => {
                const overlayElement = document.body.querySelector('[data-ring-audio="active"]');
                if (overlayElement) {
                    overlayElement.remove();
                } else {
                    // Fallback si l'attribut n'existe plus
                    const allOverlays = document.querySelectorAll('[style*="position:fixed"][style*="z-index:99999"]');
                    if (allOverlays.length > 0) {
                        allOverlays[allOverlays.length - 1].remove();
                    }
                }
            }, 100);
        };
        
        function showPhrase(index) {
            const phrase = phrases[index];
            
            // Animation du visage (zoom)
            faceImg.style.transform = 'scale(1.1)';
            setTimeout(() => faceImg.style.transform = 'scale(1)', 300);
            
            // Afficher la bulle avec le texte
            speechText.textContent = `${phrase.emoji} ${phrase.text}`;
            speechBubble.style.transform = 'scale(1)';
            
            // Synthèse vocale
            playAudio(phrase.text, phrase.sound);
            
            // Cacher la bulle après 2 secondes
            setTimeout(() => {
                speechBubble.style.transform = 'scale(0)';
            }, 2000);
        }
        
        function playAudio(text, soundType) {
            // Créer un élément audio
            const audio = new Audio();
            
            // Définir le fichier audio selon le type
            switch(soundType) {
                case 'oui':
                    audio.src = '/assets/audio/yes.wav';
                    break;
                case 'non':
                    audio.src = '/assets/audio/no.wav';
                    break;
                case 'rire':
                    audio.src = '/assets/audio/hohoho.wav';
                    break;
                case 'ugh':
                    audio.src = '/assets/audio/ugh.wav';
                    break;
            }
            
            // Jouer l'audio avec gestion d'erreur
            audio.volume = 1.0;
            audio.play().catch(err => {
                console.log('Erreur lecture audio:', err);
                // Fallback vers synthèse vocale si le fichier n'existe pas
                fallbackToSpeech(text, soundType);
            });
        }
        
        function fallbackToSpeech(text, soundType) {
            // Fallback avec Web Speech API si les fichiers audio n'existent pas
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance();
                
                switch(soundType) {
                    case 'oui':
                        utterance.text = 'Oui ?';
                        utterance.pitch = 1.2;
                        utterance.rate = 0.9;
                        break;
                    case 'non':
                        utterance.text = 'Non !';
                        utterance.pitch = 0.8;
                        utterance.rate = 0.8;
                        break;
                    case 'rire':
                        utterance.text = 'Ha ha ha ha ha !';
                        utterance.pitch = 1.5;
                        utterance.rate = 1.3;
                        break;
                    case 'ugh':
                        utterance.text = 'Eugh...';
                        utterance.pitch = 0.7;
                        utterance.rate = 0.7;
                        break;
                    case 'eat':
                        utterance.text = 'Miam miam miam';
                        utterance.pitch = 1.0;
                        utterance.rate = 1.2;
                        break;
                    case 'hein':
                        utterance.text = 'Hein ?';
                        utterance.pitch = 1.3;
                        utterance.rate = 0.8;
                        break;
                    case 'bye':
                        utterance.text = 'Au revoir !';
                        utterance.pitch = 1.1;
                        utterance.rate = 0.9;
                        break;
                }
                
                const voices = window.speechSynthesis.getVoices();
                const frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
                if (frenchVoice) {
                    utterance.voice = frenchVoice;
                }
                
                utterance.volume = 1.0;
                utterance.lang = 'fr-FR';
                
                window.speechSynthesis.speak(utterance);
            }
        }
        
        // Charger les voix (nécessaire pour certains navigateurs)
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
        
        // Assemblage de l'écran d'appel
        faceContainer.appendChild(bigFace);
        faceContainer.appendChild(speechBubble);
        faceContainer.appendChild(buttonContainer);
        faceContainer.appendChild(hangupBtn);
        screen.appendChild(faceContainer);
        
        // Afficher la bulle de bienvenue
        setTimeout(() => {
            speechBubble.style.transform = 'scale(1)';
        }, 300);
    }
})();
