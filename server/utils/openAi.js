const OpenAI = require("openai");
const config = require("./config");

const apiKey = config.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: apiKey });
const recipeFormatter = async (recipeString) => {
  const prompt = `You are a recipe formatter. Take the recipe string and convert it into a recipe JSON object with the following format:
  recipe {
    name: string;
    servings: number;
    ingredients: { amount: number; name: string; unitOfMeasure: 'pinch(s)'|'teaspoon(s)'|'Tablespoon(s)'|'Cup(s)'|'pint(s)'|'milliliters'|'quart(s)'|'gallon(s)'|'Pound(s)'|'Kg(s)'|'to taste'|'each'|'to garnish'|''}[];
    cookTime: number; // in minutes
    prepTime: number; // in minutes
    directions: string[];
    category: 'Dinner' | 'Cocktail' | 'Other' |;
    region: 'North America' | 'Central America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | '';
    country: string;
    story: string;
    drinkPairings: string;
    notes: string;
  }
  
  // Example Output:      
  {
    name: 'Mole Verde',
    servings: 6,
    ingredients: [
      { amount: 2, name: 'pork country style rib', unitOfMeasure: 'Pound(s)' },
      { amount: 1, name: 'bay leaf', unitOfMeasure: 'each'},
      { amount: 6, name: 'tomatillo', unitOfMeasure: 'each'},
      { amount: 0.5, name: 'pumpkin seed', unitOfMeasure: 'Cup(s)'}
      // ... (other ingredients)(ensure that the name values are singular.)
    ],
    cookTime: 40,
    prepTime: 15,
    directions: [
      // ... (directions)
    ],
    category: 'Dinner',
    region: 'central american',
    country: 'Mexico',
    story: '',
    drinkPairings: 'undefined',
    notes: 'If you donʼt find the fresh Hierba Santa, you can use the dried version of the Latin Stores. However, you can make this recipe without the Hierba Santa and still have a memorable Mole Verde. You can also roast the tomatillos, peppers and garlic, this will render a rustic flavor.  You can also add chayotes, green beans, and nopales to this stew.'
  }
  
  The output should match the structure provided in the example recipe object. Don't return code or the example.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `${prompt}` },
        {
          role: "user",
          content: `Here is the recipe string that you need to reformat: ${recipeString}`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    console.log("AI response:", completion.choices);
    return completion.choices;
  } catch (error) {
    console.error("Error during API call:", error);
    return error;
  }
};

module.exports = recipeFormatter;
