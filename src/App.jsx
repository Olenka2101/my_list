import { useState } from "react";
import "./App.css";
import TodoForm from "./features/TodoList/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);
  function addTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  }
  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}
export default App;
