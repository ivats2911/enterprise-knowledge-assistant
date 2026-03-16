# Gym Knowledge Assistant 🏋️‍♂️🤖

**Empowering Gym Operations with AI-Driven Equipment Intelligence.**

GymKnowledge Assistant is a modern, full-stack platform designed for gym managers, facility owners, and maintenance teams. It moves beyond simple asset tracking by integrating **Retrieval-Augmented Generation (RAG)**, allowing users to "talk" to their equipment manuals to solve technical issues instantly.

---

## 🌟 Why GymKnowledge Assistant?

Maintenance teams often struggle with bulky PDF manuals, leading to equipment downtime and safety risks. GymKnowledge Assistant solves this by:
- **Centralizing Assets**: Track every treadmill, weight machine, and facility asset in one place.
- **AI-Powered Answers**: Ask questions like *"How do I recalibrate the LifeFitness T5 belt?"* and get instant, accurate answers extracted directly from your uploaded manuals.
- **Maintenance History**: Keep a transparent log of repairs, costs, and technician notes to optimize equipment lifespan.

## 🚀 Key Features

### 📋 Asset & Facility Management
- **Multi-Gym Support**: Manage multiple locations from a single dashboard.
- **Detailed Asset Tracking**: Log purchase dates, serial numbers, and specific equipment notes.
- **Automated Logs**: Track every maintenance event to identify high-cost or unreliable equipment.

### 🧠 Intelligent AI Assistant (RAG)
- **Manual Ingestion**: Simply upload a PDF manual for any asset.
- **Smart Chunking**: The system automatically breaks down complex manuals into searchable, AI-ready "knowledge chunks."
- **Natural Language Querying**: A floating chatbot is available on every page to answer maintenance and usage questions using OpenAI's powerful language models.

### 🔐 Secure & Scalable
- **Role-Based Security**: JWT-based authentication and secure password hashing (Argon2).
- **Modern Tech Stack**: Built with FastAPI, React 19, and SQLModel for a fast, responsive, and type-safe experience.

---

## 🛠️ Tech Stack

### Backend (The Brain)
- **FastAPI**: High-performance Python framework for building APIs.
- **SQLModel & SQLite**: Elegant database management for asset and maintenance data.
- **OpenAI API**: Powering the RAG engine (Embeddings & Chat Completion).
- **PyPDF2**: For extracting knowledge from equipment manuals.

### Frontend (The Face)
- **React 19 & Vite**: A lightning-fast, modern web interface.
- **TypeScript**: Ensuring reliability and fewer bugs.
- **Lucide React**: Clean, modern iconography.
- **CSS3**: Responsive and intuitive design without heavy framework overhead.

---

## 📋 Prerequisites

Before you start, ensure you have:
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **OpenAI API Key**: Required for the AI Chatbot features.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd enterprise-knowledge-assistant
```

### 2. Backend Setup
1.  **Create and activate a virtual environment:**
    ```bash
    python -m venv .venv
    # Windows:
    .venv\Scripts\activate
    # Mac/Linux:
    source .venv/bin/activate
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure your environment:**
    Create a `.env` file in the root directory:
    ```ini
    OPENAI_API_KEY=sk-your-openai-api-key-here
    ```

### 3. Frontend Setup
1.  **Install dependencies:**
    ```bash
    cd frontend
    npm install
    ```

---

## 🚀 Running the Application

### 1. Start the Backend
From the root directory (with venv active):
```bash
uvicorn api.main:app --reload
```
- **API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start the Frontend
From the `frontend` directory:
```bash
npm run dev
```
- **Application**: [http://localhost:5173](http://localhost:5173)

### 🔐 Default Access
On first run, the system creates a default administrator:
- **Username**: `admin`
- **Password**: `password123`

---

## 📂 Project Structure

- `api/`: FastAPI routes, authentication, and core logic.
- `data/`: Database models, SQLite storage, and uploaded manuals.
- `frontend/`: React + Vite frontend application.
- `rag/`: The AI engine (Chunking, Embeddings, Vector Store).
- `ingestion/`: Specialized scripts for document processing.

---

## 🤝 Contributing

We welcome contributions! Feel free to fork the repo, create a feature branch, and submit a Pull Request.
