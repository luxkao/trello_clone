import User from './users.js';
import Token from './token.js';
import Show from './show.js';
import Board from './boards.js';

let formLogin = document.getElementById("form-login");
let formCreateUser = document.getElementById("form-create-user");
let formCreateBoard = document.getElementById("form-create-board");
let telaLogin = document.getElementById("forms");
let telaHome = document.getElementById("home");
let divLogin = document.getElementById("login");
let divCadastro = document.getElementById("signup");
let asideDiv = document.getElementById("aside");
let mainDiv = document.getElementById("main");
let btnCadastrese = document.getElementById("cadastrese");
let btnSair = document.getElementById("sair");
let btnTrelloso = document.getElementById("trelloso");
let btnCreateBoard = document.getElementById("btn-create-board");
let modalCreateBoard = document.getElementById("create-board");
let boardsList = document.getElementById("boards");
let userIcon = document.getElementById("avatar");
let userDropDownMenu = document.getElementById("dropdown-menu");
let boardContent = document.getElementById("board-content");


formLogin.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(formLogin);
  User.login(formData).then(token => {
    Token.saveToken(token);

    Show.toggle(telaLogin);
    Show.toggle(telaHome);
    loadBoards();
    User.me().then(user => {
      document.getElementById("avatar").src = user.avatar_url;
    }).catch(error => {
      console.error(error.message);
    });
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

    Show.toggle(divCadastro);
    Show.toggle(divLogin);
  }).catch(error => {
    console.log(error.message);
  });

});

btnCadastrese.addEventListener("click", (e) => {
  e.preventDefault();

  Show.toggle(divLogin);
  Show.toggle(divCadastro);
})

btnTrelloso.addEventListener("click", (e) =>{
  e.preventDefault();

  const defaultColor = "#1d2125";

  if (boardsList.classList.contains('no-show')){

    Show.applyBackgroundColor(defaultColor, [asideDiv, mainDiv]);
    Show.toggle(boardsList);
    Show.toggle(boardContent);
  }
});

btnSair.addEventListener("click", (e) =>{
  e.preventDefault();

  Token.removeToken();
  Show.toggle(telaHome);
  Show.toggle(telaLogin);
})

btnCreateBoard.addEventListener("click", (e) =>{
  e.preventDefault();

  modalCreateBoard.showModal();
})

formCreateBoard.addEventListener("submit", (e) =>{
  e.preventDefault();

  const name = document.getElementById("new-board-name").value;
  const color = document.getElementById("new-board-color").value;

  Board.create(name, color).then(board => {
    loadBoards();
    modalCreateBoard.close();
  }).catch(error => {
    console.log(error.message);
  });
});

userIcon.addEventListener("click", (e) =>{
  e.preventDefault();
  e.stopPropagation();

  Show.toggle(userDropDownMenu);

  User.me().then(user => {
    document.getElementById("avatar-dropdown").src = user.avatar_url;
    document.getElementById("name-dropdown").innerHTML = user.name;
    document.getElementById("username-dropdown").innerHTML = user.username;
  }).catch(error => {
    console.error(error.message);
  });
});

userDropDownMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {
  if (userDropDownMenu.classList.contains('show')) {
    Show.toggle(userDropDownMenu);
  }
});

function loadBoards() {
  boardsList.innerHTML = '';
  Board.getAll().then(boards => {
    for (let board of boards) {
      const li = document.createElement('li'); 
      li.innerHTML = `
      <h2> ${board.name} </h2>
      <i class="${board.favorito ? 'fa-solid' : 'fa-regular'} fa-star"></i>
      `;
      li.style.backgroundColor = board.color;
      li.dataset.color = board.color;
      li.dataset.id = board.id;
      li.dataset.favorite = board.favorito;
      
      boardsList.appendChild(li);
    }
    addClickEventToFavorites();
    addClickEventToBoards();
  }).catch(error => {
    console.error(error.message);
  });
}

function addClickEventToFavorites(){
  const favoriteIcons = document.querySelectorAll(".fa-star");

  favoriteIcons.forEach( (icon) => {
    icon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");

      const boardId = icon.parentElement.dataset.id;
      let isFavorite = icon.parentElement.dataset.favorite === 'true';;
      
      Board.updateFavorite(boardId, !isFavorite).then(board => {
        icon.parentElement.dataset.favorite = board.favorito ? 'true' : 'false';
      });
      
    });
  });  
}

function addClickEventToBoards() {
  const boards = document.querySelectorAll("#boards li");

  boards.forEach( (board) => {
    board.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const boardId = board.dataset.id;
      const boardColor = board.dataset.color;
      
      Show.applyBackgroundColor(boardColor, [asideDiv, mainDiv]);

      loadLists(boardId);

      Show.toggle(boardsList);
      Show.toggle(boardContent);
    });
  });
}

async function loadLists(boardId) {
  boardContent.innerHTML = '';
  try {
    const lists = await Board.getLists(boardId);
    for (let list of lists) {
      const li = document.createElement('li');
      li.innerHTML = `<h2>${list.name}</h2>`;
      li.dataset.id = list.id;
      const cardsElement = await loadCards(list.id);
      li.appendChild(cardsElement);
      boardContent.appendChild(li);
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function loadCards(listId) {
  const ul = document.createElement('ul');
  try {
    const cards = await Board.getCards(listId);
    for (let card of cards) {
      const li = document.createElement('li');
      li.innerHTML = `<h2>${card.name}</h2>`;
      li.dataset.id = card.id;
      ul.appendChild(li);
    }
  } catch (error) {
    console.error(error.message);
  }
  return ul;
}