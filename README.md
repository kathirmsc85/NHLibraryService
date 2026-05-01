# Neighborhood Library Service

A robust full-stack application to manage books, members, and lending operations for a neighborhood library.

## Architecture
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** PostgreSQL
- **Frontend:** Next.js (React), Tailwind CSS

---

## Environment Setup

1. Navigate to the project root directory (`NHLibraryService`).

2. Activate your virtual environment (if you are using one):
   ```bash
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
   ```
   or
   ```bash
   uv add fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
   ```
   or
   ```bash
   uv sync
   ```

## 1. Database Setup

This project uses PostgreSQL.

1. Ensure PostgreSQL is installed and running on your system.
2. Create a database named `nhlibraryservice`.
3. The database connection is configured in `.env` file in outside NHLibraryService directory.
4. Variable names such as followed by
   DBUSER=''
   DBPASSWORD=''
   DBHOST=''
   DBNAME=''
   DBPORT=''

5. **Initialize the Tables:** 
   Run the following script from the root directory (`NHLibraryService`) to create all necessary tables automatically:
   ```bash
   uv run python -m backend.create_tables
   ```
   or
   ```bash
   python -m backend.create_tables
   ```

---

## 2. Backend Setup (FastAPI)
1. Run the Backend Server:
   ```bash
   uvicorn backend.main:app --reload
   ```
   The API will be available at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

---

## 3. Frontend Setup (Next.js)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the Node.js dependencies:
   ```bash
   npm install
   ```

3. Run the Development Server:
   ```bash
   npm run dev
   ```
   
4. The frontend application will be running at `http://localhost:3000`. Open this URL in your browser to interact with the premium library interface.

5. To point backend service api, go to the `frontend/src/lib/api.ts` file and update the API_BASE_URL variable.

---

## 4. Usage Flow

1. **Add Books:** Go to the "Books" tab to add library inventory.
2. **Add Members:** Go to the "Members" tab to register library patrons.
3. **Lending Operations:** Go to the "Lending" tab to select a member and check out available books to them.
4. **Returns:** In the Lending tab, view a member's active borrowed books and click "Return" to check the book back in.
