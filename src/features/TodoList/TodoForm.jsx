import { useState, useRef } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styled from "styled-components";
const StyledForm = styled.form`
  font-weight: bold;
`;

const StyledButton = styled.button`
  cursor: pointer;
  &:disabled {
    font-style: italic;
    cursor: not-allowed;
    backgroung: #aaa;
  }
`;

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
    <StyledForm onSubmit={handleAddTodo}>
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
      <StyledButton type="submit" disabled={workingTodoTitle.trim() === ""}>
        {isSaving ? "Saving..." : "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
