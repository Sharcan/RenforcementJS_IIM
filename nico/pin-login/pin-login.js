// Création de la classe PinLogin pour l'utiliser dans index.html
class PinLogin {

    // On défini les variables qui serviront à cibler les éléments du DOM et à les modifiers
    constructor({el, loginEndPoint, redirectTo, maxNumbers = Infinity}){


        // ON DEFINI DES VARIABLES POUR LE RESTE DU FICHIER
    
        // Nouvelle variable mainDiv qui prends en compte toutes les div enfants transmise par "el"
        this.mainDiv = {

            // Main == div principale
            main: el,

            // numPad == toutes les touches que l'on va creer
            numPad: el.querySelector(".pin-loginNumpad"),

            // textDisplay == input
            textDisplay: el.querySelector(".pin-loginText")
        };


        // On défnie toutes les variables restantes
        this.loginEndPoint = loginEndPoint;
        this.redirectTo = redirectTo;
        this.maxNumbers = maxNumbers;
        this.value = "";

        // On genere le pavé numérique, le "_" permet de nous dire que c'est une fonction privée
        this._generatePad();
    }

    _generatePad() {

        // variable qui defini le pavé numérique
        const padLayout = [
            "1", "2", "3",
            "4", "5", "6",
            "7", "8", "9",
            "backspace", "0", "done"
        ];

        // On lance la boucle pour creer les div
        padLayout.forEach(key => {
            
            // On recherche ici les chiffre 3, 6, 9 pour placer un <br>
            const insertBreak = key.search(/[369]/) !== -1;

            //On crée une div a chaque tour
            const keyEl = document.createElement("div");

            // On lui ajoute la classe : pin-loginKey 
            keyEl.classList.add("pin-loginKey");

            // On lui ajoute la classe : material-icons si "key" n'est pas un "Number" 
            // => NaN = Not a Number, si key n'est pas un chiffre NaN = false et inversement
            keyEl.classList.toggle("material-icons", isNaN(key));

            // On ajoute le texte
            keyEl.textContent = key;

            // On ajoute un evenement qui amène à la fonction _handleKeyPress au clique
            keyEl.addEventListener("click", () => {
                this._handleKeyPress(key);
            });

            // La div que l'on vient de créer va dans la div numPad
            this.mainDiv.numPad.appendChild(keyEl);

            if(insertBreak) {
                this.mainDiv.numPad.appendChild(document.createElement("br"));
            }
        })

    }


    _handleKeyPress(key) {
        switch (key) {
            case "backspace":
                this.value = this.value.substring(0, this.value.length - 1);
                break;
            
            case "done": 
                this._attemptLogin();
                break;
            
            default: 
                if (this.value.length < this.maxNumbers && !isNaN(key)){
                    this.value += key;
                }
                break;
        }

        this._updateValueText();
    }

    _updateValueText() {
        this.mainDiv.textDisplay.value = "_".repeat(this.value.length);
    }

    _attemptLogin() {
        if (this.value.length > 0) {
            console.log('oui');
        }
    }
}