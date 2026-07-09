from fastapi import APIRouter
from app.schemas.simulation import SimulationState
from app.services.simulation_service import simulation_engine

router = APIRouter()

@router.get("/status", response_model=SimulationState)
async def get_status():
    return simulation_engine.get_state()

@router.post("/start", response_model=SimulationState)
async def start_simulation():
    simulation_engine.start()
    return simulation_engine.get_state()

@router.post("/pause", response_model=SimulationState)
async def pause_simulation():
    simulation_engine.pause()
    return simulation_engine.get_state()

@router.post("/resume", response_model=SimulationState)
async def resume_simulation():
    simulation_engine.start()
    return simulation_engine.get_state()

@router.post("/next", response_model=SimulationState)
async def next_stage():
    simulation_engine.next_stage()
    return simulation_engine.get_state()

@router.post("/previous", response_model=SimulationState)
async def previous_stage():
    simulation_engine.previous_stage()
    return simulation_engine.get_state()

@router.post("/reset", response_model=SimulationState)
async def reset_simulation():
    simulation_engine.reset()
    return simulation_engine.get_state()
