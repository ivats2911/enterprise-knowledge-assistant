import json
import numpy as np
import os
from typing import List, Dict, Any

class VectorStore:
    def __init__(self, storage_file="vector_store.json"):
        self.storage_file = storage_file
        self.documents = []  # List of {text, embedding, metadata}
        self.load()

    def add_documents(self, chunks: List[str], embeddings: List[List[float]], metadata: List[Dict[str, Any]] = None):
        if metadata is None:
            metadata = [{} for _ in chunks]
        
        for text, embedding, meta in zip(chunks, embeddings, metadata):
            self.documents.append({
                "text": text,
                "embedding": embedding,
                "metadata": meta
            })
        self.save()

    def search(self, query_embedding: List[float], top_k: int = 3):
        if not self.documents:
            return []

        query_vec = np.array(query_embedding)
        
        # Calculate cosine similarity
        results = []
        for doc in self.documents:
            doc_vec = np.array(doc['embedding'])
            similarity = np.dot(query_vec, doc_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(doc_vec))
            results.append((doc, similarity))
        
        # Sort by similarity desc
        results.sort(key=lambda x: x[1], reverse=True)
        return [r[0] for r in results[:top_k]]

    def save(self):
        # We assume embeddings are small enough for JSON for this demo
        # For production, use ChromaDB or similar
        with open(self.storage_file, 'w') as f:
            json.dump(self.documents, f)

    def load(self):
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r') as f:
                    self.documents = json.load(f)
            except:
                self.documents = []
