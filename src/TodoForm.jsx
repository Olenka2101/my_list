import { useState, useRef } from "react";
function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");
  function handleAddTodo(event) {
    event.preventDefault();

    // const title = event.target.title.value;
    // event.target.title.value = "";
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");

    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <input
        name="title"
        type="input"
        id="todoTitle"
        value={workingTodoTitle}
        ref={todoTitleInput}
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
        }}
      />
      <button type="submit" disabled={workingTodoTitle === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
