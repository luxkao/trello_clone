import Fetch from "./fetch.js";

async function getAll() {
    const boards = await Fetch.request('/users/me/boards');
    return boards;
}

async function create(name, color, favorite) {
    const board = {name: name,
        color: color,
        favorite: favorite};

    const newBoard = await Fetch.request('/boards', board, 'POST');
    return newBoard;
}

export default {getAll, create};