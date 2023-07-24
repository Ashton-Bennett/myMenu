const removePreparationsFromIngredientName = (ingredient: string) => {
  const preparationsToRemove =
    /\s*\((boiled|baked|grilled|fried|steamed|sauteed|poached|braised|broiled|cured|marinated|fermented|chilled|sliced|diced|minced|grated|shredded|chopped|cubed|mashed|pureed|whipped|stirred|glazed|breaded|stuffed|seasoned|sprinkled|served|drizzled|garnished|toasted|infused|caramelized|brothed|scrambled|reduced|griddled|charred|braided|sear|blanched|braised|braided|brined|broasted|browned|curdled|deglazed|emulsified|filleted|glazed|infused|jellied|parboiled|pan-fried|parched|pounded|shucked|simmered|soused|tempered|tenderized|truffled|vinegared|wilted|zested)\)/g;
  return ingredient.replace(preparationsToRemove, "").trim();
};

export default removePreparationsFromIngredientName;
