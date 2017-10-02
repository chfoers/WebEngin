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
    var currentUserId;
    currentUserId = '';
    if (request.jwtClaimSet != null) {
        currentUserId = request.jwtClaimSet.userId;
    }
    user_1.User.findOne({ userId: currentUserId }).exec().then((user) => {
        if (!user) {
            return Promise.reject('Kein User eingeloggt');
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
                response.status(400).json({ message: "Daten entsprechen nicht dem Datenbank-Schema" });
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
// Aufgabe ändern
router.put('/todo/:todoId', (request, response) => {
    const errors = [];
    var currentId = '';
    const todoData = request.body;
    var currentTodoId = request.params['todoId'];
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
        todo_1.Todo.update({ "todoId": currentTodoId }, {
            $set: { "todoTitle": todoData.title, "todoText": todoData.text },
        })
            .then(() => {
            response.sendStatus(201);
        })
            .catch((reason) => {
            response.status(400).json({ message: "Todo existiert nicht" });
        });
    }
    else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }
});
// Alle Aufgaben eines Users anzeigen
router.get('/index/todo', (request, response) => {
    const errors = [];
    var currentId = '';
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
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
            response.status(400).json({ message: 'Todo existiert nicht' });
        });
    }
    else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }
});
// Eine Aufgabe eines Users anzeigen
router.get('/todo/:todoId', (request, response) => {
    const errors = [];
    var currentId = '';
    var currentTodoId = request.params['todoId'];
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
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
            response.status(400).json({ message: 'Fehler beim Laden der Todos' });
        });
    }
    else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }
});
// Eine Aufgabe löschen
router.delete('/todo/:todoId', (request, response) => {
    const errors = [];
    var currentId = '';
    var currentTodoId = request.params['todoId'];
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
        user_todo_1.User_Todo.findOne({ userId: currentId, todoId: currentTodoId }).exec().then((user_todo) => {
            if (!user_todo) {
                return Promise.reject('Kein User eingeloggt');
            }
            else {
                return user_todo_1.User_Todo.remove({ todoId: currentTodoId }).exec();
            }
        })
            .then(() => {
            return todo_1.Todo.remove({ todoId: currentTodoId }).exec();
        })
            .then(() => {
            response.status(200).json({});
        })
            .catch((reason) => {
            response.status(400).json({ message: 'Todo existiert nicht' });
        });
    }
    else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }
});
exports.default = router;
