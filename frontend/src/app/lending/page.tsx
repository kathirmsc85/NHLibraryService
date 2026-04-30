"use client";

import { useEffect, useState } from "react";
import { Book, Member, BorrowRecord, getBooks, getMembers, borrowBook, returnBook, getMemberBorrowedBooks } from "@/lib/api";

export default function LendingPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchBorrowedBooks(parseInt(selectedMemberId));
    } else {
      setBorrowedBooks([]);
    }
  }, [selectedMemberId]);

  const fetchInitialData = async () => {
    try {
      const [booksData, membersData] = await Promise.all([getBooks(), getMembers()]);
      setBooks(booksData);
      setMembers(membersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowedBooks = async (memberId: number) => {
    try {
      const data = await getMemberBorrowedBooks(memberId);
      // Backend does not return nested book details natively without relations in schemas correctly sometimes,
      // but let's assume it returns `book_id`. We'll map the `book` locally if missing.
      const enrichedData = data.map(record => ({
        ...record,
        book: record.book || books.find(b => b.id === record.book_id)
      }));
      setBorrowedBooks(enrichedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedBookId) return;
    
    try {
      await borrowBook(parseInt(selectedBookId), parseInt(selectedMemberId));
      setSelectedBookId("");
      await fetchInitialData(); // Refresh book availability
      await fetchBorrowedBooks(parseInt(selectedMemberId));
    } catch (err) {
      alert("Failed to borrow book. It might be unavailable.");
    }
  };

  const handleReturn = async (bookId: number) => {
    try {
      await returnBook(bookId);
      await fetchInitialData(); // Refresh book availability
      if (selectedMemberId) {
        await fetchBorrowedBooks(parseInt(selectedMemberId));
      }
    } catch (err) {
      alert("Failed to return book.");
    }
  };

  const availableBooks = books.filter(b => b.is_available);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Lending Operations</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Borrow Form */}
        <div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 text-white">Borrow a Book</h2>
            <form onSubmit={handleBorrow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Select Member</label>
                <select 
                  required
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" disabled>Select a member...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Select Book</label>
                <select 
                  required
                  value={selectedBookId}
                  onChange={e => setSelectedBookId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" disabled>Select an available book...</option>
                  {availableBooks.map(b => (
                    <option key={b.id} value={b.id}>{b.title} by {b.author}</option>
                  ))}
                </select>
                {availableBooks.length === 0 && (
                  <p className="text-xs text-rose-400 mt-2">No books available to borrow.</p>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={!selectedMemberId || !selectedBookId}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                Checkout Book
              </button>
            </form>
          </div>
        </div>

        {/* Member's Borrowed Books */}
        <div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm min-h-[400px]">
            <h2 className="text-xl font-semibold mb-6 text-white">Member's Borrowed Books</h2>
            
            {!selectedMemberId ? (
              <div className="text-center py-20 text-slate-500">
                Select a member to view their borrowed books.
              </div>
            ) : (
              <div className="space-y-4">
                {borrowedBooks.filter(r => r.status === "borrowed").map(record => {
                  const bookInfo = record.book || books.find(b => b.id === record.book_id);
                  return (
                    <div key={record.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-white">{bookInfo?.title || `Book ID: ${record.book_id}`}</h3>
                        <p className="text-xs text-slate-400">Borrowed: {new Date(record.borrow_date).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={() => handleReturn(record.book_id)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-white/10 transition-colors"
                      >
                        Return
                      </button>
                    </div>
                  );
                })}
                {borrowedBooks.filter(r => r.status === "borrowed").length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                    This member has no active borrowed books.
                  </div>
                )}
                
                {borrowedBooks.filter(r => r.status === "returned").length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-medium text-slate-400 mb-4">Past Returns</h3>
                    <div className="space-y-2 opacity-60">
                      {borrowedBooks.filter(r => r.status === "returned").map(record => {
                        const bookInfo = record.book || books.find(b => b.id === record.book_id);
                        return (
                          <div key={record.id} className="flex justify-between items-center text-sm">
                            <span className="text-white">{bookInfo?.title || `Book ID: ${record.book_id}`}</span>
                            <span className="text-slate-500">Returned {new Date(record.return_date!).toLocaleDateString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
