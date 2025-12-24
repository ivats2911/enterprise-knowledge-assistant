from typing import List
from openai import OpenAI
from rag.embeddings import EmbeddingModel

class OpenAIEmbeddingModel(EmbeddingModel):
    def __init__(self, model_name: str = "text-embedding-3-small"):
        self.client = OpenAI()
        self.model_name = model_name

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        response = self.client.embeddings.create(
            model=self.model_name,
            input=texts
        )
        return [item.embedding for item in response.data]
