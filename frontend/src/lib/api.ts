const API_URL = "http://localhost:8000";

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  is_available: boolean;
}

export interface BookCreate {
  title: string;
  author: string;
  isbn: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface MemberCreate {
  name: string;
  email: string;
  phone?: string;
}

export interface BorrowRecord {
  id: number;
  book_id: number;
  member_id: number;
  borrow_date: string;
  return_date?: string;
  status: string;
  book?: Book;
  member?: Member;
}

export const getBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_URL}/books/`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};

export const createBook = async (book: BookCreate): Promise<Book> => {
  const res = await fetch(`${API_URL}/books/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
};

export const getMembers = async (): Promise<Member[]> => {
  const res = await fetch(`${API_URL}/members/`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
};

export const createMember = async (member: MemberCreate): Promise<Member> => {
  const res = await fetch(`${API_URL}/members/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });
  if (!res.ok) throw new Error("Failed to create member");
  return res.json();
};

export const borrowBook = async (book_id: number, member_id: number): Promise<BorrowRecord> => {
  const res = await fetch(`${API_URL}/borrow/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id, member_id }),
  });
  if (!res.ok) throw new Error("Failed to borrow book");
  return res.json();
};

export const returnBook = async (book_id: number): Promise<BorrowRecord> => {
  const res = await fetch(`${API_URL}/return/${book_id}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to return book");
  return res.json();
};

export const getMemberBorrowedBooks = async (member_id: number): Promise<BorrowRecord[]> => {
  const res = await fetch(`${API_URL}/members/${member_id}/borrowed_books`);
  if (!res.ok) throw new Error("Failed to fetch borrowed books");
  return res.json();
};
