from typing import List
import tiktoken

def token_chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 100,
    model_name: str = "gpt-4o-mini"
) -> List[str]:
    """
    Token-aware text chunking using tiktoken.
    """

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    encoding = tiktoken.encoding_for_model(model_name)
    tokens = encoding.encode(text)

    chunks = []
    start = 0

    while start < len(tokens):
        end = start + chunk_size
        chunk_tokens = tokens[start:end]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)
        start = end - overlap

    return chunks
