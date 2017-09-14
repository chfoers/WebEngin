"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = require("../models/todo");
const user_1 = require("../models/user");
const user_todo_1 = require("../models/user_todo");
//Validationservice
const router = express_1.Router();
// Sign Up
router.post('/todo', (request, response) => {
    const todoData = request.body;
    const errors = [];
    var currentUserId;
    currentUserId = "-1";
    if (request.jwtClaimSet != null) {
        currentUserId = request.jwtClaimSet.userId;
    }
    user_1.User.findOne({ currentUserId }).exec().then((user) => {
        if (!user) {
            return Promise.reject('No user found.');
        }
        else {
            const todo = new todo_1.Todo(todoData);
            const user_todoObject = new user_todo_1.User_Todo({
                userId: currentUserId,
                todoId: todo.todoId
            });
            const user_todo = new user_todo_1.User_Todo(user_todoObject);
            user_todo.save().catch((reason) => {
                response.status(400).json({ message: reason });
            }); //Wir haben es versucht
            return todo.save();
        }
    }).
        then(() => {
        response.sendStatus(201);
    }).catch((reason) => {
        response.status(400).json({ message: reason });
    });
});
exports.default = router;
