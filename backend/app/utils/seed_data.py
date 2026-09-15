import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.user import User
from app.models.product import Category, Product, ProductVariant
from app.models.order import Order, OrderItem

CATEGORIES_DATA = [
    {"name": "Chocolate Cakes", "slug": "chocolate-cakes", "description": "Single-origin Belgian and French cocoa confections"},
    {"name": "Birthday Cakes", "slug": "birthday-cakes", "description": "Celebratory handcrafted masterpieces with sprinkles and fillings"},
    {"name": "Bento Cakes", "slug": "bento-cakes", "description": "Trending Korean mini lunchbox cakes for intimate sweet moments"},
    {"name": "Cheesecakes", "slug": "cheesecakes", "description": "Authentic Basque, New York, and chilled berry cheesecakes"},
    {"name": "Designer Cakes", "slug": "designer-cakes", "description": "Multi-tiered floral and geometric artistic creations"},
    {"name": "Photo Cakes", "slug": "photo-cakes", "description": "High-definition edible sugar sheet customized cakes"},
    {"name": "Eggless Cakes", "slug": "eggless-cakes", "description": "100% vegetarian artisan bakes with delicate crumb textures"},
    {"name": "Sugar-Free Cakes", "slug": "sugar-free-cakes", "description": "Natural stevia and almond flour diabetic-friendly cakes"},
]

CAKES_DATA = [
    {
        "name": "Belgian Dark Chocolate Ganache Truffle Cake",
        "slug": "belgian-dark-chocolate-ganache-truffle-cake",
        "short_description": "Rich 70% Callebaut dark chocolate sponge layered with velvety whipped ganache and edible gold flakes.",
        "description": "Our crowned masterpiece. Baked with single-origin Callebaut Belgian chocolate, French cultured butter, and delicate cocoa syrup. Topped with hand-rolled truffles and 24K edible gold dust.",
        "base_price": 1099,
        "discount_price": 899,
        "category_name": "Chocolate Cakes",
        "occasion": "Birthday",
        "rating": 4.9,
        "review_count": 420,
        "featured": True,
        "best_seller": True,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 3,
        "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Royal Red Velvet & Philadelphia Cream Cake",
        "slug": "royal-red-velvet-cream-cheese-cake",
        "short_description": "Classic crimson cocoa crumb layered with authentic Philadelphia cream cheese frosting.",
        "description": "Velvety, moist, and tangy. Crafted with pure Madagascar bourbon vanilla and smooth organic cream cheese. Elegant red velvet crumb dusting on top.",
        "base_price": 949,
        "discount_price": 799,
        "category_name": "Birthday Cakes",
        "occasion": "Anniversary",
        "rating": 4.8,
        "review_count": 310,
        "featured": True,
        "best_seller": True,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 3,
        "image_url": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Lotus Biscoff Speculoos Caramel Dream Cake",
        "slug": "lotus-biscoff-speculoos-caramel-cake",
        "short_description": "Spiced Belgian cookie butter sponge infused with crunchy Biscoff crumbles and caramel drizzle.",
        "description": "Irresistible caramelized cinnamon crunch meets whipped dairy cream. Layered with generous layers of Belgian Lotus Biscoff spread and topped with whole biscuits.",
        "base_price": 1199,
        "discount_price": 999,
        "category_name": "Designer Cakes",
        "occasion": "Party",
        "rating": 4.9,
        "review_count": 280,
        "featured": True,
        "best_seller": True,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 4,
        "image_url": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Wild Blueberry Burnt Basque Cheesecake",
        "slug": "wild-blueberry-burnt-basque-cheesecake",
        "short_description": "Caramelized rustic Basque crust with a molten, ultra-creamy centre and wild blueberry compote.",
        "description": "Authentic San Sebastián recipe baked at high heat for maximum depth of flavor, caramelization, and velvety softness. Served with housemade wild blueberry coulis.",
        "base_price": 1299,
        "discount_price": 1099,
        "category_name": "Cheesecakes",
        "occasion": "Birthday",
        "rating": 5.0,
        "review_count": 195,
        "featured": True,
        "best_seller": True,
        "customizable": False,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 6,
        "image_url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Korean Pastel Daisy Bento Cake",
        "slug": "korean-pastel-daisy-bento-cake",
        "short_description": "Aesthetic pastel Korean bento box cake with buttercream daisies and custom piped lettering.",
        "description": "The perfect miniature sweet surprise for 1-2 people. Fluffy vanilla chiffon sponge filled with Belgian strawberry jam and frosted with silky Swiss meringue style frosting.",
        "base_price": 549,
        "discount_price": 449,
        "category_name": "Bento Cakes",
        "occasion": "Birthday",
        "rating": 4.8,
        "review_count": 480,
        "featured": True,
        "best_seller": True,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 3,
        "image_url": "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Old-School Classic Black Forest Gateau",
        "slug": "classic-black-forest-gateau",
        "short_description": "Layers of dark chocolate sponge, kirsch macerated cherries, and mountains of fresh whipped cream.",
        "description": "Timeless German confectionery. Cocoa sponge steeped in cherry syrup, loaded with tart dark cherries and dark chocolate curls.",
        "base_price": 899,
        "discount_price": 749,
        "category_name": "Chocolate Cakes",
        "occasion": "Birthday",
        "rating": 4.7,
        "review_count": 510,
        "featured": False,
        "best_seller": True,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 3,
        "image_url": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Ferrero Rocher Hazelnut Praline Cake",
        "slug": "ferrero-rocher-hazelnut-praline-cake",
        "short_description": "Roasted Piedmont hazelnuts, crispy wafer feuilletine, and Nutella ganache encased in chocolate glaze.",
        "description": "Crunchy, nutty, and decadent. Filled with roasted hazelnut praline paste, crunchy wafer flakes, and topped with whole Ferrero Rocher pralines.",
        "base_price": 1399,
        "discount_price": 1149,
        "category_name": "Designer Cakes",
        "occasion": "Anniversary",
        "rating": 4.9,
        "review_count": 260,
        "featured": True,
        "best_seller": True,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 4,
        "image_url": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Fresh Alphonso Mango & Chantilly Cake",
        "slug": "fresh-alphonso-mango-chantilly-cake",
        "short_description": "Seasonal Ratnagiri Alphonso mango chunks layered inside delicate vanilla sponge with whipped cream.",
        "description": "Bursting with real sun-ripened Alphonso mangoes. Light, fruity, and refreshing with zero artificial essence.",
        "base_price": 999,
        "discount_price": 849,
        "category_name": "Birthday Cakes",
        "occasion": "Festivals",
        "rating": 4.9,
        "review_count": 340,
        "featured": True,
        "best_seller": False,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 3,
        "image_url": "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Pistachio Rose Water Persian Love Cake",
        "slug": "pistachio-rose-water-persian-love-cake",
        "short_description": "Fragrant cardamom and rose water sponge garnished with Iranian slivered pistachios and dried petals.",
        "description": "An aristocratic blend of ground emerald pistachios, cardamom warmth, and pure rose water syrup. Frosted with whipped mascarpone.",
        "base_price": 1299,
        "discount_price": 1099,
        "category_name": "Designer Cakes",
        "occasion": "Wedding",
        "rating": 4.9,
        "review_count": 180,
        "featured": True,
        "best_seller": False,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 5,
        "image_url": "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "New York Baked Strawberry Cheesecake",
        "slug": "new-york-baked-strawberry-cheesecake",
        "short_description": "Dense and silky slow-baked cream cheese on a buttery graham cracker crust with fresh strawberry glaze.",
        "description": "Authentic Manhattan deli style baked cheesecake with a rich, velvety consistency and fresh mountain strawberry reduction.",
        "base_price": 1199,
        "discount_price": 999,
        "category_name": "Cheesecakes",
        "occasion": "Birthday",
        "rating": 4.8,
        "review_count": 220,
        "featured": False,
        "best_seller": False,
        "customizable": False,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 5,
        "image_url": "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Sugar-Free Keto Dark Chocolate Truffle Cake",
        "slug": "sugar-free-keto-dark-chocolate-cake",
        "short_description": "100% diabetic-friendly cake baked with almond flour, erythritol, and 85% unsweetened chocolate.",
        "description": "Zero sugar, low carb, and gluten-free without sacrificing rich chocolate satisfaction. Sweetened purely with natural monk fruit and erythritol.",
        "base_price": 1249,
        "discount_price": 1049,
        "category_name": "Sugar-Free Cakes",
        "occasion": "Birthday",
        "rating": 4.8,
        "review_count": 140,
        "featured": True,
        "best_seller": False,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": True,
        "preparation_time_hours": 4,
        "image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop",
    },
    {
        "name": "Vintage 2-Tier Lambeth Ruffle Wedding Cake",
        "slug": "vintage-lambeth-ruffle-wedding-cake",
        "short_description": "Intricately piped over-piped Victorian Lambeth royal icing ribbons, pearls, and pastel cherries.",
        "description": "The showstopping centerpiece. Two majestic tiers customizable in dual flavours, finished with heirloom Lambeth piping scrolls and organic flowers.",
        "base_price": 3499,
        "discount_price": 2999,
        "category_name": "Designer Cakes",
        "occasion": "Wedding",
        "rating": 5.0,
        "review_count": 92,
        "featured": True,
        "best_seller": False,
        "customizable": True,
        "eggless_available": True,
        "sugar_free_available": False,
        "preparation_time_hours": 24,
        "image_url": "https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=800&auto=format&fit=crop",
    },
]


async def seed_database(db: AsyncSession) -> None:
    """Check if database is seeded, if not insert default users, categories, products, and variants."""
    
    # 1. Seed Users
    result = await db.execute(select(User).limit(1))
    if not result.scalars().first():
        # Admin User
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@letoile.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Chef Jean-Luc (Head Pastry Master)",
            phone="+91 98765 00001",
            role="ADMIN",
            is_active=True,
            is_verified=True,
            is_approved=True,
        )
        # Customer User
        customer_user = User(
            id=str(uuid.uuid4()),
            email="customer@letoile.com",
            hashed_password=get_password_hash("customer123"),
            full_name="Aarav Sharma",
            phone="+91 98765 43210",
            role="CUSTOMER",
            is_active=True,
            is_verified=True,
            is_approved=True,
        )
        db.add(admin_user)
        db.add(customer_user)
        await db.flush()

        # 2. Seed Categories
        category_map = {}
        for cat_data in CATEGORIES_DATA:
            cat = Category(
                id=str(uuid.uuid4()),
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                image_url=None,
                is_active=True,
            )
            db.add(cat)
            category_map[cat_data["name"]] = cat

        await db.flush()

        # 3. Seed Products & Variants
        for cake in CAKES_DATA:
            cat_obj = category_map.get(cake["category_name"])
            prod = Product(
                id=str(uuid.uuid4()),
                name=cake["name"],
                slug=cake["slug"],
                short_description=cake["short_description"],
                description=cake["description"],
                base_price=float(cake["base_price"]),
                discount_price=float(cake["discount_price"]) if cake.get("discount_price") else None,
                category_id=cat_obj.id if cat_obj else None,
                category_name=cake["category_name"],
                occasion=cake.get("occasion", "Birthday"),
                rating=float(cake["rating"]),
                review_count=int(cake["review_count"]),
                featured=bool(cake.get("featured", False)),
                best_seller=bool(cake.get("best_seller", False)),
                customizable=bool(cake.get("customizable", True)),
                eggless_available=bool(cake.get("eggless_available", True)),
                sugar_free_available=bool(cake.get("sugar_free_available", False)),
                preparation_time_hours=int(cake.get("preparation_time_hours", 3)),
                image_url=cake["image_url"],
                is_active=True,
            )
            db.add(prod)
            await db.flush()

            # Create default weight & flavour variants
            for weight, mult in [("0.5 KG", 0.7), ("1.0 KG", 1.0), ("1.5 KG", 1.45), ("2.0 KG", 1.9)]:
                variant = ProductVariant(
                    id=str(uuid.uuid4()),
                    product_id=prod.id,
                    flavour="Belgian Chocolate",
                    weight=weight,
                    eggless=True,
                    price=round(prod.base_price * mult),
                    discount_price=round(prod.discount_price * mult) if prod.discount_price else None,
                    sku=f"{prod.slug[:12]}-{weight.replace(' ', '')}".upper(),
                    stock=40,
                    is_active=True,
                )
                db.add(variant)

        # 4. Seed Initial Sample Orders for Admin Testing
        order1 = Order(
            id=str(uuid.uuid4()),
            order_number="LET-89234",
            user_id=customer_user.id,
            customer_name="Aarav Sharma",
            customer_email="aarav.sharma@example.com",
            customer_phone="+91 98765 43210",
            delivery_address="Flat 402, Sunshine Meadows, 12th Main Indiranagar",
            delivery_city="Bengaluru",
            delivery_pincode="560038",
            delivery_date=datetime.now().strftime("%Y-%m-%d"),
            delivery_slot="3:00 PM - 6:00 PM",
            instructions="Please pack extra candle set and write Happy Birthday Rhea on cake.",
            subtotal=899.0,
            tax_amount=45.0,
            delivery_fee=0.0,
            discount_amount=0.0,
            total_amount=944.0,
            status="PREPARING",
            payment_status="SUCCESS",
            payment_method="RAZORPAY",
            payment_id="pay_rzp_mock_89234",
        )
        db.add(order1)
        await db.flush()

        item1 = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order1.id,
            product_id="cake-1",
            product_name="Belgian Dark Chocolate Ganache Truffle Cake",
            image_url="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
            price=899.0,
            quantity=1,
            flavour="Belgian Chocolate",
            weight="1.0 KG",
            is_eggless=True,
            custom_message="Happy Birthday Rhea!",
        )
        db.add(item1)

        await db.commit()
