"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = require("../models/todo");
const user_1 = require("../models/user");
const user_todo_1 = require("../models/user_todo");
const contact_1 = require("../models/contact");
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
// Aufgabe zuweisen
router.post('/todoToUser', (request, response) => {
    const ids = request.body;
    const errors = [];
    var currentUserId = '';
    if (request.jwtClaimSet != null) {
        currentUserId = request.jwtClaimSet.userId;
    }
    contact_1.Contact.findOne({ ownerId: currentUserId, contactId: ids.userId }).exec().then((contact) => {
        if (!contact) {
            return Promise.reject('No contact found.');
        }
        else {
            console.log(contact);
            return user_todo_1.User_Todo.findOne({ userId: currentUserId, todoId: ids.todoId }).exec();
        }
    }).then((user_todo) => {
        if (!user_todo) {
            return Promise.reject('User does not own todo.');
        }
        else {
            console.log(user_todo);
            return user_todo_1.User_Todo.findOne({ userId: ids.userId, todoId: ids.todoId }).exec();
        }
    }).then((user_todo) => {
        if (!user_todo) {
            console.log(user_todo);
            return Promise.resolve();
        }
        else {
            return Promise.reject('Todo already exists.');
        }
    }).then(() => {
        const user_todoObject = new user_todo_1.User_Todo({
            userId: ids.userId,
            todoId: ids.todoId
        });
        const user_todo = new user_todo_1.User_Todo(user_todoObject);
        user_todo.save();
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
    }
    todo_1.Todo.update({ "todoId": currentTodoId }, {
        $set: { "todoTitle": todoData.title, "todoText": todoData.text },
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
// Eine Aufgabe löschen
router.delete('/todo/:todoId', (request, response) => {
    const errors = [];
    var currentId = '';
    var currentTodoId = request.params['todoId'];
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
    }
    user_todo_1.User_Todo.findOne({ userId: currentId, todoId: currentTodoId }).exec().then((user_todo) => {
        if (!user_todo) {
            return Promise.reject('No user found.');
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
        response.status(400).json({ message: reason });
    });
});
exports.default = router;
