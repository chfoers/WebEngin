import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import ValidationService from '../services/validationService';
import { Todo, TodoInterface } from '../models/todo';
import { User, UserInterface } from '../models/user';
import { User_Todo, User_TodoInterface } from '../models/user_todo';
//Validationservice

const router = Router();

interface QueryResultType {
    _id: string;
    todoId: string;
    userId: string;
    __v: string;
    oneTodo: [{
        _id: string;
        todoTitle: string;
        todoText: string;
        todoId: string;
        __v: string;
    }]
}

// Aufgabe anlegen
router.post('/todo', (request: Request & JwtClaimSetHolder, response: Response) => {
    const todoData = request.body;
    const errors = [];
    var currentEmail: string;
    currentEmail = '';

    if (request.jwtClaimSet != null){
        currentEmail = request.jwtClaimSet.email;
    }

    User.findOne({ email: currentEmail }).exec().then((user: UserInterface) => {
        if (!user) {
            return Promise.reject('No user found.');
        } else {
            const todo = new Todo({
                todoTitle: todoData.title,
                todoText: todoData.text
            });
            const user_todoObject = new User_Todo({
                userId: user.userId,
                todoId: todo.todoId
            });
            const user_todo = new User_Todo(user_todoObject);
            user_todo.save().catch((reason: string) => {
                response.status(400).json({message: reason});
            }); 
            return todo.save();
        }
    })
    .then(() => {
        response.sendStatus(201);
    })
    .catch((reason: string) => {
        response.status(400).json({message: reason});
    });
});

// Alle Aufgaben eines Users anzeigen
router.get('/index/todo', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';

    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId;
    }   
    User_Todo.aggregate([
        {$unwind: "$todoId"}, 
        {$lookup: {from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo"}}, 
        {$match: {"userId" : currentId}}
    ])
    .exec().then((todos:  QueryResultType[]) => {
                    const foundTodos = todos.map(todo => { 
                        console.log(todo.oneTodo[0]);                  
                        return {                         
                            todoId: todo.todoId,
                            title: todo.oneTodo[0].todoTitle,
                            text: todo.oneTodo[0].todoText
                        };
                    });
                    response.status(200).json({ data: foundTodos }); 
                }).catch((reason: string) => {
                    response.status(400).json({ message: reason });
                }); 
});

// Eine Aufgabe eines Users anzeigen
router.get('/index/todo', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';

    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId;
    }   
    User_Todo.aggregate([
        {$unwind: "$todoId"}, 
        {$lookup: {from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo"}}, 
        {$match: {"userId" : currentId, "todoId": request.body}}
    ])
    .exec().then((todos:  QueryResultType[]) => {
                    const foundTodos = todos.map(todo => {                   
                        return {
                            todoId: todo.todoId,
                            title: todo.oneTodo[0].todoTitle,
                            text: todo.oneTodo[0].todoText
                        };
                    }); 
                    response.status(200).json({ data: foundTodos[0] }); 
                }).catch((reason: string) => {
                    response.status(400).json({ message: reason });
                }); 
});

export default router;