// Capitalize first letter of a string
export const capitalize = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  
  // Convert string to kebab-case
  export const toKebabCase = (str: string): string => 
    str.replaceAll(/\s+/g, "-").toLowerCase();
  
  // Convert string to snake_case
  export const toSnakeCase = (str: string): string => 
    str.replaceAll(/\s+/g, "_").toLowerCase();
  
  // Truncate string with ellipsis
  export const truncate = (str: string, length: number): string => 
    str.length > length ? str.slice(0, Math.max(0, length)) + "..." : str;

  export const removeWhitespaceAndSymbols = (str: string): string => {
    return str.replaceAll(/[^\dA-Za-z]/g, '');
  };
  
  
  