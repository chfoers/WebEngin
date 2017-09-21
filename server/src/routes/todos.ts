import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import ValidationService from '../services/validationService';
import { Todo, TodoInterface } from '../models/todo';
import { User, UserInterface } from '../models/user';
import { User_Todo, User_TodoInterface } from '../models/user_todo';
import { TodoService } from '../services/todoService'
//Validationservice

const router = Router();

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
router.get('/index/todo', (request: Request & JwtClaimSetHolder, response: Response) => { //User flexibel einbauen + Fehlerbehebung zu viele Results + Anzeige Text Frontend
    const errors = [];
    var currentId: string;
    currentId = '';

    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId;
    }
    interface QueryResultType {
        _id: string;
        todoId: string;
        userId: string;
        __v: string;
        oneTodo: [{
            _id: string;
            todoTitle: string;
            todoData: string;
            todoId: string;
            __v: string;
        }]
    }
    User_Todo.aggregate([
        {$unwind: "$todoId"}, 
        {$lookup: {from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo"}}, 
        {$match: {"userId" : "1976eebb-6f10-421a-8b6a-02f24ddd93ec"}}
    ])
    .exec().then((todos:  QueryResultType[]) => {
                    console.log(todos);
                    const foundTodos = todos.map(todo => {                   
                        if (todo.oneTodo[0] != null){
                            return {
                                //todoId: todo.todoId,
                                title: todo.oneTodo[0].todoTitle,
                                text: todo.oneTodo[0].todoData
                            };
                        }
                        return {
                            title: "{}",
                            text: "{}"
                        }
                    }); 
                    //console.log(foundTodos);  
                    response.status(200).json({ data: foundTodos }); 
                }).catch((reason: string) => {
                    response.status(400).json({ message: reason });
                }); 
});
//db.user_todos.aggregate([{$lookup: {from: "todo", localField: "todoId", foreignField: "todoId", as: "a"}}, {$match: {"userId" : "1976eebb-6f10-421a-8b6a-02f24ddd93ec"}}])


export default router;