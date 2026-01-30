import { prisma } from "./src/lib/prisma";
import { OrderStatus } from "./generated/prisma/enums";

async function main() {
  console.log("🌱 Seeding data for reviews...");

  // 1. Create a Customer
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      id: "seed-customer-id",
      name: "John Doe",
      email: "customer@example.com",
      role: "customer",
    },
  });

  // 2. Create a Provider
  const providerUser = await prisma.user.upsert({
    where: { email: "provider@example.com" },
    update: { role: "provider" },
    create: {
      id: "seed-provider-id",
      name: "Chef Mario",
      email: "provider@example.com",
      role: "provider",
    },
  });

  const providerProfile = await prisma.providerProfile.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      restaurantName: "Mario's Italian",
      cuisineType: "Italian",
      address: "123 Pasta Street",
    },
  });

  // 3. Create a Category
  const category = await prisma.category.upsert({
    where: { name: "Pizza" },
    update: {},
    create: {
      name: "Pizza",
    },
  });

  // 4. Create a Meal
  const meal = await prisma.meal.create({
    data: {
      name: "Seeded Margherita",
      price: 15.0,
      description: "Seed generated meal for testing",
      providerId: providerProfile.id,
      categoryId: category.id,
    },
  });

  // 5. Create a DELIVERED Order (Required to leave a review)
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      providerId: providerProfile.id,
      deliveryAddress: "789 Test Road",
      totalAmount: 15.0,
      status: OrderStatus.delivered,
      items: {
        create: [
          {
            mealId: meal.id,
            quantity: 1,
            priceAtTime: 15.0,
          },
        ],
      },
    },
  });

  // 6. Create a Review
  const review = await prisma.review.create({
    data: {
      customerId: customer.id,
      mealId: meal.id,
      rating: 5,
      comment: "This seeded pizza was amazing! Highly recommended.",
    },
  });

  console.log("✅ Seeding complete!");
  console.log({
    customerId: customer.id,
    providerId: providerProfile.id,
    mealId: meal.id,
    orderId: order.id,
    reviewId: review.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
