"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_1 = require("../models/todo");
var foundTodo;
exports.TodoService = {
    getTodoById: (id) => {
        return new Promise((resolve, reject) => {
            todo_1.Todo.findOne({ todoId: id }).exec()
                .then((todo) => {
                if (!todo) {
                    reject('No todo was found.');
                }
                else {
                    resolve(todo);
                }
            });
        });
    }
};
