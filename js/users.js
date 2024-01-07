import Fetch from "./fetch.js";

async function login(loginFormData) {
    const token = await Fetch.request('/auth/token', loginFormData, 'POST');
    return token;
}

async function getAll() {
    const users = await Fetch.request('/users')
    return users;
}

async function create(name, username, password, avatar) {
    const user = {
        name: name, username: username, password: password, avatar_url: avatar
    }
    const newUser = await Fetch.request('/users', user, 'POST');
    return newUser;
}

async function me() {
    const user = await Fetch.request('/users/me');
    return user;
}

export default {login, getAll, create, me};