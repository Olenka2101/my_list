import { useState, useRef } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
    todoTitleInput.current.value = "";
    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        name="title"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => {
          event.preventDefault();
          setWorkingTodoTitle(event.target.value);
        }}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ""}>
        {isSaving ? "Saving..." : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;
