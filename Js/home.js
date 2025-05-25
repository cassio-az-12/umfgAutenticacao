function load() {
    cookies = getCoockies();

    // “Seja bem-vindo(a), email_do_usuario_autenticado! Seu token expira data_expiracao_do_token
    if (cookies.token) {
        let token = cookies.token;
        let expiracao = parseDate(cookies.dataExpiracao);
        let email = cookies.email;

        document.getElementById("welcomeMessage").innerHTML = `Bem-vindo(a), ${email}! Seu token expira em ${expiracao}`;
    } else {
        document.getElementById("welcomeMessage").innerHTML = "Você não está autenticado.";
    }
    console.log(cookies);

}

function getCoockies() {
    let cookies = document.cookie.split(';');
    let cookieObj = {};
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let [key, value] = cookie.split('=');
        cookieObj[key] = decodeURIComponent(value);
    }
    return cookieObj;
}

// 2025-05-24T17:58:51.4997064+00:00
function parseDate(dateString) {
    let date = new Date(dateString);
    let options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    return date.toLocaleString('pt-BR', options);
}