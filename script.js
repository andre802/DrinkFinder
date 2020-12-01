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
    
    ingredientsWithAmounts() {
        let ingWithAm = [];
        for (let i = 0; i < this.ingredients.length; i++) {
            let ing = this.ingredients[i];
                let val = this.amounts[i];
                if (val !== null) {
                    ingWithAm.push(val + " " + ing);
                }
            else {
                ingWithAm.push(ing);
            }
        }
        return ingWithAm.join(", ");
    }

}
function getDrinkJSON(drinkName) {
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
    getDrinkJSON(name);
}

function showDrinks(drink) {
    results.innerHTML = "";
    const cre = (el) => document.createElement(el);
    const div = cre("div");
    const name = cre("h1");
    const ingredients = cre("p");
    const glass = cre("p");
    const instructions = cre("p");
    const image = cre("img");
    name.innerText = drink.name;
    ingredients.innerText = drink.ingredientsWithAmounts();
    instructions.innerText = drink.instructions;
    glass.innerText = drink.glass;
    image.src = drink.image;

    div.append(name, image, ingredients, instructions, glass);
    div.className += "drinkContainer";

    results.append(div);

}

function getCategoryDrinks(category) {
     fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`,
    {
        "method": "GET"
    })
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        handleCat(data);
    })
    
}
function selectCategory() {
    let select = $("category");
    getCategoryDrinks(select.value);
}
function handleCat(drinks) {
    results.innerHTML = "";
    for (let i = 0; i < drinks["drinks"].length; i++) {
    let name = drinks["drinks"][i]["strDrink"];
    let image = drinks["drinks"][i]["strDrinkThumb"];
    let drinkRequested = new Drink(name, [], [], "", "", image);
    showDrinksFromCat(drinkRequested);
    }
}
function showDrinksFromCat(drink) {
    
    const cre = (el) => document.createElement(el);
    const div = cre("div");
    const name = cre("h1");
    const image = cre("img");
    name.innerText = drink.name;
    image.src = drink.image;
    div.addEventListener("click", () => {
        selectDrinkFromImage(drink.name);
    });
    div.append(name, image);
    div.className += "drinkContainer";

    results.append(div);

}
function selectDrinkFromImage(drinkName) {
    results.innerHTML = "";
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`,
    {
        "method": "GET"
    })
    .then(resp => {
        return resp.json();
    })
    .then(data => {
         let name = data["drinks"][0]["strDrink"];
    let glass = data["drinks"][0]["strGlass"];
    let instructions = data["drinks"][0]["strInstructions"];
    let image = data["drinks"][0]["strDrinkThumb"];
    let ingredients = [];
    for (let i = 1; i <= 15; i++) {
        if (data["drinks"][0][`strIngredient${i}`] != null) {
            ingredients.push(data["drinks"][0][`strIngredient${i}`]);
        } else i = 16;
    }
    
    let ingredientMeasurements = [];
    for (let j = 1; j <= ingredients.length; j++) {
        ingredientMeasurements.push(data["drinks"][0][`strMeasure${j}`]);
    }
    const drinkRequested = new Drink(name, ingredients, ingredientMeasurements, glass, instructions, image);
    showDrinks(drinkRequested);
    })
    
}

function randomDrink() {
    results.innerHTML = "";
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then(resp => resp.json())
    .then(data => {
        handle(data);
    })
}

(function() {
    let ingredients = [];
    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
    .then(resp => resp.json())
    .then(data => {
        console.log(data);
        for (let i = 0; i < data["drinks"].length; i++) {
            ingredients.push(data["drinks"][i]["strIngredient1"]);
        }
        let ingredientsSelect = $("ingredients");
        for(let i = 0; i < data["drinks"].length; i++) {
            let opt = document.createElement("option");
            opt.text = ingredients[i];
            opt.value = ingredients[i].replace(/\s/,'_');
            ingredientsSelect.add(opt);
        }
    })
})();

function selectIngredients() {
    results.innerHTML = "";
    let ingredientsSelect = $("ingredients");
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientsSelect.value}`)
    .then(resp => {
       console.log(resp);
        return resp.json();
    })
    .then(data => {
          for (let i = 0; i < data["drinks"].length; i++) {
    let name = data["drinks"][i]["strDrink"];
    let image = data["drinks"][i]["strDrinkThumb"];
    let drinkRequested = new Drink(name, [], [], "", "", image);
    showDrinksFromCat(drinkRequested);
    }
    })

}
