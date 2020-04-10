// On connecte le fichier au serveur
var socket = io.connect('http://localhost:8080');

// On demande le pseudo de la personne
while(!pseudo) {
    var pseudo = prompt('quel est ton nom ?');
}

socket.emit('pseudo', pseudo);
document.title = pseudo + ' - ' + document.title;

// On attends l'emission 'newUser' du serveur, si il est reçu on ajoute un message 
// contenant les informations emises par le serveur
socket.on('newUser', (message) => {
    const newUserText = document.createElement("div");
    newUserText.classList.add('newUserClass');
    newUserText.textContent = message + ' a rejoint le chat !';

    document.getElementById('msgContainer').appendChild(newUserText);
});

// On check si le user se déconnecte
socket.on('quitUser', (message) => {
    const quitUserText = document.createElement("div");
    quitUserText.classList.add('newUserClass');
    quitUserText.textContent = message + ' a quitté le chat !';

    document.getElementById('msgContainer').appendChild(quitUserText);
});

// On attends un message venant d'une personne tierce
socket.on('newMessageAll', (content) => {
    const NewMessageOther = document.createElement("div");
    NewMessageOther.classList.add('newMessageAll');
    NewMessageOther.textContent = content.pseudo + ': ' + content.message;

    document.getElementById('msgContainer').appendChild(NewMessageOther);
});

// Une personne est en train d'ecrire
socket.on('writting', (pseudo) => {
    document.getElementById('isWritting').textContent = pseudo + ' est en train d\'ecrire';
});

// Elle a arrêté d'ecrire
socket.on('notWritting', (pseudo) => {
    document.getElementById('isWritting').textContent = '';
});

// Quand on soumet le formulaire
document.getElementById('chatForm').addEventListener('submit', (e)=>{

    e.preventDefault();

    // On récupère la valeur dans l'input et on met le input a 0
    const textInput = document.getElementById('msgInput').value;
    document.getElementById('msgInput').value = '';

    // Si la valeur > 0, on envoie un message au serveur contenant la valeur de l'input 
    if(textInput.length > 0) {
        socket.emit('newMessage', textInput);

        // On creer une div contenant le message pour la personne qui à envoyé le message
        const newMessage = document.createElement('div');
        newMessage.classList.add('newMessage');
        newMessage.textContent = pseudo + ': ' + textInput;
        document.getElementById('msgContainer').appendChild(newMessage);

    }
    else {
        return false;
    }

});


// S'il ecrit on emet 'writting' au serveur
function writting() {
    socket.emit('writting', pseudo)
}

// S'il ecrit plus on emet 'notWritting' au serveur
function notWritting() {
    socket.emit('notWritting', pseudo)
}

//Text typping effect
const texts = ['ce chat !', 'cette messagerie !', 'ce site !'];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {

    if(count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    document.querySelector('.typing').textContent = letter;
    if(letter.length === currentText.length) {
        count++;
        index = 0;
    }
    setTimeout(type, 400);

}());
