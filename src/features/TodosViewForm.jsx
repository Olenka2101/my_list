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
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);
  function preventRefresh(e) {
    e.preventDefault();
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      // console.log("send to App:", localQueryString);
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);
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
            onChange={(e) => setSortField(e.target.value)}
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
            onChange={(e) => setSortDirection(e.target.value)}
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
