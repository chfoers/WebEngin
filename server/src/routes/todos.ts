import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import ValidationService from '../services/validationService';
import { Todo, TodoInterface } from '../models/todo';
import { User, UserInterface } from '../models/user';
import { User_Todo, User_TodoInterface, User_TodoSchema } from '../models/user_todo';
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
router.get('/index/todo', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string;
    currentId = '';

    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId;
    }
    var todosList: TodoInterface[] = [];
    var promiseList: Promise<TodoInterface>[] = [];
    User_Todo.find({ userId: currentId }).exec()
    .then((todos: User_TodoInterface[]) => { 
            for (var i = 0; i < todos.length; i++) {
                promiseList.push(new Promise<TodoInterface>((resolve, reject) => {
                        TodoService.getTodoById(todos[i].todoId).then((todo: TodoInterface) => {
                        todosList[i] = todo;
                        resolve; 
                    }).catch(() => {
                        resolve;
                    })
                }));
            }  
    }).then(function () {
        return Promise.all(promiseList);
    }).then(function () {
        console.log(todosList)
        response.json({ data: todosList});
    }).catch((reason: string) => {
        response.status(401).json({message: reason});
    });      
});

export default router;