import { FormControl, FormHelperText, TextField } from "@mui/material";
import PropTypes from "prop-types";

export default function Textarea({
  id,
  label,
  value,
  error,
  helperText,
  onChange,
  onBlur,
  disabled = false,
  rows = 4, // default number of rows
}) {
  return (
    <FormControl fullWidth error={!!error}>
      <TextField
        id={id}
        label={label}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        multiline
        rows={rows}
        variant="outlined"
        error={!!error} // Adds the red border if error exists
        helperText={error ? helperText : ""}
      />
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
}

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  rows: PropTypes.number, // Optional prop for specifying the number of rows
};
