var urlBase = "https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com";

function exibirMensagem(texto, tipo) {
    var mensagem = document.getElementById("mensagem");
    mensagem.innerText = texto;
    mensagem.className = "mensagem " + tipo;
    mensagem.style.display = "block";

    setTimeout(() => {
        mensagem.style.display = "none";
    }, 60000);
}

function registrar() {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("password").value;
    var confirmarSenha = document.getElementById("confirmPassword").value;

    if (email === "" || senha === "" || confirmarSenha === "") {
        exibirMensagem("Por favor, preencha todos os campos.", "erro");
        return;
    }

    if (senha !== confirmarSenha) {
        exibirMensagem("As senhas não coincidem.", "erro");
        return;
    }

    var dados = {
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
            exibirMensagem("Cadastro realizado com sucesso! Você já pode fazer login.", "sucesso");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            exibirMensagem(await resposta.text(), "erro");
         }
        })
    .catch(erro => {
        console.error("Erro:", erro);
        exibirMensagem("Ocorreu um erro ao tentar cadastrar.", "erro");
        });
    }

    function fazerLogin() {
    var emailLogin = document.getElementById("emailLog").value;
    var senhaLogin = document.getElementById("passwordLog").value;

    if (emailLogin === "" || senhaLogin === "") {
        exibirMensagem("Por favor, preencha todos os campos.", "erro");
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
            var json = await resposta.json();
            document.cookie = "email=" + emailLogin + "; path=/;";
            document.cookie = "token=" + json.token + "; path=/;";
            document.cookie = "dataExpiracao=" + json.dataExpiracao + "; path=/;";
            exibirMensagem("Login realizado com sucesso!", "sucesso");
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);
        } else {
            exibirMensagem(await resposta.text(), "erro");
        }
        })
    .catch(erro => {
        console.error("Erro:", erro);
        exibirMensagem("Ocorreu um erro ao tentar fazer login.", "erro");
     });
 }

