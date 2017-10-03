"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_todo_1 = require("../models/user_todo");
const router = express_1.Router();
/*
 * Change the owner(userId) of a Todo
 *
 * Get: Todo.id and the Id of the new owner
 * Return: A list of Todos from the current User
 */
router.put('/update', (request, response) => {
    const errors = [];
    var currentId = '';
    const data = request.body;
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
        // Change the userId of a Todo
        user_todo_1.User_Todo.update({ "userId": currentId, "todoId": data.todoId }, {
            $set: { "userId": data.userId, "todoId": data.todoId },
        })
            .then(() => {
            user_todo_1.User_Todo.aggregate([
                { $unwind: "$todoId" },
                { $lookup: { from: "todos", localField: "todoId", foreignField: "todoId", as: "todo" } },
                { $match: { "userId": currentId } }
            ]).exec()
                .then((todos) => {
                const foundTodos = todos.map(todo => {
                    return {
                        id: todo.todo[0].todoId,
                        title: todo.todo[0].todoTitle,
                        text: todo.todo[0].todoText
                    };
                });
                response.status(200).json({ data: foundTodos });
            })
                .catch((reason) => {
                response.status(400).json({ message: 'Das Todo konnte dem User nicht zugeordnet werden' });
            });
        })
            .catch((reason) => {
            response.status(400).json({ message: 'Kein User eingeloggt' });
        });
    }
});
exports.default = router;
