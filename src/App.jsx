import { useState, useEffect, useCallback, useReducer } from "react";
import "./App.css";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

import TodosPage from "./pages/TodosPage";
import Header from "./shared/Header/Header";

import { Routes, Route, useLocation } from "react-router-dom";

import About from "./pages/About";
import NotFound from "./pages/NotFound";

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

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  // Title

  const [title, setTitle] = useState("Todo List");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setTitle("Todo List");
    } else if (location.pathname === "/about") {
      setTitle("About");
    } else {
      setTitle("Not Found");
    }
  }, [location.pathname]);

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

  // AddTodo

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
    <>
      <Header title={title} />
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoList={todoList}
              isLoading={isLoading}
              errorMessage={errorMessage}
              isSaving={isSaving}
              addTodo={addTodo}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              sortField={sortField}
              sortDirection={sortDirection}
              queryString={queryString}
              dispatch={dispatch}
              todoActions={todoActions}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
