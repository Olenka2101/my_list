import { useState, useEffect } from "react";
import styled from "styled-components";
const StyledButton = styled.button`
  padding: 0.5em;
`;

const StyledInput = styled.input`
  padding: 0.5em;
`;

function TodosViewForm({
  sortField,
  sortFieldChange,
  // setSortField,
  sortDirection,
  sortDirectionChange,
  // setSortDirection,
  queryString,
  queryStringChange,
  // setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);
  function preventRefresh(e) {
    e.preventDefault();
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      queryStringChange(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, queryStringChange]);
  useEffect(() => {
    setLocalQueryString(queryString);
  }, [queryString]);

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>
          Search todos:
          <StyledInput
            type="text"
            value={localQueryString}
            onChange={(e) => setLocalQueryString(e.target.value)}
          />
          <StyledButton type="button" onClick={() => setLocalQueryString("")}>
            Clear
          </StyledButton>
        </label>
      </div>

      <div>
        <label>
          Sort by
          <select
            name="sortField"
            value={sortField}
            onChange={(e) => sortFieldChange(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
        </label>

        <label>
          Direction
          <select
            name="sortDirection"
            value={sortDirection}
            onChange={(e) => sortDirectionChange(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </form>
  );
}
export default TodosViewForm;
