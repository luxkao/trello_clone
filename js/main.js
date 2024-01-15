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
let boardContentWrapper = document.getElementById("board-content-wrapper");
let btnCadastrese = document.getElementById("cadastrese");
let btnSair = document.getElementById("sair");
let btnTrelloso = document.getElementById("trelloso");
let btnCreateBoard = document.getElementById("btn-create-board");
let modalCreateBoard = document.getElementById("create-board");
let boardsList = document.getElementById("boards");
let userIcon = document.getElementById("avatar");
let userDropDownMenu = document.getElementById("dropdown-menu");
let boardContent = document.getElementById("board-content");
let createNewListBtn;


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
    Show.toggle(boardContentWrapper);
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

      boardContent.dataset.boardId = boardId;

      Show.toggle(boardsList);
      Show.toggle(boardContent);
      Show.toggle(boardContentWrapper);
    });
  });
}

async function loadLists(boardId) {
  boardContent.innerHTML = '';
  try {
    const lists = await Board.getLists(boardId);
    for (let list of lists) {
      const li = document.createElement('li');
      const div = document.createElement('div');
      li.innerHTML = `<h2>${list.name}</h2>`;
      li.dataset.id = list.id;
      const cardsElement = await loadCards(list.id);
      div.appendChild(cardsElement);
      li.appendChild(div);

    const addCardBtn = document.createElement('button');
    addCardBtn.innerHTML = `
    <span>
      <i class="fa-solid fa-plus"></i>
    </span>
    Adicionar um cartão
    `; 
    addCardBtn.addEventListener('click', showCreateCardForm);
    li.appendChild(addCardBtn);

    boardContent.appendChild(li);
    }

    createNewListBtn = document.createElement('button');
    createNewListBtn.innerHTML = `
    <span>
      <i class="fa-solid fa-plus"></i>
    </span>
    Adicionar uma lista
    `;  
    createNewListBtn.addEventListener('click', showCreateListForm);
    boardContent.appendChild(createNewListBtn);

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

function showCreateListForm() {
  this.style.display = 'none';

  const form = document.createElement('form');
  form.innerHTML = `
  <input id="list-title-input" type="text" placeholder="Insira o título da lista...">
  <span>
    <button class="add-btn" type="submit">Adicionar lista</button>
    <button class="cancel-btn" type="reset"><i class="fa-solid fa-times"></i></button>
  </span>
  `;
  form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const listTitleInput = document.getElementById('list-title-input');
    const listTitle = listTitleInput.value;
    const boardId = boardContent.dataset.boardId; 
    const position = boardContent.children.length;

    Board.createList(boardId, listTitle, position).then(() => {
      loadLists(boardId);
    });
  });

  form.addEventListener('reset', (e) => {
    e.preventDefault();

    form.style.display = 'none';
    createNewListBtn.style.display = 'flex';
  });

  boardContent.appendChild(form);
}

function showCreateCardForm() {
  this.style.display = 'none';

  const form = document.createElement('form');
  form.innerHTML = `
  <textarea id="card-textarea" placeholder="Insira um título para este cartão..."></textarea>
  <span>
    <button class="add-btn" type="submit">Adicionar cartão</button>
    <button class="cancel-btn" type="reset"><i class="fa-solid fa-times"></i></button>
  </span>
  `;
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const cardTextarea = document.getElementById('card-textarea');
    const cardTitle = cardTextarea.value;
    const listId = this.parentElement.dataset.id; 

    const cards = await Board.getCards(listId);
    const position = cards.length; 

    Board.createCard(listId, cardTitle, position).then(() => {
      loadLists(boardContent.dataset.boardId);
    });
  });

  form.addEventListener('reset', (e) => {
    e.preventDefault();

    form.style.display = 'none';
    this.style.display = 'flex';
  });

  this.parentElement.appendChild(form);
}
