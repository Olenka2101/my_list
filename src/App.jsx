import { useState, useEffect, useCallback, useReducer } from "react";
import "./App.css";
import TodoForm from "./features/TodoList/TodoForm.jsx";
import TodoList from "./features/TodoList.jsx";
import TodosViewForm from "./features/TodosViewForm.jsx";
import styles from "./App.module.css";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const {
    todoList,
    isLoading,
    errorMessage,
    isSaving,
    sortField,
    sortDirection,
    queryString,
  } = todoState;
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [isSaving, setIsSaving] = useState(false);
  // const [sortField, setSortField] = useState("createdTime");
  // const [sortDirection, setSortDirection] = useState("desc");
  // const [queryString, setQueryString] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",{title})`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString, url]);
  useEffect(() => {
    const fetchTodos = async () => {
      // setIsLoading(true);
      dispatch({ type: todoActions.fetchTodos });
      const options = {
        method: "GET",
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        const data = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: data.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);
  //       const todos = data.records.map((record) => {
  //         const todo = {
  //           id: record.id,
  //           ...record.fields,
  //         };
  //         if (!todo.isCompleted) {
  //           todo.isCompleted = false;
  //         }
  //         return todo;
  //       });
  //       setTodoList(todos);
  //       setErrorMessage("");
  //     } catch (error) {
  //       setErrorMessage(`Error: ${error.message}.. Reverting todo...`);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchTodos();
  // }, [encodeUrl]);

  // AddTodo!!!!!!!!!!!!!

  const addTodo = async (title) => {
    const newTodo = {
      title: title,
      isCompleted: false,
    };
    const payload = {
      records: [
        {
          fields: newTodo,
        },
      ],
    };
    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      // setIsSaving(true);
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      const { records } = await resp.json();

      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // complete todo
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) return;
    const completedTodo = { ...originalTodo, isCompleted: true };

    //update UI
    dispatch({ type: todoActions.updateTodo, editedTodo: completedTodo });

    //  prepare the payload for the Airtable
    const payload = {
      records: [
        {
          id: completedTodo.id,
          fields: {
            title: completedTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }
      await resp.json();
      dispatch({ type: todoActions.endRequest });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo });
    }
  };

  // updateTodo
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({ type: todoActions.updateTodo, editedTodo });

    //  prepare the payload for the Airtable
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error(resp.status);
      }
      await resp.json();
      dispatch({ type: todoActions.endRequest });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo });
    }
  };

  return (
    <div className={styles.appContainer}>
      <header>
        <h1>Todo List</h1>
      </header>

      {isLoading && <p>loading...</p>}
      {isSaving && <p>Saving...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        onCompleteTodo={completeTodo}
        todos={todoList}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
        isSaving={isSaving}
      />

      <hr />
      <TodosViewForm
        sortField={sortField}
        sortFieldChange={(field) =>
          dispatch({ type: todoActions.setSortField, sortField: field })
        }
        sortDirection={sortDirection}
        sortDirectionChange={(dir) =>
          dispatch({ type: todoActions.setSortDirection, sortDirection: dir })
        }
        queryString={queryString}
        queryStringChange={(query) =>
          dispatch({ type: todoActions.setQueryString, queryString: query })
        }
      />

      {/* display error */}
      {errorMessage && (
        <div className={styles.errorMessage}>
          <hr />

          <p>{errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss Error Message
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
