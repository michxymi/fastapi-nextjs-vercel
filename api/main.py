from fastapi import FastAPI

app = FastAPI()


@app.get("/api/v1/items/")
@app.get("/api/v1/items")
async def read_items():
    return {"items": ["alpha", "beta", "gamma"]}
