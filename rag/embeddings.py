from abc import ABC, abstractmethod
from typing import List

class EmbeddingModel(ABC):
    """
    Abstract base class for embedding models.
    """

    @abstractmethod
    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Convert a list of texts into embedding vectors.
        """
        pass
