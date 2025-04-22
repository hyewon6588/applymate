from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.application_route import router as application_router
from routes.auth_route import router as auth_router

app = FastAPI()

# Allow frontend (localhost:3000) to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
    "https://applymate.vercel.app"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include upload routes
app.include_router(upload_router)

# Include application routes
app.include_router(application_router)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "ApplyMate API is running."}
