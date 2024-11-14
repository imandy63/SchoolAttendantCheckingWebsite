# Start FastApi


## Installation Virtual Environment
When you start working on a Python project for the first time, create a [virtual environment](https://fastapi.tiangolo.com/virtual-environments/#create-a-project) inside your project.

```bash
python -m venv venv
```
## Activate the Virtual Environment
```bash
venv\Scripts\Activate.ps1
```
## Install from requirements.txt
If you are using pip to install packages, you should upgrade it to the latest version.
```bash
python -m pip install --upgrade pip
```
My project have a requirements.txt, you can now use it to install its packages.
```bash
pip install -r requirements.txt
```
## Install the Server Program
When you install FastAPI, it comes with a production server, Uvicorn, and you can start it with the fastapi run command.
```bash
pip install "uvicorn[standard]"
```
## Run the Server Program
```bash
uvicorn main:app --reload --port 8000
```
