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
      facilidadeUsoAvaliacao: document.getElementById("facilidadeUsoAvaliacao")
        .value,
      dificuldades: document.getElementById("dificuldades").value,
      designAtrativoAvaliacao: document.getElementById(
        "designAtrativoAvaliacao"
      ).value,
      layoutFacilita: document.getElementById("layoutFacilita").value,
      suporteAvaliacao: document.getElementById("suporteAvaliacao").value,
      suporteResolucao: document.getElementById("suporteResolucao").value,
      expectativasAtendidas: document.getElementById("expectativasAtendidas")
        .value,
      melhorias: document.getElementById("melhorias").value,
      feedbackAdicional: document.getElementById("feedbackAdicional").value,
    };

    // Formatar os dados para enviar para o WhatsApp
    let formattedData = "";
    for (const key in formData) {
      formattedData += `*${key}:* ${formData[key]}\n\n`;
    }

    // Enviar os dados para o WhatsApp
    const whatsappLink = `https://wa.me/5581999440404?text=${encodeURIComponent(
      formattedData
    )}`;

    window.location.href = whatsappLink;
  });
