export const stringSearch = param => {
  let regexp = new RegExp('\\b(' + param.toLowerCase() + ')\\b', 'gi');
  return regexp;
};
