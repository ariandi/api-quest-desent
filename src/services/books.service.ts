import { Book, CreateBookDto, PaginatedResult, UpdateBookDto } from "../types";

class BooksService {
  private readonly books: Book[] = [];
  private nextId: number = 1;

  findAll(author?: string): Book[] {
    if (author) {
      return this.books.filter((book) =>
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    return [...this.books];
  }

  findAllPaginated(
    page: number,
    limit: number,
    author?: string
  ): PaginatedResult<Book> {
    const filtered = this.findAll(author);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    return { data, total, page, limit, totalPages };
  }

  findById(id: number): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  create(dto: CreateBookDto): Book {
    const book: Book = {
      id: this.nextId++,
      title: dto.title.trim(),
      author: dto.author.trim(),
    };
    this.books.push(book);
    return book;
  }

  update(id: number, dto: UpdateBookDto): Book | undefined {
    const index = this.books.findIndex((book) => book.id === id);
    if (index === -1) return undefined;

    this.books[index] = {
      ...this.books[index],
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.author !== undefined && { author: dto.author.trim() }),
    };

    return this.books[index];
  }

  delete(id: number): boolean {
    const index = this.books.findIndex((book) => book.id === id);
    if (index === -1) return false;

    this.books.splice(index, 1);
    return true;
  }
}

export const booksService = new BooksService();
