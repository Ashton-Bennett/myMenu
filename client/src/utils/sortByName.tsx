export const sortByName = (a: { name?: string }, b: { name?: string }) => {
  const nameA = a.name ? a.name.toLowerCase() : "";
  const nameB = b.name ? b.name.toLowerCase() : "";

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};
