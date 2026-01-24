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

  this.remove = function (e) {
    const id = e.target.dataset.id;
    const index = books.findIndex((book) => book.id === id);
    books.splice(index, 1);

    displayLibrary(books);
  };
}

function displayLibrary(books) {
  let removeButtonElements = document.querySelectorAll(".remove-button");

  if (removeButtonElements.length > 0)
    removeButtonElements.forEach((button) =>
      button.removeEventListener("click", library.remove),
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
    button.addEventListener("click", library.remove),
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
}

// Code starts here
const container = document.querySelector(".books");
const newBookForm = document.querySelector("form");

const library = new Library();
displayLibrary(library.getAllBooks());

newBookForm.addEventListener("submit", submitHandler);
