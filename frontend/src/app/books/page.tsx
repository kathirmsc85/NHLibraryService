"use client";

import { useEffect, useState } from "react";
import { Book, getBooks, createBook, BookCreate } from "@/lib/api";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<BookCreate>({ title: "", author: "", isbn: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBook(newBook);
      setNewBook({ title: "", author: "", isbn: "" });
      fetchBooks();
    } catch (err) {
      alert("Failed to create book");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Library Books</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-6 text-white">Add New Book</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. The Hobbit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Author</label>
                <input 
                  required
                  type="text" 
                  value={newBook.author}
                  onChange={e => setNewBook({...newBook, author: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. J.R.R. Tolkien"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">ISBN</label>
                <input 
                  required
                  type="text" 
                  value={newBook.isbn}
                  onChange={e => setNewBook({...newBook, isbn: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 978-0261102217"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-20 text-slate-400 animate-pulse">Loading books...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map(book => (
                <div key={book.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{book.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">by {book.author}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.is_available ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      {book.is_available ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">ISBN: {book.isbn}</p>
                </div>
              ))}
              {books.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-400">
                  No books found. Add your first book!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
