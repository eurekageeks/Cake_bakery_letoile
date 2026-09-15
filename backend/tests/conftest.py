import pytest
from app.core.database import Base, AsyncSessionLocal, engine
from app.utils.seed_data import seed_database


@pytest.fixture(autouse=True, scope="session")
async def setup_test_database():
    """Create all tables and seed data for the test session."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await seed_database(session)

    yield
