export default function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <>
      <li>
        <form>
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={() => {
              onCompleteTodo(todo.id);
            }}
          />
          {todo.title}
        </form>
      </li>
    </>
  );
}
