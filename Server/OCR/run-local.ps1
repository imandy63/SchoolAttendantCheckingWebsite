Copy-Item -Path .\.env.example -Destination .\.env -Force
python -m venv venv
venv\Scripts\activate
pip install --no-cache-dir -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 39895