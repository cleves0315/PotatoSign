/**
 * 
 * @param {string} json 
 * @returns object | array
 */
export function JSONToParse(json) {
  return (typeof json === 'string') ? JSON.parse(json) : json
}
