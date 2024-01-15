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
export default {getAll, create, updateFavorite};