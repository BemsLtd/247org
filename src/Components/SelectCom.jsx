import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";

export default function SelectCom({
  id,
  name,
  value,
  label,
  onChange,
  onBlur,
  options,
  error,
  helperText,
}) {
  return (
    <FormControl fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        name={name} 
        value={value}
        label={label}
        onChange={onChange}
        onBlur={onBlur}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map(({ value, text }, i) => (
          <MenuItem key={i} value={value}>
            {text}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
}

SelectCom.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};
