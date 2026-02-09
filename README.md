# Enterprise Knowledge Assistant

A full-stack application built to manage gym assets, track maintenance logs, and leverage **Retrieval-Augmented Generation (RAG)** to query equipment manuals using natural language.

## 🚀 Features

- **Asset Management**: Create and track gyms and their associated equipment/assets.
- **Maintenance Logs**: Log maintenance activities for each asset to keep a history of repairs.
- **Knowledge Base (RAG)**:
  - Upload PDF manuals for specific assets.
  - Automatically ingest and chunk documents into a vector store.
  - Query the knowledge base to get AI-generated answers based on the uploaded manuals.
- **Authentication**: Secure user login with **JWT** tokens and **Argon2** password hashing.
- **Role-Based Access**: Default admin user creation for easy setup.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: [SQLModel](https://sqlmodel.tiangolo.com/) (SQLite)
- **AI/RAG**: OpenAI API (Embeddings & Chat Completion)
- **Authentication**: OAuth2 with Password Flow (JWT), Passlib (Argon2)
- **PDF Processing**: PyPDF2

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: CSS (Standard)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📋 Prerequisites

- **Python 3.10+**
- **Node.js 18+** & **npm**
- **OpenAI API Key**: Required for RAG functionality.

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd enterprise-knowledge-assistant
```

### 2. Backend Setup
Navigate to the root directory.

1.  **Create a virtual environment:**
    ```bash
    python -m venv .venv
    ```
2.  **Activate the virtual environment:**
    - **Windows:**
      ```powershell
      .venv\Scripts\activate
      ```
    - **Mac/Linux:**
      ```bash
      source .venv/bin/activate
      ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up Environment Variables:**
    Create a `.env` file in the root directory (or ensure your environment has the key set):
    ```ini
    OPENAI_API_KEY=sk-your-openai-api-key-here
    ```
    *(Note: JWT `SECRET_KEY` is currently set to a default value in `api/auth.py` for development. Change this for production.)*

### 3. Frontend Setup
Navigate to the `frontend` directory.

1.  **Install dependencies:**
    ```bash
    cd frontend
    npm install
    ```

## 🚀 Running the Application

### Start the Backend
From the root directory (ensure venv is active):

```bash
uvicorn api.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.
- **Swagger Docs**: `http://127.0.0.1:8000/docs`

### Start the Frontend
From the `frontend` directory:

```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

## 🔐 Default Login

When the backend starts for the first time, it creates a default admin user:

- **Username**: `admin`
- **Password**: `password123`

## 📂 Project Structure

```
enterprise-knowledge-assistant/
├── api/                 # FastAPI routes and main application
├── data/                # Database models and SQLite file
├── frontend/            # React + Vite frontend application
├── ingestion/           # Document processing scripts
├── rag/                 # RAG service (Embeddings, Vector Store)
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
