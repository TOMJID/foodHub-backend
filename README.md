# FoodHub Backend 🍱

FoodHub is a robust backend for a meal-ordering ecosystem. It connects customers with local food providers, enabling real-time order tracking, menu management, and a comprehensive administration dashboard.

---

## 🚀 Key Features

- **Advanced Search & Filtering**: Discover meals by price, category, or dietary preference.
- **Provider Dashboards**: Manage menus, availability, and fulfillment workflows.
- **Order Lifecycle**: Real-time tracking from placement to delivery.
- **Review System**: Verifiable reviews restricted to customers who have received their meals.
- **Admin Control**: Statistics dashboard, user moderation (suspend/activate), and category management.
- **Secure Auth**: Powered by Better Auth with session management and account protection.

---

## 🛠 Tech Stack

- **Backend**: Express.js (v5)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Better Auth
- **Environment**: Node.js (v20+)
- **Package Manager**: pnpm

---

## ⚙️ Installation & Setup

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root with:

   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   FRONTEND_URL="http://localhost:3000"
   BETTER_AUTH_SECRET=your_generated_secret
   BETTER_AUTH_URL=http://localhost:5000
   ADMIN_EMAIL="admin@foodhub.com"
   ```

3. **Database Preparation**:

   ```bash
   npx prisma generate
   npx prisma db push

   ```

4. **Initialize Admin Account**:
   - Register a user via the frontend (or API) with the email matching your `ADMIN_EMAIL`.
   - Run the seed script to elevate the account:
     ```bash
     pnpm run seed:admin
     ```

5. **Start Development Server**:
   ```bash
   pnpm run dev
   ```

---

## 📖 API Reference

### 🔐 Authentication

- `POST /api/auth/sign-up/email`: Register a new account.
- `POST /api/auth/sign-in/email`: Login to existing account.
- `GET /api/auth/me`: Fetch current session data.

### 🍴 Meals & Providers

- `GET /api/meals`: List and filter meals.
- `GET /api/meals/:id`: Detail view of a meal.
- `GET /api/providers`: Discover restaurants.
- `GET /api/providers/:id`: Restaurant profile and menu.

### 🛒 Ordering & Reviews

- `POST /api/orders`: Place a new order.
- `GET /api/orders/my`: Context-aware order history (Role-based).
- `PATCH /api/orders/status/:id`: Update order progress.
- `POST /api/reviews`: Submit feedback for delivered meals.

### 🛡 Admin & Profiles

- `GET /api/admin/stats`: Real-time platform metrics.
- `GET /api/admin/users`: User management list.
- `PATCH /api/admin/users/:id/status`: Suspend or reactivate users.
- `PATCH /api/users/me`: Personal profile management.

---

## 🛡 Security & Integrity

- **Role-Based Middlewares**: Strict access control for Providers and Admins.
- **Instant Suspension**: Suspended users are immediately revoked from protected routes.
- **Order Validation**: Automatic logic ensures meals in a single order belong to the same restaurant.
- **Review Integrity**: Customers can only review items they have actually received.

---