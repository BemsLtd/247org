import {
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import PropTypes from "prop-types";

export default function InputCom({
  id,
  label,
  type,
  value,
  handleClickShowPassword,
  handleMouseDownPassword,
  endAdornmentIcon,
  error,
  helperText,
  onChange,
  onBlur,
  disabled = false
}) {
  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        endAdornment={
          endAdornmentIcon && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {endAdornmentIcon}
              </IconButton>
            </InputAdornment>
          )
        }
        label={label}
      />
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
}

InputCom.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  endAdornmentIcon: PropTypes.node,
  type: PropTypes.string.isRequired,
  handleClickShowPassword: PropTypes.func,
  handleMouseDownPassword: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  disabled:PropTypes.bool,
};
