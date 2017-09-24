import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import ValidationService from '../services/validationService';
import { Todo, TodoInterface } from '../models/todo';
import { User, UserInterface } from '../models/user';
import { User_Todo, User_TodoInterface } from '../models/user_todo';
import { Contact, ContactInterface } from '../models/contact';
//Validationservice

const router = Router();

interface QueryResultType {
    oneTodo: [{
        todoTitle: string;
        todoText: string;
        todoId: string;
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

// Aufgabe zuweisen
router.post('/todoToUser', (request: Request & JwtClaimSetHolder, response: Response) => {
    const ids = request.body;
    const errors = [];
    var currentUserId: string = '';

    if (request.jwtClaimSet != null){
        currentUserId = request.jwtClaimSet.userId;
    }

    Contact.findOne({ ownerId: currentUserId, contactId: ids.userId }).exec().then((contact: ContactInterface) => {
        if (!contact) {
            return Promise.reject('No contact found.');
        } else {
            return User_Todo.findOne({ userId: currentUserId, todoId: ids.todoId }).exec();
        }
    }).then((user_todo: User_TodoInterface) => {
        if (!user_todo) {
            return Promise.reject('User does not own todo.');
        } else {
            return User_Todo.findOne({ userId: ids.userId, todoId: ids.todoId }).exec();
        }
    }).then((user_todo: User_TodoInterface) => {
        if (!user_todo) {
            return Promise.resolve();
        } else {     
            return Promise.reject('Todo already exists.');
        }
    }).then(() => {
        const user_todoObject = new User_Todo({
            userId: ids.userId,
            todoId: ids.todoId
        });
        const user_todo = new User_Todo(user_todoObject);
        user_todo.save();
        response.sendStatus(201);
    })
    .catch((reason: string) => {
        response.status(400).json({message: reason});
    });
});

// Aufgabe ändern
router.put('/todo/:todoId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';
    const todoData = request.body;
    var currentTodoId = request.params['todoId'];
    
    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId;
    }
    Todo.update(
        { "todoId" : currentTodoId },
        {
          $set: { "todoTitle": todoData.title, "todoText": todoData.text },
        }
    )
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
                        return {                         
                            id: todo.oneTodo[0].todoId,
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
router.get('/todo/:todoId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';
    var currentTodoId = request.params['todoId'];

    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId;
    }   
    User_Todo.aggregate([
        {$unwind: "$todoId"}, 
        {$lookup: {from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo"}}, 
        {$match: {"userId" : currentId, "todoId": currentTodoId}}
    ])
    .exec().then((todos:  QueryResultType[]) => {
                    const foundTodos = todos.map(todo => {                   
                        return {
                            todoId: todo.oneTodo[0].todoId,
                            title: todo.oneTodo[0].todoTitle,
                            text: todo.oneTodo[0].todoText
                        };
                    }); 
                    response.status(200).json({ data: foundTodos[0] }); 
                }).catch((reason: string) => {
                    response.status(400).json({ message: reason });
                }); 
});

// Eine Aufgabe löschen
router.delete('/todo/:todoId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';
    var currentTodoId = request.params['todoId'];

    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId;
    }
    User_Todo.findOne({ userId: currentId, todoId: currentTodoId }).exec().then((user_todo: User_TodoInterface) => {
        if (!user_todo) {
            return Promise.reject('No user found.');
        } else {
            return User_Todo.remove({ todoId: currentTodoId }).exec();
        }
    })
    .then(() => {
        return Todo.remove({todoId: currentTodoId}).exec();
    })
    .then(() => {
        response.status(200).json({ }); 
    })
    .catch((reason: string) => {
        response.status(400).json({ message: reason });
    }); 
});

export default router;