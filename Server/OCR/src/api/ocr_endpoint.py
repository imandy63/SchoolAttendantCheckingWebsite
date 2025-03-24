from fastapi import APIRouter, status, Depends, FastAPI, File, UploadFile, HTTPException
from src.service.ocr_service import OCRService
from src.utils.exception_handler import BadRequestErr
from io import BytesIO

router = APIRouter(
    prefix="/api/ocr",
    tags=["ocr"]
)

@router.post("", status_code=status.HTTP_200_OK)
async def upload_file(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        raise BadRequestErr("File is not an image")
    try:
        # Read file content into a stream
        file_content = await file.read()
        image_stream = BytesIO(file_content)

        # Extract MSSV using OCR service
        mssv = OCRService.extract_mssv_from_image(image_stream)

        if not mssv:
            return {"data": []}

        return {"data": mssv}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
