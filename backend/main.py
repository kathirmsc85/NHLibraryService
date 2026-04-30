from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from . import models, schemas
from .database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Neighborhood Library Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Books Endpoints ---
@app.post("/books/", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.isbn == book.isbn).first()
    if db_book:
        raise HTTPException(status_code=400, detail="ISBN already registered")
    new_book = models.Book(**book.model_dump())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@app.get("/books/", response_model=List[schemas.Book])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = db.query(models.Book).offset(skip).limit(limit).all()
    return books

# --- Members Endpoints ---
@app.post("/members/", response_model=schemas.Member)
def create_member(member: schemas.MemberCreate, db: Session = Depends(get_db)):
    db_member = db.query(models.Member).filter(models.Member.email == member.email).first()
    if db_member:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_member = models.Member(**member.model_dump())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@app.get("/members/", response_model=List[schemas.Member])
def read_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    members = db.query(models.Member).offset(skip).limit(limit).all()
    return members

# --- Borrowing Endpoints ---
@app.post("/borrow/", response_model=schemas.BorrowRecord)
def borrow_book(borrow_req: schemas.BorrowRecordCreate, db: Session = Depends(get_db)):
    # Check if book exists and is available
    book = db.query(models.Book).filter(models.Book.id == borrow_req.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.is_available:
        raise HTTPException(status_code=400, detail="Book is already borrowed")
    
    # Check if member exists
    member = db.query(models.Member).filter(models.Member.id == borrow_req.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    # Create borrow record
    record = models.BorrowRecord(
        book_id=borrow_req.book_id,
        member_id=borrow_req.member_id,
        status="borrowed",
        borrow_date=datetime.utcnow()
    )
    # Mark book as unavailable
    book.is_available = False
    
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.post("/return/{book_id}", response_model=schemas.BorrowRecord)
def return_book(book_id: int, db: Session = Depends(get_db)):
    # Find active borrow record for this book
    record = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.book_id == book_id,
        models.BorrowRecord.status == "borrowed"
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Active borrow record not found for this book")
        
    # Mark as returned
    record.status = "returned"
    record.return_date = datetime.utcnow()
    
    # Mark book as available
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if book:
        book.is_available = True
        
    db.commit()
    db.refresh(record)
    return record

@app.get("/members/{member_id}/borrowed_books", response_model=List[schemas.BorrowRecord])
def get_member_borrowed_books(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    # Need to join with Book to return the book details as well
    records = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.member_id == member_id
    ).all()
    return records
