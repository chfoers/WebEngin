import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import ValidationService from '../services/validationService';
import { Todo, TodoInterface } from '../models/todo';
import { User, UserInterface } from '../models/user';
import { User_Todo, User_TodoInterface, User_TodoSchema } from '../models/user_todo';
//Validationservice

const router = Router();

// Sign Up
router.post('/todo', (request: Request & JwtClaimSetHolder, response: Response) => {
    const todoData = request.body;
    const errors = [];
    var currentUserId: string;
    currentUserId = "-1";

    if (request.jwtClaimSet != null){
        currentUserId = request.jwtClaimSet.userId;
    }

    User.findOne({ currentUserId }).exec().then((user: UserInterface) => {
        if (!user) {
            return Promise.reject('No user found.');
        } else {
            const todo = new Todo(todoData);
            const user_todoObject = new User_Todo({
                userId: currentUserId,
                todoId: todo.todoId
            });
            const user_todo = new User_Todo(user_todoObject);
            user_todo.save().catch((reason: string) => {
                response.status(400).json({message: reason});
            }); //Wir haben es versucht
            return todo.save();
        }
    }).
    then(() => {
        response.sendStatus(201);
    }).catch((reason: string) => {
        response.status(400).json({message: reason});
    });
});
export default router;