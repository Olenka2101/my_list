import "./App.css";
import { useState } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";

function App() {
  const [newTodo, setNewTodo] = useState("Example text");
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      {newTodo}
      <TodoList />
    </div>
  );
}
export default App;
