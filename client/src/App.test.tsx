import React from "react";
import { render, screen } from "@testing-library/react";
import RecipeForm from "./pages/RecipeForm";
import { Recipe } from "./types";
import userEvent from "@testing-library/user-event";

test("Renders Add Recipe form", () => {
  render(
    <RecipeForm
      recipes={[]}
      setRecipes={function (value: React.SetStateAction<Recipe[]>): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
  const linkElement = screen.getByText(/add recipe/i);
  expect(linkElement).toBeInTheDocument();
});

test("clicking the + ingredient button creates a new input field", async () => {
  render(
    <RecipeForm
      recipes={[]}
      setRecipes={function (value: React.SetStateAction<Recipe[]>): void {
        throw new Error("Function not implemented.");
      }}
    />
  );

  const user = userEvent.setup();
  const button = screen.getByRole("button", {
    name: /\+ ingredient/i,
  });
  await user.click(button);
  const newInputField = screen.getAllByTestId("ingredient1");
  expect(newInputField).toBeDefined();
});

test("clicking the + direction button creates a new input field", async () => {
  render(
    <RecipeForm
      recipes={[]}
      setRecipes={function (value: React.SetStateAction<Recipe[]>): void {
        throw new Error("Function not implemented.");
      }}
    />
  );

  const user = userEvent.setup();
  const button = screen.getByRole("button", {
    name: /\+ direction/i,
  });
  await user.click(button);
  const newInputField = screen.getAllByTestId("direction1");
  expect(newInputField).toBeDefined();
});

test("clicking the move up button, moves input && clicking the move down button moves input down", async () => {
  render(
    <RecipeForm
      recipes={[]}
      setRecipes={function (value: React.SetStateAction<Recipe[]>): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
  const user = userEvent.setup();
  const directionButton = screen.getByRole("button", {
    name: /\+ direction/i,
  });
  await user.click(directionButton);
  await user.type(screen.getByLabelText("D2"), "Preheat Oven");
  const button = screen.getByTestId("direction1ButtonUp");
  await user.click(button);
  const newInputFieldValue = screen.getByRole("textbox", { name: /d1/i });
  expect(newInputFieldValue).toHaveValue("Preheat Oven");
});

test("clicking the move down button moves input down", async () => {
  render(
    <RecipeForm
      recipes={[]}
      setRecipes={function (value: React.SetStateAction<Recipe[]>): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
  const user = userEvent.setup();
  const directionButton = screen.getByRole("button", {
    name: /\+ direction/i,
  });
  await user.click(directionButton);
  await user.type(screen.getByLabelText("D1"), "Stir flour and eggs...");
  const button = screen.getByTestId("direction0ButtonDown");
  await user.click(button);
  const newInputFieldValue = screen.getByRole("textbox", { name: /d2/i });
  expect(newInputFieldValue).toHaveValue("Stir flour and eggs...");
});

test("Recipe form completion", async () => {
  render(
    <RecipeForm
      recipes={[]}
      setRecipes={function (value: React.SetStateAction<Recipe[]>): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
  const user = userEvent.setup();
  const recipeNameInput = screen.getByRole("textbox", {
    name: /name of recipe/i,
  });
  await user.type(recipeNameInput, "Brownies");
  expect(recipeNameInput).toHaveValue("Brownies");

  const servingsInput = screen.getByRole("spinbutton", { name: /serves/i });
  await user.type(servingsInput, "24");

  const ingredientInput = screen.getByRole("textbox", { name: /i1/i });
  await user.type(ingredientInput, "flour 400 grams");

  const prepTimeInput = screen.getByRole("spinbutton", {
    name: /prep time\(mins\)/i,
  });
  await user.type(prepTimeInput, "75");

  const categoryInput = screen.getByText(/cocktail/i);
  await user.click(categoryInput);

  const regionInput = screen.getByText(/europe/i);
  await user.click(regionInput);

  const countryInput = screen.getByRole("textbox", { name: /country/i });
  await user.type(countryInput, "France");

  const storyInput = screen.getByRole("textbox", { name: /story/i });
  await user.type(storyInput, "Grandma's famous Recipe");

  const saveButton = screen.getByRole("button", { name: /save/i });
  await user.click(saveButton);

  // expect()
});
