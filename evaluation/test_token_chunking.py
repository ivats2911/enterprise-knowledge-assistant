from rag.token_chunking import token_chunk_text

def test_token_chunking_basic():
    text = "This is a simple sentence. " * 200
    chunks = token_chunk_text(text, chunk_size=100, overlap=20)
    assert len(chunks) > 1
