# CityNerve Backend

Professional FastAPI backend foundation for CityNerve.

## Requirements
- Python 3.10+
- MongoDB

## Setup
1. Create a virtual environment: `python -m venv venv`
2. Activate it:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and configure your variables.

## Running
Run the development server:
```bash
uvicorn app.main:app --reload
```

## API Documentation
Once running, visit `http://localhost:8000/docs` to see the Swagger UI.
