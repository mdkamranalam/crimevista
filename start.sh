#!/bin/bash
export PORT=${X_ZOHO_CATALYST_LISTEN_PORT:-8000}
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
