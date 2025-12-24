import os
from pathlib import Path

def load_txt_files(data_dir):
    docs = []
    for file in Path(data_dir).glob("*.txt"):
        with open(file, "r", encoding="utf-8") as f:
            docs.append(f.read())
    return docs

# def load_pdf_files(data_dir):
#     try:
#         import PyPDF2
#     except ImportError:
#         raise ImportError("Install PyPDF2: pip install PyPDF2")

#     docs = []
#     for file in Path(data_dir).glob("*.pdf"):
#         with open(file, "rb") as f:
#             reader = PyPDF2.PdfReader(f)
#             text = ""
#             for page in reader.pages:
#                 text += page.extract_text() or ""
#             docs.append(text)
#     return docs

def main():
    # data_dir = "../data"
    BASE_DIR = Path(__file__).resolve().parent
    data_dir = BASE_DIR.parent / "data"

    txt_docs = load_txt_files(data_dir)
    # pdf_docs = load_pdf_files(data_dir)

    all_docs = txt_docs # + pdf_docs
    total_chars = sum(len(doc) for doc in all_docs)

    print(f"Number of documents: {len(all_docs)}")
    print(f"Total characters: {total_chars}")

if __name__ == "__main__":
    main()
