// function saludar(texto) {
//     return "hola "+ texto;
// }
// console.log(saludar('Richi'));


// const formatoBienvenida = function (prefijo,texto) {
//     return "¡" + prefijo + " " + texto + "!";
// }

// const formatoDespedida = function (prefijo,texto) {
//     return prefijo + " " + texto + "... ):";
// }

// function mensaje(prefijo, formateador) {
//     return function(texto) {
//         return formateador(prefijo,texto);
//     }
// }

const mensaje = (prefijo, format) => (texto) => format(prefijo, texto);

const bienvenida = mensaje("Hola", (prefijo, texto) => `¡${prefijo} ${texto}!`);
const despedida = mensaje("Adios", (prefijo, texto) => `${prefijo} ${texto}... ):`);



console.log(bienvenida("Mundo"));
console.log(despedida("Mundo"));

