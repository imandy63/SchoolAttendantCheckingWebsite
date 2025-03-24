FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && apt-get clean

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . . 

EXPOSE 39895

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "39895"]