const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filterItem = document.getElementById("filter");
const formBtn = itemForm.querySelector(".btn");
isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromLocalStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onSubmitAddItems(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("Please add an item");
  }

  // check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromLocalStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("item is already exists!");
      return;
    }
  }
  addItemToDOM(newItem);
  addItemToLocalStorage(newItem);
  itemInput.value = "";
  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemToLocalStorage(item) {
  const itemsFromStorage = getItemsFromLocalStorage();
  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromLocalStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function onClickEvent(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    if (confirm("Are you sure")) {
      removeItem(e.target.parentElement.parentElement);
    }
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromLocalStorage();
  console.log(itemsFromStorage);
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>    Update Item';
  item.classList.add("edit-mode");
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  // remove item form DOM
  item.remove();
  // remove item from local storage
  removeItemFromLocalStorage(item.textContent);
  checkUI();
}
function removeItemFromLocalStorage(removeItem) {
  let itemsFromStorage = getItemsFromLocalStorage();
  itemsFromStorage = itemsFromStorage.filter((item) => item !== removeItem);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function removeAll() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // remove all form local storage
  localStorage.removeItem("items");
  checkUI();
}
function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    filterItem.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filterItem.style.display = "block";
  }
  formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
    // console.log(itemName);
  });
}

itemForm.addEventListener("submit", onSubmitAddItems);
itemList.addEventListener("click", onClickEvent);
clearBtn.addEventListener("click", removeAll);
filterItem.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displayItems);
