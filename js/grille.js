import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  cookiesCliquees = [];
  /**
   * Constructeur de la grille
   * @param {number} l nombre de lignes
   * @param {number} c nombre de colonnes
   */
  constructor(l, c) {

    this.c = c;
    this.l = l;

    this.tabcookies = this.remplirTableauDeCookies(6);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      // on calcule la ligne et la colonne de la case
      // index est le numéro de la case dans la grille
      // on sait que chaque ligne contient this.c colonnes
      // er this.l lignes
      // on peut en déduire la ligne et la colonne
      // par exemple si on a 9 cases par ligne et qu'on 
      // est à l'index 4
      // on est sur la ligne 0 (car 4/9 = 0) et 
      // la colonne 4 (car 4%9 = 4)
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c;

      console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie correspondant à cette case
      let cookie = this.tabcookies[ligne][colonne];
      // on récupère l'image correspondante
      let img = cookie.htmlImage;

      img.onclick = (event) => {
        console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
        //let cookieCliquee = this.getCookieFromLC(ligne, colonne);
        console.log("Le cookie cliqué est de type " + cookie.type);
        // highlight + changer classe CSS
        cookie.selectionnee();
        this.cookiesCliquees.push(cookie)

        // A FAIRE : tester combien de cookies sont sélectionnées
        // si 0 on ajoute le cookie cliqué au tableau
        if (this.cookiesCliquees.length == 2) {
          Cookie.swapCookies(this.cookiesCliquees[0], this.cookiesCliquees[1]);
          this.cookiesCliquees = [];
        }
        // si 1 on ajoute le cookie cliqué au tableau
        // et on essaie de swapper
        console.log(cookie)
      }

      // A FAIRE : ecouteur de drag'n'drop

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);

      img.draggable = true;


      img.ondragstart = (event) => {
        event.dataTransfer.setData("text/plain", event.target.dataset.ligne + "," + event.target.dataset.colonne);
      }

      img.ondragenter = () => {
        img.classList.add("grilleDragOver");
      }

      img.ondragleave = () => {
        img.classList.remove("grilleDragOver");
      }

      img.ondrop = (event) => {
        event.preventDefault();
        img.classList.remove("grilleDragOver");
        let [ligne, colonne] = event.dataTransfer.getData("text/plain").split(",");
        let c1 = this.tabcookies[ligne][colonne];
        let c2 = this.tabcookies[img.dataset.ligne][img.dataset.colonne];
        Cookie.swapCookies(c1, c2);
        //on met à jour la grille
        // this.showCookies();
      }

      img.ondragover = (event) => {
        event.preventDefault();
      };


    });


    this.updateCookies();

    const montrerMatchsCookies = document.getElementById('montrerCookiesMatchs')
    montrerMatchsCookies.addEventListener('click', () => {
      console.log("Montrer les matchs de cookies")
      this.detecterMatch3Lignes();
      this.detecterMatch3Colonnes();
      this.montrerMatchsDeCookies();
      //wait 2s
      let aEteVidee = false;
      setTimeout(() => {
        // this.hideCookiesToBeRemoved();
        aEteVidee = this.vider();
        // setTimeout(() => {
        //   if (aEteVidee) {
        //     this.handleFallsAndRefill();
        //     console.log("fall and refill");
        //     this.showCookies();
        //   }
        // }, 1000);
        if (aEteVidee) {
          this.chuteColonnes();
          this.showCookies();
          console.log("fall and refill");
        }
      }, 2000);

    });


  }

  // inutile ?
  getCookieFromLC(ligne, colonne) {
    return this.tabcookies[ligne][colonne];
  }


  detecterMatch3Lignes() {
    for (let i = 0; i < this.tabcookies.length; i++) {
      let matchedCookies = [];
      for (let j = 0; j < this.tabcookies[i].length; j++) {
        if (matchedCookies.length > 0 && matchedCookies[matchedCookies.length - 1].type === this.tabcookies[i][j].type) {
          matchedCookies.push(this.tabcookies[i][j]);
        } else {
          matchedCookies = [this.tabcookies[i][j]];
        }
        if (matchedCookies.length >= 3) {
          for (let cookie of matchedCookies) {
            cookie.matched = true;
          }
        }
      }
    }
  }

  detecterMatch3Colonnes() {
    for (let j = 0; j < this.tabcookies[0].length; j++) {
      let matchedCookies = [];
      for (let i = 0; i < this.tabcookies.length; i++) {
        if (matchedCookies.length > 0 && matchedCookies[matchedCookies.length - 1].type === this.tabcookies[i][j].type) {
          matchedCookies.push(this.tabcookies[i][j]);
        } else {
          matchedCookies = [this.tabcookies[i][j]];
        }
        if (matchedCookies.length >= 3) {
          this.addScore(matchedCookies.length - 2)
          for (let cookie of matchedCookies) {
            cookie.matched = true;
          }
        }
      }
    }
  }

  vider() {
    let aEteVidee = false;
    for (let row of this.tabcookies) {
      for (let cookie of row) {
        if (cookie && cookie.matched) {
          cookie.htmlImage.remove();
          this.tabcookies[cookie.ligne][cookie.colonne] = null;
        }

        !aEteVidee && (aEteVidee = true);
      }
    }
    return aEteVidee;
  }

  montrerMatchsDeCookies() {
    for (let row of this.tabcookies) {
      for (let cookie of row) {
        if (cookie.matched) {
          cookie.selectionnee(); // Call the 'selectionnee' method of the Cookie class
        }
      }
    }
  }

  chuteColonnes() {
    let estTombee = false;
    for (let c = 0; c < this.c; c++) {
      if (this.chuteColonne(c)) {
        estTombee = true;
      }
    }
    if (estTombee) {
      this.chuteColonnes();
    }
    return estTombee;
  }

  chuteColonne(c) {
    let estTombee = false;
    for (let l = this.tabcookies.length - 1; l >= 0; l--) {
      if (this.tabcookies[l][c] === null) {

        // Move cookies down
        for (let ligneEnBas = l - 1; ligneEnBas >= 0; ligneEnBas--) {
          this.tabcookies[ligneEnBas + 1][c] = this.tabcookies[ligneEnBas][c];
        }
        estTombee = true;
        this.remplaceCookie(l, c);
      }
    }
    return estTombee;
  }

  remplaceCookie(l, c) {
    const type = Math.floor(Math.random() * 6); // 6 types de cookies
    this.tabcookies[0][c] = new Cookie(type, l, c);
  }

  updateCookies() {
    for (let l = 0; l < this.tabcookies.length; l++) {
      for (let c = 0; c < this.tabcookies[l].length; c++) {
        const cookie = this.tabcookies[l][c];
        if (cookie) {
          cookie.ligne = l;
          cookie.colonne = c;
          cookie.htmlImage.dataset.ligne = l;
          cookie.htmlImage.dataset.colonne = c;
        }
      }
    }
  }





  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // créer un tableau vide de 9 cases pour une ligne
    // en JavaScript on ne sait pas créer de matrices
    // d'un coup. Pas de new tab[3][4] par exemple.
    // Il faut créer un tableau vide et ensuite remplir
    // chaque case avec un autre tableau vide
    // Faites ctrl-click sur la fonction create2DArray
    // pour voir comment elle fonctionne
    let tab = create2DArray(9);

    // remplir
    for (let l = 0; l < this.l; l++) {
      for (let c = 0; c < this.c; c++) {

        // on génère un nombre aléatoire entre 0 et nbDeCookiesDifferents-1
        const type = Math.floor(Math.random() * nbDeCookiesDifferents);
        //console.log(type)
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }

  addScore(pointsDeScore) {
    let score = document.getElementById("score");
    score.innerHTML = parseInt(score.innerHTML) + pointsDeScore;
  }
}
