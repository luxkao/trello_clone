import User from './users.js';
import Token from './token.js';
import Show from './show.js';

let formLogin = document.getElementById("form-login");
let formCreateUser = document.getElementById("form-create-user");
let spanMe = document.getElementById("me");
let telaLogin = document.getElementById("login");
let telaHome = document.getElementById("home");
let telaCadastro = document.getElementById("signup");
let btnCadastrese = document.getElementById("cadastrese");
let btnSair = document.getElementById("sair");

User.me().then(me => {
  spanMe.innerHTML = JSON.stringify(me);
}).catch(error => {
  console.error(error.message);
});

formLogin.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(formLogin);
  User.login(formData).then(token => {
    Token.saveToken(token);

    Show.toggle(telaLogin);
    Show.toggle(telaHome);
  });

});

formCreateUser.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("new-name").value;
  const username = document.getElementById("new-username").value;
  const password = document.getElementById("new-password").value;
  const avatar = document.getElementById("new-avatar").value;
  console.log(name, username, password, avatar);
  User.create(name, username, password, avatar).then(user=>{
    console.log(`usuário criado! username:${user.username} senha:${user.password}`);

    Show.toggle(telaCadastro);
    Show.toggle(telaLogin);
  }).catch(error => {
    console.log(error.message);
  });

});

btnCadastrese.addEventListener("click", (e) => {
  e.preventDefault();

  Show.toggle(telaLogin);
  Show.toggle(telaCadastro);
})

btnSair.addEventListener("click", (e) =>{
  e.preventDefault();

  localStorage.removeItem("token");
  Show.toggle(telaHome);
  Show.toggle(telaLogin);
})