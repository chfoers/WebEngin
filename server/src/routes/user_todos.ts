import { Router, Request, Response, NextFunction } from 'express';
import { AuthorisationService, JwtClaimSetHolder } from '../services/authorisationService';
import { User_Todo, User_TodoInterface } from '../models/user_todo';

const router = Router();

interface QueryResultType {
    oneTodo: [{
        todoTitle: string;
        todoText: string;
        todoId: string;
    }]
}

// Aufgabe ändern
router.put('/update', (request: Request & JwtClaimSetHolder, response: Response) => {
    const errors = [];
    var currentId: string = '';
    const data = request.body;

    
    if (request.jwtClaimSet != null){
        currentId = request.jwtClaimSet.userId

        User_Todo.update(
            { "userId" : currentId, "todoId" :  data.todoId},
            {
                $set: { "userId": data.userId, "todoId": data.todoId },
            }
        )
        .then(() => {
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

        })
        .catch((reason: string) => {
            response.status(400).json({message: reason});
        });
    }
    
});


export default router;