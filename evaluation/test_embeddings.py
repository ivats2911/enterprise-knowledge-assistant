from rag.openai_embeddings import OpenAIEmbeddingModel

def test_embedding_shape():
    model = OpenAIEmbeddingModel()
    texts = ["Hello world", "Enterprise AI systems"]

    embeddings = model.embed_texts(texts)

    assert len(embeddings) == 2
    assert len(embeddings[0]) > 100  # sanity check

if __name__ == "__main__":
    test_embedding_shape()
    print("Embedding test passed.")
