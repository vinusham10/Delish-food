var randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
const randomMealImage = document.getElementById("random-meal-img");
const closeButton = document.querySelector(".close-button");
const inputBox = document.querySelector("input");
const searchedMealsHeading = document.getElementById('searched-results-value')
const ingredientBox = document.querySelector(".modal-content");
const getIngredientBtn = document.querySelector("#show-menu");
const searchResultsDiv = document.getElementsByClassName("searched-results")[0];
const categoryButton = document.getElementById("btn-1");
const randomMealName = document.getElementsByClassName("random-meal-name")[0];
const getMealButton = document.getElementById("random-meal-btn");
const areaButton = document.getElementById("btn-2");
const modal = document.querySelector(".modal");

const randomMealGenerator = () => {
  fetch(randomMealUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network error!");
      }
      return res.json();
    })
    .then((res) => {
      if (!res.meals || res.meals.length === 0) {
        throw new Error("No meals found!");
      }
      const food = res.meals[0];
      MealImageApender(food, randomMealImage);
      MealNameApender(food, randomMealName);
      MealIngredientLoader(food);
    })
    .catch((error) => {
      alert(error.message);
    });
};
var MealImageApender = (food, img) => (img.src = food.strMealThumb);

var MealNameApender = (food, name) => (name.textContent = food.strMeal);

window.onload = () => randomMealGenerator();

getMealButton.onclick = () => {
  randomMealGenerator();
};

const MealIngredientLoader = (food) => {
  const ingredientArray = []; 
  let count = 1; 
  while (true) { 
    const ingredient = food[`strIngredient${count}`]; 
    if (!ingredient) { 
      break;
    }
    ingredientArray.push(ingredient); 
    count++; 
  }
  console.log(ingredientArray);

  ingredientBox.innerHTML = "";
  const heading = document.createElement("h1"); 
  heading.textContent = `${food.strMeal} Ingredients`; 
  ingredientBox.appendChild(heading);
  heading.style.cssText = 
    "text-align: center; text-decoration: underline; text-underline-offset: 0.2em;";
  ingredientArray.forEach((el) => { 
    const ele = document.createElement("li"); 
    ele.textContent = el; 
    ingredientBox.appendChild(ele); 
  });
};

function showIngredient(food) {
  MealIngredientLoader(food);
  toggleModal();
}

function toggleModal() {
  modal.classList.toggle("show-modal");
  ingredientBox.classList.toggle("show-ingredients");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}
getIngredientBtn.addEventListener("click", () => {
  toggleModal();
});

document.addEventListener('keydown', function(e) {
  if (e.keyCode === 27) {
    modal.classList.remove('show-modal')
  }
})

ingredientBox.addEventListener("click", toggleModal);

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
const createResultElement = (food) => {
  const div = document.createElement("div");
  const name = document.createElement("h2");
  const image = document.createElement("img");
  MealImageApender(food, image);
  MealNameApender(food, name);
  image.addEventListener("click", () => showIngredient(food));
  div.appendChild(name);
  div.appendChild(image);
  return div;
};

const searchedMealsHeadingHandler = (value) => {
  searchedMealsHeading.textContent = ""
  searchedMealsHeading.textContent = `Results for: ${value}`
}
const searchByName = async (value) => {
  const searchByNameUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`;
  try {
    const res = await fetch(searchByNameUrl);
    if (!res.ok) {
      throw new Error("Network Error!");
    }
    const data = await res.json();
    if (data.meals && data.meals.length > 0) {
      searchResultsDiv.innerHTML = "";
      searchedMealsHeadingHandler(value)
      data.meals.forEach((food) => {
        const resultElement = createResultElement(food);
        searchResultsDiv.appendChild(resultElement);
      });
      searchResultsDiv.scrollIntoView({ behavior: "smooth" });
    } 
    else {
      alert('no meals found!, Check your meal spelling.')
    }
  } catch (error) {
    console.log(error.message);
  }
};

var options = ""; 
function handleBtnClick(btn, placeholder, option, otherBtn, btnText, otherBtnHandler) {

  if (selectedBtn === btn) {
    inputBox.placeholder = "Search. eg: chicken";
    options = "";
    selectedBtn = null;
  
    btn.innerText = btnText;
  
    otherBtn.addEventListener("click", otherBtnHandler);


  } else {

    inputBox.placeholder = placeholder;
    options = option;
    selectedBtn = btn;

    btn.innerText = `Selected the ${btnText}`;
    otherBtn.removeEventListener("click", otherBtnHandler);

  }
}

const searchByOptions = async (option, value) => {
  const searchByOptionsUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?${option}=${value}`;

  try {
    const res = await fetch(searchByOptionsUrl);
    const data = await res.json();

    if (data.meals && data.meals.length > 0) {

      searchResultsDiv.innerHTML = "";
      searchedMealsHeadingHandler(value)
      data.meals.forEach((food) => {
        const resultElement = createResultElement(food);
        searchResultsDiv.appendChild(resultElement);
      });
      searchResultsDiv.scrollIntoView({ behavior: "smooth" });
    } 
    else {
      if (option === 'c') {
        alert(`Please try to search related to ${alertOptions}`);
      } else if (option === 'r') {
        alert(`Please try to search related to ${alertOptions}`);
      }
    }
  } 
  catch (error) {
    alert("There was an error with your input");
  }
};

document.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    inputValueHandler(inputBox);
  }
});

function inputValueHandler(box) {
 
  var searchedValue = box.value;
  
  options != ""
  ? searchByOptions(options, searchedValue)
  : searchedValue != ""
  ? searchByName(searchedValue)
  : alert("type something");
  }

document.getElementById("search-icon").onclick = () =>
  inputValueHandler(inputBox); 


function showOptionList(url, mainDiv) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.meals.forEach((meal) => {
        const p = document.createElement("p");
        p.textContent = meal.strCategory || meal.strArea; 
        mainDiv.appendChild(p);
      });
      console.log(data);
    })
    .catch((error) => console.error(error)); 
}
