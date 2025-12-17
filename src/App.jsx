import { useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);
  function addTodo(title) {
    const newTodo = { title, id: Date.now() };
    setTodoList([...todoList, newTodo]);
  }
  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}
export default App;
