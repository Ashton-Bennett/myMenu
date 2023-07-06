const toggleStrikeThrough = (id: string) => {
  const menuItemToStrikeThrough = document.getElementById(id);
  if (menuItemToStrikeThrough) {
    const currentTextDecoration = menuItemToStrikeThrough.style.textDecoration;
    if (currentTextDecoration === "line-through") {
      menuItemToStrikeThrough.style.textDecoration = "none";
    } else {
      menuItemToStrikeThrough.style.textDecoration = "line-through";
    }
  }
};

export default toggleStrikeThrough;
