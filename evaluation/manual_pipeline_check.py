from rag.token_chunking import token_chunk_text
from rag.openai_embeddings import OpenAIEmbeddingModel

text = "Enterprise knowledge assistants help employees find information." * 20

chunks = token_chunk_text(text, chunk_size=100, overlap=20)
model = OpenAIEmbeddingModel()

embeddings = model.embed_texts(chunks)

print(f"Chunks: {len(chunks)}")
print(f"Embedding dimension: {len(embeddings[0])}")
