import Fetch from "./fetch.js";

async function getAll() {
    const boards = await Fetch.request('/users/me/boards');
    return boards;
}

async function create(name, color, favorito) {
    const board = {name: name,
        color: color,
        favorito: favorito};

    const newBoard = await Fetch.request('/boards', board, 'POST');
    return newBoard;
}

async function updateFavorite(board_id, favorito) {
    const board = {favorito: favorito };
    const updatedBoard = await Fetch.request(`/boards/${board_id}`, board, 'PATCH');
    return updatedBoard;
}

async function updateBoard(board_id, name, color) {
    const board = {name: name,
        color: color
    };
    const updatedBoard = await Fetch.request(`/boards/${board_id}`, board, 'PATCH');
    return updatedBoard;
}

async function getLists(board_id) {
    const lists = await Fetch.request(`/boards/${board_id}/lists`);
    return lists;
}

async function getCards(list_id) {
    const cards = await Fetch.request(`/lists/${list_id}/cards`);
    return cards;
}

async function createList(board_id, name, position) {
    const list = {name: name,
        board_id: board_id,
        position: position
    };
    const newList = await Fetch.request(`/lists`, list, 'POST');
    return newList;
}

async function createCard(list_id, name, position) {
    const card = {name: name,
        date: new Date().toISOString(),
        list_id: list_id,
        position: position
    };
    const newCard = await Fetch.request(`/cards`, card, 'POST');
    return newCard;
}

async function moveCard(card_id, list_id, position) {
    const card = {list_id: list_id,
        date: new Date().toISOString(),
        position: position
    };
    const newCard = await Fetch.request(`/cards/${card_id}`, card, 'PATCH');
    return newCard;
}
async function updateCard(card_id, name) {
    const card = {name: name,
        date: new Date().toISOString(),
    };
    const updatedCard = await Fetch.request(`/cards/${card_id}`, card, 'PATCH');
    return updatedCard;
}
export default {getAll, create, updateFavorite, updateBoard, getLists, getCards, createList, createCard, moveCard, updateCard};