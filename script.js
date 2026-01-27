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

  this.updateBookStatus = function (id) {
    for (const book of books) {
      if (book.id === id) {
        book.read = !book.read;
        return book.read;
      }
    }
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
    const item = document.createElement("li");
    item.dataset.id = book.id;
    item.appendChild(createBookCard(book));

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

  const item = document.createElement("li");
  item.dataset.id = book.id;
  item.appendChild(createBookCard(book));
  list.appendChild(item);
}

function updateBookStatus(e) {
  const id = e.target.dataset.id;

  const read = library.updateBookStatus(id);
  if (read === undefined) {
    return;
  }

  const list = container.querySelector("ul");
  const button = list.querySelector(`[class="update"]`);
  const statusContainer = list.querySelector(".status");

  button.innerHTML = read ? "Mark as unread" : "Mark as read";
  statusContainer.innerHTML = read ? "Read" : "Unread";
}

function removeFromLibrary(e) {
  const id = e.target.dataset.id;
  library.remove(id);

  const list = container.querySelector("ul");
  const item = list.querySelector(`li[data-id="${id}"]`);
  const button = item.querySelector(`button[data-id="${id}"]`);

  button.removeEventListener("click", removeFromLibrary);
  item.remove();
}

function createBookCard(book) {
  const card = document.createElement("div");

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "Remove";
  removeButton.dataset.id = book.id;
  removeButton.addEventListener("click", removeFromLibrary);

  const updateButton = document.createElement("button");
  updateButton.innerHTML = book.read ? "Mark as unread" : "Mark as read";
  updateButton.dataset.id = book.id;
  updateButton.classList.add("update");
  updateButton.addEventListener("click", updateBookStatus);

  card.innerHTML = `
    <h2>${book.title}</h2> 
    <p>${book.description()}</p>
    <div class="status">${book.read ? "Read" : "Not read"}</div>
  `;

  card.appendChild(removeButton);
  card.appendChild(updateButton);

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
