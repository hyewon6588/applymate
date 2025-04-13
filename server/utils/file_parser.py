# utils/file_parser.py

from typing import Dict
from docx import Document
import fitz
import re
print(fitz.__doc__)
async def extract_text_and_fields(file) -> Dict[str, str]:
    content = await file.read()
    filename = file.filename.lower()

    text = ""

    if filename.endswith(".pdf"):
        # Extract text from PDF
        doc = fitz.open(stream=content, filetype="pdf")
        for page in doc:
            text += page.get_text()
    elif filename.endswith(".docx"):
        # Extract text from DOCX
        with open("/tmp/temp.docx", "wb") as f:
            f.write(content)
        doc = Document("/tmp/temp.docx")
        text = "\n".join([p.text for p in doc.paragraphs])

    # Use simple regex patterns to extract likely fields
    company = re.search(r"(Company|Employer|Organization):?\s*(.+)", text, re.IGNORECASE)
    position = re.search(r"(Position|Job Title):?\s*(.+)", text, re.IGNORECASE)
    location = re.search(r"(Location|Office):?\s*(.+)", text, re.IGNORECASE)

    return {
        "company": company.group(2).strip() if company else "",
        "position": position.group(2).strip() if position else "",
        "location": location.group(2).strip() if location else "",
    }
