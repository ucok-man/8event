# 8Event

Event management platform designed to simplify the process of organizing and managing events. This project was created to fulfill the requirements for graduating from a mini project in Purwadhika.

**Live** : [https://8event.ucokman.web.id](https://8event.ucokman.web.id)

## Tech Stack

- **Frontend:** Next.js, Shadcn, Tailwind CSS
- **Backend:** Node.js (Express.js), BullMQ Worker
- **Storage:** Postgresql, Prisma, Cloudinary, Redis
- **Payment:** Midtrans

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- Cloudinary account
- Midtrans account

### Setup

1. **Clone & Install**

   ```bash
   git clone <repo-url>
   cd 8event
   npm install
   ```

2. **Configure Environment**

   ```bash
   cd apps/api
   cp .env.example .env
   # Fill in your credentials

   cd apps/web
   cp .env.example .env
   # Fill in your credentials
   ```

3. **Setup Database**

   ```bash
   cd apps/api
   npx prisma migrate dev
   ```

4. **Run Dev Server**
   ```bash
   # From root project
   npm run dev
   ```

Visit `http://localhost:3000`
