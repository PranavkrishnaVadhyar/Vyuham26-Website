from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class ResourceNotFoundError(Exception):
    def __init__(self, resource: str):
        self.resource = resource


async def resource_not_found_handler(_: Request, exc: ResourceNotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": f"{exc.resource} not found"})


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(ResourceNotFoundError, resource_not_found_handler)
