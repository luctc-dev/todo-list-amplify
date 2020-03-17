// const uuidv4 = require('uuid/v4');
// import uuidv4 from 'uuid/v4';
import { LIST_TASK_KEY } from '../constants';

let listTasks = localStorage.getItem(LIST_TASK_KEY);

if (!listTasks) {
  listTasks = [];
} else {
  try {
    listTasks = JSON.parse(listTasks);
  } catch (e) {
    listTasks = [];
    localStorage.setItem(LIST_TASK_KEY, "[]");
  }
}

export default listTasks;


// export default [
//   {
//     id: uuidv4(),
//     name: 'ZBB ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis ea c',
//     level: 1 // Medium
//   },
//   {
//     id: uuidv4(),
//     name: 'DEF Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis ea c',
//     level: 2 // High
//   },
//   {
//     id: uuidv4(),
//     name: 'MPG Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis ea c',
//     level: 0 // Small
//   },
//   {
//     id: uuidv4(),
//     name: 'ABC ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis ea c',
//     level: 0 // Small
//   },
// ]