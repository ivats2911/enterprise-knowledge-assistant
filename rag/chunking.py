from typing import List

def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 100
) -> List[str]:
    """
    Split text into overlapping chunks.

    Args:
        text (str): Input document text
        chunk_size (int): Number of tokens per chunk (approx via words)
        overlap (int): Overlap between chunks

    Returns:
        List[str]: List of text chunks
    """

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    words = text.split()
    chunks = []

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunk = " ".join(chunk_words)
        chunks.append(chunk)

        start = end - overlap

    return chunks
