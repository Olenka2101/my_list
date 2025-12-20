import { useRef } from "react";
function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef("");
  function handleAddTodo(event) {
    event.preventDefault();

    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = "";

    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <input name="title" type="input" id="todoTitle" ref={todoTitleInput} />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
