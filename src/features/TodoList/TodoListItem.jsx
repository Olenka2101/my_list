import { useEffect, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  function handleUpdate(event) {
    if (!isEditing) return;
    event.preventDefault();
    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });
    setIsEditing(false);
  }
  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };
  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
  };

  return (
    <li>
      <form>
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => {
                  onCompleteTodo(todo.id);
                }}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
