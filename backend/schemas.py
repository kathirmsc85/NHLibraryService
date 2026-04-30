from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Books
class BookBase(BaseModel):
    title: str
    author: str
    isbn: str

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    is_available: bool

    class Config:
        from_attributes = True

# Members
class MemberBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class MemberCreate(MemberBase):
    pass

class Member(MemberBase):
    id: int

    class Config:
        from_attributes = True

# Borrow Records
class BorrowRecordBase(BaseModel):
    book_id: int
    member_id: int

class BorrowRecordCreate(BorrowRecordBase):
    pass

class BorrowRecord(BorrowRecordBase):
    id: int
    borrow_date: datetime
    return_date: Optional[datetime] = None
    status: str
    
    # Nested for convenience in responses
    book: Optional[Book] = None
    member: Optional[Member] = None

    class Config:
        from_attributes = True
