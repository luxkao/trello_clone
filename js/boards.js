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

async function getLists(board_id) {
    const lists = await Fetch.request(`/boards/${board_id}/lists`);
    return lists;
}

async function getCards(list_id) {
    const cards = await Fetch.request(`/lists/${list_id}/cards`);
    return cards;
}

export default {getAll, create, updateFavorite, getLists, getCards};