const library = [];
const booksContainer = document.querySelector(".books");
const newBookForm = document.querySelector("form");

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

  displayLibrary();
}

function displayLibrary() {
  if (library.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "No books";

    booksContainer.appendChild(paragraph);
    return;
  }

  const ulist = document.createElement("ul");
  for (const book of library) {
    const list = document.createElement("li");
    const bookCard = document.createElement("div");
    const heading = document.createElement("h2");
    const description = document.createElement("p");

    heading.textContent = book.title;
    description.textContent = book.description();

    bookCard.appendChild(heading, description);
    list.appendChild(bookCard);
    ulist.appendChild(list);
  }

  booksContainer.appendChild(ulist);
}

displayLibrary();

newBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = e.target.title.value;
  const author = e.target.author.value;
  const pages = e.target.pages.value;
  const read = e.target.read.checked;

  const book = addToLibrary(title, author, pages, read);
});
