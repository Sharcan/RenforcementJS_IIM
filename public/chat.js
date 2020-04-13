// On connecte le fichier au serveur
var socket = io.connect('http://localhost:8080');

// On demande le pseudo de la personne
while(!pseudo) {
    var pseudo = prompt('quel est ton nom ?');
    fetch('http://localhost:8080/createuser', {
                //On appel le serveur en faisant passer le pseudo
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    pseudo: pseudo
                })
    })
}

socket.emit('pseudo', pseudo);
document.title = pseudo + ' - ' + document.title;

var channel = prompt('Tu veux rejoindre quel channel ?');

socket.emit('channel', channel);


// On attends l'emission 'newUser' du serveur, si il est reçu on ajoute un message 
// contenant les informations emises par le serveur
socket.on('newUser', (message) => {
    createElementFunction('newUser', message);
});

// On check si le user se déconnecte
socket.on('quitUser', (message) => {
    createElementFunction('quitUser', message);
});

// On attends un message venant d'une personne tierce
socket.on('newMessageAll', (content) => {

    createElementFunction('newMessageAll', content);

});

// Une personne est en train d'ecrire
socket.on('writting', (pseudo) => {
    document.getElementById('isWritting').textContent = pseudo + ' est en train d\'ecrire';
});

// Elle a arrêté d'ecrire
socket.on('notWritting', (pseudo) => {
    document.getElementById('isWritting').textContent = '';
});


socket.on('oldMessages', (content) => {
    // createElementFunction('oldMessages', content);

    content.forEach(element => {
        createElementFunction('oldMessages', {sender: element.sender, content: element.content});
    });
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

        createElementFunction('newMessage', textInput);

    }
    else {
        return false;
    }

});

// S'il ecrit on emet 'writting' au serveur
function writting() {
    socket.emit('writting', pseudo);
}

// S'il ecrit plus on emet 'notWritting' au serveur
function notWritting() {
    socket.emit('notWritting', pseudo);
}



function createElementFunction(element, content) {
    
    const newElement = document.createElement("div");

    switch(element){

        case 'newMessage':
            newElement.classList.add(element);
            newElement.textContent = pseudo + ': ' + content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'newMessageAll':
            newElement.classList.add(element);
            newElement.textContent = content.pseudo + ': ' + content.message;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'newUser':
            newElement.classList.add(element);
            newElement.textContent = content + ' à rejoint le chat';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'quitUser':
            newElement.classList.add(element);
            newElement.textContent = content + ' à quitter le chat';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'oldMessages':
            newElement.classList.add(element);
            newElement.textContent = content.sender + ': ' + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

    }
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
    setTimeout(type, 1000);

}());
