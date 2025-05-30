var urlBase = "https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com";

function exibirMensagem(texto, tipo, idElemento = "mensagem") {
    var mensagem = document.getElementById(idElemento);
    if (!mensagem) return;

    mensagem.innerText = texto;
    mensagem.className = "mensagem " + tipo;
    mensagem.style.display = "block";

    setTimeout(() => {
        mensagem.style.display = "none";
    }, 60000);
}


function registrar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const confirmarSenha = document.getElementById("confirmPassword").value;

    if (email === "" || senha === "" || confirmarSenha === "") {
        exibirMensagem("Por favor, preencha todos os campos.", "erro", "mensagemCadastro");
        return;
    }

    if (senha !== confirmarSenha) {
        exibirMensagem("As senhas não coincidem.", "erro", "mensagemCadastro");
        return;
    }

    const dados = {
        email: email,
        senha: senha,
        senhaConfirmada: confirmarSenha,
    };

    fetch(urlBase + "/Autenticacao/registar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(async resposta => {
        if (resposta.ok) {
            exibirMensagem("Cadastro realizado com sucesso! Você já pode fazer login.", "sucesso", "mensagemCadastro");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            const jsonErro = await resposta.json();
            if (jsonErro.errors) {
                const mensagens = Object.values(jsonErro.errors).flat(); // Junta todas as mensagens de erro
                exibirMensagem(mensagens.join(" "), "erro", "mensagemCadastro");
            } else {
                exibirMensagem("Erro ao cadastrar: " + jsonErro.title, "erro", "mensagemCadastro");
            }
        }
    })
    .catch(erro => {
        console.error("Erro:", erro);
        exibirMensagem("Ocorreu um erro ao tentar cadastrar.", "erro", "mensagemCadastro");
    });
}


// Tradutor de mensagens de erro da API
function traduzirMensagemErro(mensagem) {
    if (mensagem.includes("already in use") || mensagem.includes("Email já registrado")) {
        return "Este email já está em uso. Tente outro.";
    }
    if (mensagem.includes("Password must be at least")) {
        return "A senha deve conter no mínimo 6 caracteres.";
    }
    if (mensagem.includes("Invalid email format")) {
        return "Formato de email inválido.";
    }

    // Mensagem padrão
    return "Erro ao cadastrar: " + mensagem;
}

   function fazerLogin() {
    var emailLogin = document.getElementById("emailLog").value;
    var senhaLogin = document.getElementById("passwordLog").value;

    if (emailLogin === "" || senhaLogin === "") {
        exibirMensagem("Por favor, preencha todos os campos.", "erro", "mensagemLogin");
        return;
    }

    var dados = {
        email: emailLogin,
        senha: senhaLogin,
    };

    fetch(urlBase + "/Autenticacao/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(async resposta => {
        if (resposta.ok) {
            const json = await resposta.json();
            document.cookie = `email=${emailLogin}; path=/; Secure; SameSite=Strict`;
            document.cookie = `token=${json.token}; path=/; Secure; SameSite=Strict`;
            document.cookie = `dataExpiracao=${json.dataExpiracao}; path=/; Secure; SameSite=Strict`;

            exibirMensagem("Login realizado com sucesso!", "sucesso", "mensagemLogin");
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);
        } else {
            const texto = await resposta.text();

            if (resposta.status === 400 || texto.toLowerCase().includes("senha") || texto.toLowerCase().includes("usuário")) {
                exibirMensagem("Usuário ou senha inválidos.", "erro", "mensagemLogin");
            } else {
                exibirMensagem("Erro ao fazer login: " + texto, "erro", "mensagemLogin");
            }
        }
    })
    .catch(erro => {
        console.error("Erro:", erro);
        exibirMensagem("Ocorreu um erro ao tentar fazer login.", "erro", "mensagemLogin");
    });
}



