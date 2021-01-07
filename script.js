const $ = (id) => document.getElementById(id);
const results = $("results");
const input = $("input");

input.addEventListener("keyup", (e) => {
if (e.key === "Enter") {
    e.preventDefault();
    query();
    }
});

class Drink {
    constructor(name, ingredients, amounts, glass, instructions, image) {
        this.name = name; // String
        this.ingredients = ingredients; // Array of strings
        this.amounts = amounts; // Array of Strings
        this.glass = glass // String
        this.instructions = instructions // String
        this.image = image; // String
    }
    

}
function getJSON(drinkName) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`,
    {
        "method": "GET"
    })
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        handle(data);
    })
    
}

/* Receives a JSON object containing data retrieved
* from user's requested drink. Function parses the object for
* the drink's ingredients, their amount, and instructions for the drink
* as well as an image. Calls the appropriate method to show data to user.
*/
function handle(drinks) {
    console.log(drinks);
    let name = drinks["drinks"][0]["strDrink"];
    let glass = drinks["drinks"][0]["strGlass"];
    let instructions = drinks["drinks"][0]["strInstructions"];
    let image = drinks["drinks"][0]["strDrinkThumb"];
    let ingredients = [];
    for (let i = 1; i <= 15; i++) {
        if (drinks["drinks"][0][`strIngredient${i}`] != null) {
            ingredients.push(drinks["drinks"][0][`strIngredient${i}`]);
        } else i = 16;
    }
    
    let ingredientMeasurements = [];
    for (let j = 1; j <= ingredients.length; j++) {
        ingredientMeasurements.push(drinks["drinks"][0][`strMeasure${j}`]);
    }
    const drinkRequested = new Drink(name, ingredients, ingredientMeasurements, glass, instructions, image);
    showDrinks(drinkRequested);
}

function query() {
    let name = input.value;
    getJSON(name);
}

function showDrinks(drink) {
    results.innerHTML = "";
    const cre = (el) => document.createElement(el);
    const div = cre("div");
    console.log(div);
    const name = cre("h1");
    const ingredients = cre("p");
    const glass = cre("p");
    const measurements = cre("p");
    const instructions = cre("p");
    const image = cre("img");
    console.log(drink);
    name.innerText = drink.name;
    ingredients.innerText = drink.ingredients.join(', ');
    measurements.innerText = drink.amounts.join(', ');
    instructions.innerText = drink.instructions;
    glass.innerText = drink.glass;
    image.src = drink.image;

    div.append(name, image, ingredients, measurements, instructions, glass);
    div.className += "drinkContainer";

    results.append(div);

}