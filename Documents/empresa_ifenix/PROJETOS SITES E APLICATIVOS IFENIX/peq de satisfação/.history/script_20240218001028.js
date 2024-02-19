// function imprimir() {
//   window.print();
// }

// const submitButton = document.getElementById("submit-btn");

// submitButton.addEventListener("click", async (event) => {
//   event.preventDefault();

//   const formData = new FormData(document.getElementById("culto-form"));

//   try {
//     const response = await fetch("seu_endpoint_de_processamento", {
//       method: "POST",
//       body: formData,
//     });

//     if (response.ok) {
//       // Imprimir o formulário
//       imprimir();
//     } else {
//       console.error("Erro ao enviar o formulário");
//     }
//   } catch (error) {
//     console.error("Erro ao enviar o formulário", error);
//   }
// });
document
  .getElementById("formEmpresa")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Coleta dos dados do formulário
    const formData = {
      nomeEmpresa: document.getElementById("nomeEmpresa").value,
      servicos: document.getElementById("servicos").value,
      diferenciais: document.getElementById("diferenciais").value,
      publicoAlvo: document.getElementById("publicoAlvo").value,
      informacoesProcuradas: document.getElementById("informacoesProcuradas")
        .value,
      objetivos: document.getElementById("objetivos").value,
      logotipo: document.getElementById("logotipo").value,
      valores: document.getElementById("valores").value,
      referencia: document.getElementById("referencia").value,
      funcionalidade: document.getElementById("funcionalidade").value,
      expectativas: document.getElementById("expectativas").value,
    };

    // Enviar os dados para o WhatsApp
    const formattedData = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const whatsappLink = `https://wa.me/<seu_numero>?text=${encodeURIComponent(
      formattedData
    )}`;

    window.location.href = whatsappLink;
  });
