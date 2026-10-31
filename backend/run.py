"""Entry point for running the VERYNTH backend server."""

import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("BACKEND_HOST", "0.0.0.0")
    reload_enabled = os.environ.get("RENDER") is None and os.environ.get("ENV") != "production"

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload_enabled,
    )

