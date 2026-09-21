import asyncio
from app.core.database import AsyncSessionLocal
from app.models.product import Product
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Product))
        cakes = result.scalars().all()
        print(f'Total cakes: {len(cakes)}')

asyncio.run(main())
