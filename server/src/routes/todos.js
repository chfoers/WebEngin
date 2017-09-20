"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = require("../models/todo");
const user_1 = require("../models/user");
const user_todo_1 = require("../models/user_todo");
const todoService_1 = require("../services/todoService");
//Validationservice
const router = express_1.Router();
// Aufgabe anlegen
router.post('/todo', (request, response) => {
    const todoData = request.body;
    const errors = [];
    var currentEmail;
    currentEmail = '';
    if (request.jwtClaimSet != null) {
        currentEmail = request.jwtClaimSet.email;
    }
    user_1.User.findOne({ email: currentEmail }).exec().then((user) => {
        if (!user) {
            return Promise.reject('No user found.');
        }
        else {
            const todo = new todo_1.Todo({
                todoTitle: todoData.title,
                todoText: todoData.text
            });
            const user_todoObject = new user_todo_1.User_Todo({
                userId: user.userId,
                todoId: todo.todoId
            });
            const user_todo = new user_todo_1.User_Todo(user_todoObject);
            user_todo.save().catch((reason) => {
                response.status(400).json({ message: reason });
            });
            return todo.save();
        }
    })
        .then(() => {
        response.sendStatus(201);
    })
        .catch((reason) => {
        response.status(400).json({ message: reason });
    });
});
// Alle Aufgaben eines Users anzeigen
router.get('/index/todo', (request, response) => {
    const errors = [];
    var currentId;
    currentId = '';
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
    }
    var todosList = [];
    var promiseList = [];
    user_todo_1.User_Todo.find({ userId: currentId }).exec()
        .then((todos) => {
        for (var i = 0; i < todos.length; i++) {
            promiseList.push(new Promise((resolve, reject) => {
                todoService_1.TodoService.getTodoById(todos[i].todoId).then((todo) => {
                    todosList[i] = todo;
                    response.json({ data: [todo] });
                    resolve;
                }).catch(() => {
                    resolve;
                });
            }));
        }
    }).then(function () {
        return Promise.all(promiseList);
    }).then(function () {
        console.log(todosList);
        response.json({ data: todosList });
    }).catch((reason) => {
        response.status(401).json({ message: reason });
    });
});
exports.default = router;
