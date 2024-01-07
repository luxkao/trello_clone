function saveToken(token) {
    localStorage.setItem("token", `${token.token_type} ${token.access_token}`);
}

function getToken(token) {
    return localStorage.getItem("token");
}

export default {saveToken, getToken};