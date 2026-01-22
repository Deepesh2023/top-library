const library = [];
const booksContainer = document.querySelector(".books");

function Book(id, title, author, pages, read) {
  if (!new.target)
    throw Error("You must use the 'new' operator to call the constructor");

  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;

  this.description = function () {
    return `by ${this.author}, ${this.pages} pages`;
  };
}

function addToLibrary(title, author, pages, read) {
  const id = crypto.randomUUID();
  const book = new Book(id, title, author, pages, read);
  library.push(book);
}

function displayLibrary() {
  if (library.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "No books";

    booksContainer.appendChild(paragraph);
    return;
  }
}

displayLibrary();
