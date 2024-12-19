import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import re

class OCRService:
    @staticmethod
    def preprocess_image(image_stream):
        """
        Enhance image quality for OCR processing.
        """
        img = Image.open(image_stream)

        # grayscale
        img = img.convert("L")

        img = img.filter(ImageFilter.SHARPEN)

        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2)

        # Apply binary thresholding
        img = img.point(lambda x: 0 if x < 128 else 255, '1')

        return img

    def extract_mssv_from_image(image_stream):
        try:
            img = OCRService.preprocess_image(image_stream)

            # OCR Process
            ocr_result = pytesseract.image_to_string(img, lang="eng+vie")

            lines = ocr_result.split("\n")

            mssv_list = []
            for line in lines:
                # 10-digits
                match = re.search(r'(\d{10}).*?[xX✗✔!@#$%^&*]', line)
                if match:
                    mssv_list.append(match.group(1))

            return mssv_list

        except Exception as e:
            print("Error processing image:", e)
