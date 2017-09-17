import { Todo, TodoInterface } from '../models/todo';

var foundTodo: TodoInterface;

export const TodoService = {

    getTodoById: (id: string): Promise<TodoInterface> => {
        return new Promise<TodoInterface>((resolve, reject) => {Todo.findOne({ todoId: id }).exec()
            .then((todo: TodoInterface) => {
                if(!todo) {
                    reject('No todo was found.');
                } else {
                    resolve(todo);
                }
            });
        })
    }
}
