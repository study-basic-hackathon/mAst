from fastapi import FastAPI
from routers import inventory, parts

app = FastAPI()

# Include routers
app.include_router(inventory.router)
app.include_router(parts.router)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

# Note: The database connection test endpoint ('/db') is removed 
# as the dependency injection system now handles connection checks implicitly.
# If a connection fails, the relevant endpoint will return a 503 error.
