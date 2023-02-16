import uvicorn
from fastapi import FastAPI
from config import db
from fastapi.middleware.cors import CORSMiddleware
from service.auth import generate_role
from fastapi.responses import RedirectResponse
from fastapi.openapi.docs import get_swagger_ui_html

origins = [
    "http://localhost:3000",
]

def init_app():
    db.init()

    app = FastAPI(
        title= "Kehdinga Raymond Todo",
        description= "K-R API",
        version= "1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.on_event("startup")
    async def startup():
        await db.create_all()
        await generate_role()

    @app.on_event("shutdown")
    async def shutdown():
        await db.close()

    from controller import authentication, users, todos
    app.include_router(authentication.router)
    app.include_router(users.router)
    app.include_router(todos.router)
    return app

app = init_app()

# app = FastAPI()

# router = APIRouter()

@app.get("/")
async def home():
    return {"Welcome to Raymond's Todo",}

# app.include_router(router)

def start():
    uvicorn.run("main:app", host="0.0.0.0", port=8888, reload=True)


if __name__ == "__main__":
    start()