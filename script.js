const itemForm = document.getElementById('item-form');
const itemInput = document.querySelector('.form-input');
const itemList = document.querySelector('.items');
const clear = document.querySelector('.btn-clear');
const filter = document.querySelector('.filter');
const submitBtn = itemForm.querySelector('.btn');
let editMode = false;

// I need all tasks stored in local storage to be displayed in the DOM on reload
const showItems = () => {
  const storedItems = retrieveItems();

  storedItems.forEach((item) => addItemToDOM(item));

  defaultState();
};

//creating a function to add individual tasks to the list
const addItem = (e) => {
  //I don't want the form to submit to the page
  e.preventDefault();

  const newItem = itemInput.value;
  // validating input
  if (newItem === '') {
    alert('What is the name of the task you wish to add?');
    return;
  }

  //if a task is being edited, delete the old entry while creating the edited version as a new entry; else check for duplicates
  if (editMode) {
    const oldEntry = itemList.querySelector(".edit-mode")
    removeItem(oldEntry);
  } else {
    if (retrieveItems().includes(newItem)) {
      alert("This task is already on your list");
      return;
    }
  }

  addItemToDOM(newItem);

  storeItem(newItem);

  defaultState();

  itemInput.value = '';
};

//Adding item to DOM
const addItemToDOM = (item) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const rmvBtn = createButton('remove-item rmvbtn-link clr-green');
  li.appendChild(rmvBtn);

  itemList.appendChild(li);
};

const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  button.title = "Completed? Remove from the list";
  const icon = createIcon('fa-solid fa-check');
  button.appendChild(icon);

  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;

  return icon;
};

//Add item to localStorage
const storeItem = (item) => {
  const storedItems = retrieveItems();

  storedItems.push(item);

  //convert back to a string and set to localStorage (where "items" is key and the array of tasks is the value)
  localStorage.setItem('items', JSON.stringify(storedItems));
};

const retrieveItems = () => {
  let storedItems;

  if (localStorage.getItem('items') === null) {
    //if empty, then initialise the array
    storedItems = [];
  } else {
    //if items stored, then first need to parse them into an array from the string in localStorage
    storedItems = JSON.parse(localStorage.getItem('items'));
  }

  return storedItems;
};

//determine what was clicked and either remove or set item in edit state
const itemClick = (e) => {
  //if the icon in the rmvBtn gets clicked, the list element gets removed
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    editItem(e.target);
  }
};

//removing both from DOM and local storage
const removeItem = (item) => {
  //remove from DOM
  item.remove();
  
  //remove from local storage
  let storedItems = retrieveItems();
  //create a new array that excludes the item we are removing
  storedItems = storedItems.filter((i) => i !== item.textContent);
  //prepare for local storage
  localStorage.setItem('items', JSON.stringify(storedItems));

  defaultState();
};

const editItem = (item) => {
  editMode = true;

  //make sure only one selected item is grey, the rest reset to original color
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  submitBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Task";
  submitBtn.className = 'btn-edit';
  itemInput.value = item.textContent;
};

//instead of just clearing out innerHTML, I want for the ul to keep removing li's until there are none left
const clearAll = () => {
  //remove from DOM
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  //remove from localStorage
  localStorage.removeItem('items');

  //checking the number of items once cleared
  defaultState();
};

const filterItems = (e) => {
  filterContent = e.target.value.toLowerCase();
  items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const name = item.textContent.toLowerCase();
    //checking if characters in each item match the content of the filter, the non-match shows as -1
    if (name.indexOf(filterContent) === -1) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
};


const defaultState = () => {
  // when there are no items on the list, I want filter and clear button not to show
  if (itemList.querySelectorAll('li').length === 0) {
    clear.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clear.style.display = 'block';
    filter.style.display = 'block';
  }
  //revert to add tasks btn from edit mode
  submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
  submitBtn.className = 'btn';
  editMode = false;
  //all input fields cleared
  itemInput.value = "";
  document.querySelector(".form-input-filter").value = "";
};


itemForm.addEventListener('submit', addItem);
//using event delegation to target multiple elements with a single listener
itemList.addEventListener('click', itemClick);
clear.addEventListener('click', clearAll);
filter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', showItems);

defaultState();
