"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = require("../models/todo");
const user_1 = require("../models/user");
const user_todo_1 = require("../models/user_todo");
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
    var currentId = '';
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
    }
    user_todo_1.User_Todo.aggregate([
        { $unwind: "$todoId" },
        { $lookup: { from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo" } },
        { $match: { "userId": currentId } }
    ])
        .exec().then((todos) => {
        const foundTodos = todos.map(todo => {
            return {
                id: todo.oneTodo[0].todoId,
                title: todo.oneTodo[0].todoTitle,
                text: todo.oneTodo[0].todoText
            };
        });
        response.status(200).json({ data: foundTodos });
    }).catch((reason) => {
        response.status(400).json({ message: reason });
    });
});
// Eine Aufgabe eines Users anzeigen
router.get('/todo/:todoId', (request, response) => {
    const errors = [];
    var currentId = '';
    var currentTodoId = request.params['todoId'];
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
    }
    user_todo_1.User_Todo.aggregate([
        { $unwind: "$todoId" },
        { $lookup: { from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo" } },
        { $match: { "userId": currentId, "todoId": currentTodoId } }
    ])
        .exec().then((todos) => {
        const foundTodos = todos.map(todo => {
            return {
                todoId: todo.oneTodo[0].todoId,
                title: todo.oneTodo[0].todoTitle,
                text: todo.oneTodo[0].todoText
            };
        });
        response.status(200).json({ data: foundTodos[0] });
    }).catch((reason) => {
        response.status(400).json({ message: reason });
    });
});
exports.default = router;
