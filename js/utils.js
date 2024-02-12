export { create2DArray, actualiserTemps };

/** En JavaScript on ne peut pas déclarer directement de tableau à n dimensions
   en précisant toutes les dimensions. tab [4][4] n'est pas possible par exemple.
   On déclare en général un tableau à une dimension de taille varialbe (ci-dessous 
   let arr = []) puis ensuite pour chacune des lignes du tableau, on lui affecte un autre
   tableau (arr[i] = [] ci-dessous) */

function create2DArray(rows) {
  let arr = [];

  for (let i = 0; i < rows; i++) {
    arr[i] = [];
  }

  return arr;
}

function actualiserTemps() {
  //increase time every seconds
  let temps = document.getElementById("temps");
  let s = 0;
  let m = 0;
  let h = 0;
  let timer = setInterval(function () {
    s++;
    if (s === 60) {
      s = 0;
      m++;
    }
    if (m === 60) {
      m = 0;
      h++;
    }
    temps.innerHTML = `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  }, 1000);
}
