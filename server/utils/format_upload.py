def format_uploaded_file(filename: str, public_url: str) -> dict:
    """
    Format uploaded file data for MongoDB.
    
    Args:
        filename (str): Original file name (e.g., HyewonHam_Resume.docx)
        public_url (str): Public Supabase file URL
    
    Returns:
        dict: Structured file info for MongoDB
    """
    return {
        "name": filename,
        "url": public_url
    }
