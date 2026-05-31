import os

ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
    """
    Checks if the uploaded file has a valid extension.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_size(file_size, limit):
    """
    Ensures the file does not exceed the size limit.
    """
    return file_size <= limit
