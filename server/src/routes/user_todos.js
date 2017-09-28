"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_todo_1 = require("../models/user_todo");
const router = express_1.Router();
// Aufgabe ändern
router.put('/update', (request, response) => {
    const errors = [];
    var currentId = '';
    const data = request.body;
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
        user_todo_1.User_Todo.update({ "userId": currentId, "todoId": data.todoId }, {
            $set: { "userId": data.userId, "todoId": data.todoId },
        })
            .then(() => {
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
        })
            .catch((reason) => {
            response.status(400).json({ message: reason });
        });
    }
});
exports.default = router;
