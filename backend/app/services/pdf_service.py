import fitz  # PyMuPDF
import re
from fastapi import UploadFile, HTTPException, status

def clean_pdf_text(text: str) -> str:
    """
    Cleans the extracted PDF text:
    - Removes null characters (\x00)
    - Reduces excessive blank lines (replaces 3+ newlines with 2 newlines)
    - Reduces repeated spaces/tabs (replaces multiple consecutive spaces/tabs with a single space)
    """
    if not text:
        return ""
    # Remove null characters
    text = text.replace("\x00", "")
    # Reduce repeated spaces and tabs
    text = re.sub(r"[ \t]+", " ", text)
    # Reduce excessive blank lines (3 or more newlines replaced by 2 newlines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Clean leading/trailing whitespaces per line
    lines = [line.strip() for line in text.split("\n")]
    text = "\n".join(lines)
    # Re-clean multiple newlines after strip
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Reads file bytes, extracts text from every page using PyMuPDF, and returns cleaned text.
    Raises HTTPException 400 if:
    - The file is empty
    - The PDF cannot be read/parsed
    - No readable text is found
    """
    # 1. Read the file bytes
    try:
        file.file.seek(0)
        file_bytes = file.file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read uploaded file: {str(e)}"
        )
    finally:
        # Seek back to beginning of file
        file.file.seek(0)

    # Check if empty
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # 2. Open the file using PyMuPDF
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid PDF file or PDF cannot be read: {str(e)}"
        )

    # 3. Extract text from every page
    extracted_pages = []
    try:
        for page in doc:
            page_text = page.get_text()
            if page_text:
                extracted_pages.append(page_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error extracting text from PDF: {str(e)}"
        )
    finally:
        doc.close()

    raw_text = "\n".join(extracted_pages)

    # Check if no readable text is found
    if not raw_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No readable text found in the PDF. The document may be empty or contain only scanned images."
        )

    # 4. Clean the text
    cleaned_text = clean_pdf_text(raw_text)
    if not cleaned_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No readable text found in PDF after processing."
        )

    return cleaned_text
