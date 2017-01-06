import {users, works} from '../backend/test-data.js';

export {users, works};

export const userById = (userId) => users.find( (u) => u.id == userId );

export const workById = (workId) => works.find( (u) => u.id == workId );

// For now, artificially inflate the number of items shown
export const getAllWorks = () => works.concat(works).concat(works).concat(works);
