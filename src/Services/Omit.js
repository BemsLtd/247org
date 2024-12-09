const isEmptyValue = (value) => {
  return (
    value === null || // Check for null
    value === undefined || // Check for undefined
    value === "" || // Check for empty strings
    (typeof value === "object" &&
      value !== null &&
      Object.keys(value).length === 0 &&
      value.constructor === Object) // Check for empty objects
  );
};

export default function Omit(values) {
  if (!values || typeof values !== "object") {
    throw new Error("Input must be an object");
  }

  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => !isEmptyValue(value))
  );
}
