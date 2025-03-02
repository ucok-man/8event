# 8EVENT Minpro PWD

## Overview

8EVENT is a comprehensive event management platform designed to simplify the process of organizing and managing events. It is ideal for event organizers, businesses, and individuals who require an efficient solution for event planning, ticketing, attendee management, and more.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js (Express.js)
- **Database:** Supabase with Prisma ORM
- **Authentication:** JWT
- **File Upload:** Cloudinary
- **Payment Integration:** Midtrans

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-repo/8event-minpro-pwd.git
   cd 8event-minpro-pwd
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   - Copy the `.env.example` file found in `apps/web` and `apps/api`.
   - Rename it to `.env` and fill in the required values (database credentials, API keys, etc.).

4. **Run the development server:**

   ```sh
   npm run dev
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

## Live Demo

The application is deployed at: [8EVENT Minpro PWD](https://minpro-event-ticketing-web.vercel.app)

## Features in Development

The following features are currently missing and planned for future updates:

1. **Review System** – Allow users to leave reviews and feedback for events.
2. **Promotion Vouchers** – Implement discount codes and promotions.
3. **Forgot Password** – Enable users to reset their passwords.
4. **Email Verification** – Authenticate users via a verification link.

---

For any questions or contributions, feel free to open an issue or submit a pull request!
