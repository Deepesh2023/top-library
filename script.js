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

  books.push(new Book("42", "Book", "Author", 100, false));

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
  if (books.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "No books";
    container.replaceChildren(paragraph);
    return;
  }

  const list = document.createElement("ul");
  for (const book of books) {
    const item = document.createElement("li");
    item.dataset.id = book.id;
    item.appendChild(createBookCard(book));

    list.appendChild(item);
  }

  container.replaceChildren(list);
}

function addToLibrary(book) {
  let list = container.querySelector("ul");
  if (!list) {
    list = document.createElement("ul");
    container.replaceChildren(list);
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

  const item = container.querySelector(`li[data-id="${id}"]`);
  const updateButton = item.querySelector(`.update`);
  const statusContainer = item.querySelector(".status");

  statusContainer.classList.remove(read ? "unread" : "read");

  updateButton.innerHTML = `<img data-id=${id} class="icon" src=${read ? "icons/checkbox-marked-circle-outline.svg" : "icons/radiobox-blank.svg"} />`;
  statusContainer.innerHTML = read ? "read" : "unread";
  statusContainer.classList.add(read ? "read" : "unread");
}

function removeFromLibrary(e) {
  const id = e.target.dataset.id;
  library.remove(id);

  const item = container.querySelector(`li[data-id="${id}"]`);
  const removeButton = item.querySelector(".remove");
  const updateButton = item.querySelector(".update");

  removeButton.removeEventListener("click", removeFromLibrary);
  updateButton.removeEventListener("click", updateBookStatus);
  item.remove();
}

function createBookCard(book) {
  const card = document.createElement("div");
  card.classList.add("card");

  const removeButton = document.createElement("button");
  removeButton.ariaLabel = "Remove";
  removeButton.innerHTML = `<img data-id=${book.id} src="icons/trash-can.svg" class="icon"/>`;
  removeButton.classList.add("remove");
  removeButton.addEventListener("click", removeFromLibrary);

  const updateButton = document.createElement("button");
  updateButton.ariaLabel = book.read ? "Mark as unread" : "Mark as read";
  updateButton.innerHTML = `<img data-id=${book.id} class="icon" src=icons/${book.read ? "checkbox-marked-circle-outline.svg" : "radiobox-blank.svg"} />`;
  updateButton.classList.add("update");
  updateButton.addEventListener("click", updateBookStatus);

  card.innerHTML = `
    <div>
      <h2>${book.title}</h2> 
      <p>${book.description()}</p>
      <span class="status ${book.read ? "read" : "unread"}">${book.read ? "read" : "unread"}</span>
    </div>

    <img class="cover"/>
  `;

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("book-options");

  buttonsContainer.appendChild(updateButton);
  buttonsContainer.appendChild(removeButton);

  card.appendChild(buttonsContainer);

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
