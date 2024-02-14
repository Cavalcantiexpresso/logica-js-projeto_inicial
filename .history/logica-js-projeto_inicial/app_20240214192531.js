alert("Olá bem vindo ao jogo do numero secreto!");
let numeroMaximo = 500;
let numeroSecreto = parseInt(Math.random() * numeroMaximo + 1);
console.log(numeroSecreto);
let chute;
let tentativas = 1;

while (chute != numeroSecreto) {
  chute = prompt(`Escolha um nímero entre 1 e ${numeroMaximo}`);
  if (chute == numeroSecreto) {
    break;
  } else {
    if (chute > numeroSecreto) {
      alert(`O número correto é menor que ${chute}`);
    } else {
      alert(`O número certo é maior que ${chute}`);
    }
    tentativas++;
  }
}
let palavraTentativa = tentativas > 1 ? "tentativas" : "tentativa";
alert(
  `Isso ai! Você descobriu o úmero secreto ${numeroSecreto} com ${tentativas} ${palavraTentativa}`
);

// if (tentativas > 1) {
//   alert(
//     `Isso ai! Você descobriu o úmero secreto ${numeroSecreto} com ${tentativas} tentativas`
//   );
// } else {
//   alert(
//     `Isso ai! Você descobriu o úmero secreto ${numeroSecreto} com ${tentativas} tentativa`
//   );
// }
