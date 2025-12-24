from rag.chunking import chunk_text

def test_chunking_basic():
    text = " ".join([f"word{i}" for i in range(1200)])

    chunks = chunk_text(text, chunk_size=500, overlap=100)

    assert len(chunks) == 3
    assert len(chunks[0].split()) == 500
    assert len(chunks[1].split()) == 500
