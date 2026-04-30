import backend.models as models
from backend.database import engine

def init_db():
    # This will create all tables defined in models.py
    models.Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
