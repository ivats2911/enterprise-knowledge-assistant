import os
from typing import List
from ingestion.load_documents import load_single_pdf
from rag.chunking import chunk_text
from rag.openai_embeddings import OpenAIEmbeddingModel
from rag.vector_store import VectorStore
from openai import OpenAI

class RAGService:
    def __init__(self):
        self.embedding_model = OpenAIEmbeddingModel()
        self.vector_store = VectorStore(storage_file="data/vector_store.json")
        self.client = OpenAI() # Uses OPENAI_API_KEY env var

    def ingest_file(self, file_path: str, metadata: dict):
        # 1. Load Text
        if file_path.endswith(".pdf"):
            text = load_single_pdf(file_path)
        else:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        
        # 2. Chunk
        chunks = chunk_text(text)
        
        # 3. Embed
        embeddings = self.embedding_model.embed_texts(chunks)
        
        # 4. Store
        doc_metadata = [metadata for _ in chunks]
        self.vector_store.add_documents(chunks, embeddings, doc_metadata)
        
        return len(chunks)

    def query(self, question: str):
        # 1. Embed Question
        question_embedding = self.embedding_model.embed_texts([question])[0]
        
        # 2. Search
        docs = self.vector_store.search(question_embedding, top_k=3)
        
        if not docs:
            return "I don't have enough information to answer that."

        # 3. Generate Answer
        context = "\n\n".join([doc['text'] for doc in docs])
        
        system_prompt = "You are a helpful assistant for gym equipment maintenance. Use the provided context to answer the user's question."
        user_prompt = f"Context:\n{context}\n\nQuestion: {question}"
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        return response.choices[0].message.content

rag_service = RAGService()
