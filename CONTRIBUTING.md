# Contributing to CityNerve

Thank you for your interest in contributing to CityNerve!

## Project Overview
CityNerve is a smart city monitoring platform. It uses Next.js for the frontend and FastAPI for the backend.

## Repository Structure
- `/` - Next.js frontend code.
- `/backend` - FastAPI backend application.
- `/components` - Reusable React components.
- `/docs` - Additional documentation.

## Local Setup
1. Clone the repository.
2. Install frontend dependencies: `npm install`
3. Run frontend development server: `npm run dev`
4. Change into the `backend` directory: `cd backend`
5. Create a virtual environment and install backend dependencies: `pip install -r requirements.txt`
6. Run the FastAPI development server: `fastapi dev app/main.py` (or as configured).

## Branch Strategy
- `main`: Stable production-ready code.
- `develop`: Integration branch for the next release.
- Feature branches (`feature/your-feature-name`): Branched off `develop` for new work.
- Bugfix branches (`bugfix/issue-description`): Branched off `develop` for fixes.

## Coding Conventions
- **Frontend**: Follow modern React patterns, use TypeScript, ensure ESLint compliance.
- **Backend**: Use Python type hints, follow PEP 8 standards, ensure code is properly modularized.

## Commit Message Conventions
We follow standard conventional commits format:
- `feat: [description]` for new features.
- `fix: [description]` for bug fixes.
- `docs: [description]` for documentation changes.
- `chore: [description]` for maintenance tasks.

## Pull Request Workflow
1. Fork the repository (or create a branch if you have write access).
2. Commit your changes.
3. Open a Pull Request targeting the `develop` branch.
4. Ensure all CI checks pass.
5. Wait for a maintainer to review and approve your PR.
