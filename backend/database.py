from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

# Update the connection string with your local PostgreSQL credentials
# Format: postgresql://<username>:<password>@localhost:5432/<database_name>
# For example, if your username is 'postgres' and password is 'password123':
password=os.getenv("DBPASSWORD")
db_name=os.getenv("DBNAME")
host=os.getenv("DBHOST")
user_name=os.getenv("DBUSER")
port=int(os.getenv("DBPORT")) if os.getenv("DBPORT") else 5432
# print("DBUSER:", user_name)
# print("DBPASSWORD:", password)
# print("DBHOST:", host)
# print("DBNAME:", db_name)
# print("DBPORT:", port)
SQLALCHEMY_DATABASE_URL = f"postgresql://{user_name}:{password}@{host}:{port}/{db_name}"
#print("Database URL:", SQLALCHEMY_DATABASE_URL)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
