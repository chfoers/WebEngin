import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import ValidationService from '../services/validationService';
import { Todo, TodoInterface } from '../models/todo';
import { User, UserInterface } from '../models/user';
import { User_Todo, User_TodoInterface } from '../models/user_todo';
import { Contact, ContactInterface } from '../models/contact';
import validationService from '../services/validationService';

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
    const errors: string[] = [];
    var currentUserId: string;
    currentUserId = '';

    // Prüfen, ob ein User angemeldet ist
    if (request.jwtClaimSet != null) {
        currentUserId = request.jwtClaimSet.userId;
    }

    // Prüfen, ob alle Felder befüllt sind
    if (!validationService.hasRequiredFields(todoData, ['title', 'text'], errors)) {
        response.status(400).json({ message: errors.join(' & ') });
        return;
    }

    // Suchen des Users anhand der Id
    User.findOne({ userId: currentUserId }).exec().then((user: UserInterface) => {
        if (!user) {
            return Promise.reject('Kein User eingeloggt');
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
            // Abspeichern vom Todo und der Verbindung zum User
            return Promise.all([user_todo.save(), todo.save()]);
        }
    })
        .then(() => {
            response.sendStatus(201);
        })
        .catch((reason: string) => {
            response.status(400).json({ message: reason });
        });
});

// Aufgabe ändern
router.put('/todo/:todoId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors: string[] = [];
    var currentId: string = '';
    const todoData = request.body;
    var currentTodoId = request.params['todoId'];

    // Prüfen, ob alle Felder befüllt sind
    if (!validationService.hasRequiredFields(todoData, ['title', 'text'], errors)) {
        response.status(400).json({ message: errors.join(' & ') });
        return;
    }

    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;

        // Updaten des Todos
        Todo.update(
            { "todoId": currentTodoId },
            {
                $set: { "todoTitle": todoData.title, "todoText": todoData.text },
            }
        )
            .then(() => {
                response.sendStatus(201);
            })
            .catch((reason: string) => {
                response.status(400).json({ message: "Todo existiert nicht" });
            });
    } else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }
});

// Alle Aufgaben eines Users anzeigen
router.get('/index/todo', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';

    // Prüfen, ob User angemeldet ist
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;

        // Suchen der Todos
        User_Todo.aggregate([
            { $unwind: "$todoId" },
            { $lookup: { from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo" } },
            { $match: { "userId": currentId } }
        ])
            .exec().then((todos: QueryResultType[]) => {
                const foundTodos = todos.map(todo => {
                    return {
                        id: todo.oneTodo[0].todoId,
                        title: todo.oneTodo[0].todoTitle,
                        text: todo.oneTodo[0].todoText
                    };
                });
                response.status(200).json({ data: foundTodos });
            }).catch((reason: string) => {
                response.status(400).json({ message: 'Todo existiert nicht' });
            });
    } else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }
});

// Eine Aufgabe eines Users anzeigen
router.get('/todo/:todoId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';
    var currentTodoId = request.params['todoId'];

    // Prüfen, ob User angemeldet ist
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;

        // Suchen des Todos anhand der Id
        User_Todo.aggregate([
            { $unwind: "$todoId" },
            { $lookup: { from: "todos", localField: "todoId", foreignField: "todoId", as: "oneTodo" } },
            { $match: { "userId": currentId, "todoId": currentTodoId } }
        ])
            .exec().then((todos: QueryResultType[]) => {
                const foundTodos = todos.map(todo => {
                    return {
                        todoId: todo.oneTodo[0].todoId,
                        title: todo.oneTodo[0].todoTitle,
                        text: todo.oneTodo[0].todoText
                    };
                });
                response.status(200).json({ data: foundTodos[0] });
            }).catch((reason: string) => {
                response.status(400).json({ message: 'Fehler beim Laden der Todos' });
            });
    } else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }

});

// Eine Aufgabe löschen
router.delete('/todo/:todoId', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';
    var currentTodoId = request.params['todoId'];

    // Prüfen, ob User eingeloggt ist
    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId;
        User_Todo.findOne({ userId: currentId, todoId: currentTodoId }).exec().then((user_todo: User_TodoInterface) => {
            if (!user_todo) {
                return Promise.reject('Kein User eingeloggt');
            } else {
                return User_Todo.remove({ todoId: currentTodoId }).exec();
            }
        })
            .then(() => {
                // Löschen des Todos
                return Todo.remove({ todoId: currentTodoId }).exec();
            })
            .then(() => {
                response.status(200).json({});
            })
            .catch((reason: string) => {
                response.status(400).json({ message: 'Todo existiert nicht' });
            });
    } else {
        response.status(400).json({ message: "Kein User eingeloggt" });
    }
});

export default router;