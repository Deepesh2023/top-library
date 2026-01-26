function Book(id, title, author, pages, read) {
  if (!new.target)
    throw Error("You must use the 'new' operator to call the constructor");

  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.description = function () {
  return `by ${this.author}, ${this.pages} pages`;
};

function Library() {
  if (!new.target)
    throw Error("You must use the 'new' operator to call the constructor");

  const books = [];

  this.add = function (title, author, pages, read) {
    const id = crypto.randomUUID();
    const book = new Book(id, title, author, pages, read);
    books.push(book);

    return book;
  };

  this.getAllBooks = function () {
    return books;
  };

  this.remove = function (id) {
    const index = books.findIndex((book) => book.id === id);
    books.splice(index, 1);
  };
}

function displayLibrary(books) {
  container.replaceChildren();

  if (books.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "No books";
    container.appendChild(paragraph);
    return;
  }

  const list = document.createElement("ul");
  for (const book of books) {
    const item = createBookCard(book);
    list.appendChild(item);
  }

  container.appendChild(list);
}

function addToLibrary(book) {
  let list = container.querySelector("ul");
  if (!list) {
    list = document.createElement("ul");
    container.replaceChildren();
    container.appendChild(list);
  }

  const item = createBookCard(book);
  list.appendChild(item);
}

function createBookCard(book) {
  const card = document.createElement("div");
  card.innerHTML = `
    <h2>${book.title}</h2> 
    <p>${book.description()}</p>
    <div>${book.read ? "Read" : "Not read"}</div>
    <button>Mark as read</button>
    <button class="remove-button" data-id="${book.id}">Remove</button>
  `;

  return card;
}

function submitHandler(e) {
  e.preventDefault();

  const title = e.target.title.value.trim();
  const author = e.target.author.value.trim();
  const pages = e.target.pages.value.trim();
  const read = e.target.read.checked;

  const book = library.add(title, author, pages, read);
  addToLibrary(book);

  newBookForm.reset();
  newBookDialog.close();
}

function removeFromLibrary(e) {
  const id = e.target.dataset.id;
  library.remove(id);
}

// Code starts here

// TODO: clear from if escape button is pressed

const container = document.querySelector(".books");

const newBookButton = document.querySelector(".new-book");
const newBookDialog = document.querySelector("dialog");
const newBookForm = document.querySelector("form");
const cancelButton = document.querySelector(".cancel");

const menuButton = document.querySelector(".menu");
const menuList = document.querySelector(".menu-list");

const library = new Library();
displayLibrary(library.getAllBooks());

menuButton.addEventListener("click", () => {
  menuList.style.display = menuList.style.display === "none" ? "block" : "none";
});

newBookButton.addEventListener("click", () => newBookDialog.showModal());
cancelButton.addEventListener("click", () => newBookDialog.close());

newBookForm.addEventListener("submit", submitHandler);
