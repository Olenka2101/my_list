import styled from "styled-components";

const StyledInput = styled.input`
  padding: 0.5em;
`;
const StyledLabel = styled.label`
  padding: 0.5em;
`;

function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
export default TextInputWithLabel;
