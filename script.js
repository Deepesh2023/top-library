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

    displayLibrary(books);
  };

  this.getAllBooks = function () {
    return books;
  };

  this.remove = function (id) {
    const index = books.findIndex((book) => book.id === id);
    books.splice(index, 1);

    displayLibrary(books);
  };
}

function displayLibrary(books) {
  let removeButtonElements = document.querySelectorAll(".remove-button");

  if (removeButtonElements.length > 0)
    removeButtonElements.forEach((button) =>
      button.removeEventListener("click", removeFromLibrary),
    );

  container.replaceChildren();

  if (books.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "No books.";

    container.appendChild(paragraph);
    return;
  }

  const list = document.createElement("ul");
  for (const book of books) {
    const item = document.createElement("li");

    item.innerHTML = `
        <div>
            <h2>${book.title}</h2> 
            <p>${book.description()}</p>
            <button class="remove-button" data-id="${book.id}">Remove</button>
        </div>
        `;

    list.appendChild(item);
  }

  container.appendChild(list);

  removeButtonElements = document.querySelectorAll(".remove-button");
  removeButtonElements.forEach((button) =>
    button.addEventListener("click", removeFromLibrary),
  );
}

function submitHandler(e) {
  e.preventDefault();

  const title = e.target.title.value;
  const author = e.target.author.value;
  const pages = e.target.pages.value;
  const read = e.target.read.checked;

  library.add(title, author, pages, read);

  newBookForm.reset();
  newBookDialog.close();
}

function removeFromLibrary(e) {
  const id = e.target.dataset.id;
  library.remove(id);
}

// Code starts here

// TODO: clear from if escape button is pressed

const newBookButton = document.querySelector(".new-book");
const newBookDialog = document.querySelector("dialog");
const container = document.querySelector(".books");
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
