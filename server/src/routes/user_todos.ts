import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import { User_Todo, User_TodoInterface } from '../models/user_todo';

const router = Router();

interface QueryResultType {
    todo: [{
        todoTitle: string;
        todoText: string;
        todoId: string;
    }]
}

/* 
 * Change the owner(userId) of a Todo
 * 
 * Get: Todo.id and the Id of the new owner
 * Return: A list of Todos from the current User
 */
router.put('/update', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';
    const data = request.body;


    if (request.jwtClaimSet != null) {
        currentId = request.jwtClaimSet.userId

        // Change the userId of a Todo
        User_Todo.update(
            { "userId": currentId, "todoId": data.todoId },
            {
                $set: { "userId": data.userId, "todoId": data.todoId },
            }
        )
        // Combine the Tables "User_todo" and "Todo" and find all from current User
        .then(() => {
            User_Todo.aggregate([
                {$unwind: "$todoId"}, 
                {$lookup: {from: "todos", localField: "todoId", foreignField: "todoId", as: "todo"}}, 
                {$match: {"userId" : currentId}}
            ]).exec()
            .then((todos:  QueryResultType[]) => {
                const foundTodos = todos.map(todo => {                 
                    return {                         
                        id: todo.todo[0].todoId,
                        title: todo.todo[0].todoTitle,
                        text: todo.todo[0].todoText
                        };
                    });
                    response.status(200).json({ data: foundTodos }); 
            })
            .catch((reason: string) => {
                response.status(400).json({ message: 'Das Todo konnte dem User nicht zugeordnet werden' });
            }); 
        })
        .catch((reason: string) => {
            response.status(400).json({message:'Kein User eingeloggt' });
        });
    }

});


export default router;