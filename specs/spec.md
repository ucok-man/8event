# Event Management Platform

## Objective

The main goal of the MVP is to create a simple and functional event management platform that allows event organizers to create and promote events, while attendees can browse and register for those events.

---

## Core Features

### **Feature 1**

#### Event Discovery, Details, Creation, and Promotion (4 Points)

- **Landing Page**: Display a list of upcoming events.
- **Event Browsing**: Customers can browse events, filter by category/location, and view event details.
- **Search Bar**: Implement a search bar with debounce functionality.
- **Responsiveness**: Ensure the platform is responsive on all devices.
- **Event Creation**: Event organizers can create events with details such as:
  - Name
  - Price (free or paid)
  - Start date and end date
  - Available seats
  - Description
  - Ticket types (if applicable)
- **Pricing**:
  - Free or paid events are supported.
  - Customers are charged accordingly for paid events.
- **Promotions**:
  - Event organizers can create limited-time voucher promotions specific to events, with defined start and end dates.

#### Event Transaction (4 Points)

- **Purchasing**: Customers can create transactions to buy event tickets.
- **Transaction Statuses**:
  - Waiting for payment
  - Waiting for admin confirmation
  - Done
  - Rejected
  - Expired
  - Canceled
- **Payment Proof**:
  - A 2-hour countdown is shown for uploading payment proof after checkout.
- **Automatic Status Changes**:
  - Transactions expire if no payment proof is uploaded within 2 hours.
  - Transactions are canceled if the organizer doesn't act within 3 days.
- **Rollbacks and Seat Restoration**:
  - Points, vouchers, or coupons are returned for canceled or expired transactions.
  - Available seats are restored.
- **Point Usage**:
  - Customers can use points to reduce payment amounts.
  - Example: If a ticket costs IDR 300,000 and the customer has 20,000 points, they can pay IDR 280,000.
- **Currency**: All prices use IDR.

#### Event Reviews and Ratings (2 Points)

- **Reviews**: Customers can leave reviews and ratings only after attending the event.
- **Organizer Profile**: Ratings and reviews are displayed on the event organizer's profile.

---

### **Feature 2**

#### User Authentication and Authorization (2 Points)

- **Account Creation**: Customers must create an account to attend events.
- **Roles**:
  - Customer
  - Event Organizer
- **Referral Registration**: Customers can register using a referral number.
- **Referral Generation**: Referral numbers are generated for new users and cannot be changed.
- **Role-Based Access**: Protect pages based on user roles.

#### Referral System, Profile, and Prizes (4 Points)

- **Referral Rewards**:
  - Users registering with a referral get a discount coupon.
  - The referrer earns 10,000 points.
- **Points Expiration**:
  - Points expire 3 months after being credited.
  - Example: Points credited on Dec 28, 2023, expire on Mar 28, 2024.
- **Coupon Expiration**: Discount coupons are valid for 3 months.
- **Profile Management**:
  - Customers and event organizers can update their profile pictures, change passwords, and reset forgotten passwords.

#### Event Management Dashboard (4 Points)

- **Dashboard Access**:
  - Organizers can manage events, transactions, and view basic statistics.
- **Statistics Visualization**:
  - Display event data using graphs and reports by year, month, and day.
- **Transaction Management**:
  - Organizers can accept/reject transactions and view payment proofs.
- **Notification Emails**:
  - Notify customers when transactions are accepted/rejected.
  - Ensure points/vouchers/coupons are returned for rejected transactions.
  - Restore available seats for canceled or rejected transactions.
- **Attendee List**:
  - Show attendees' names, ticket quantities, and total prices paid.

---

## Clues

- **Voucher Discount**: Provided by the event organizer and specific to their events.
- **Reward/Coupon Discount**: Provided by the system and usable for all events.

---

## Notes

- Implement protected routes.
- Ensure full responsiveness.
- Add debounce to the search bar.
- Use popup dialogs for data modification confirmations.
- Create unit tests for each flow.
- Handle cases where no items are shown in filters or search.
- Use SQL transactions for multi-action modifications.
- Provide relevant project data.

---

## References

- [Eventbrite](https://www.eventbrite.com/)
- [Eventbookings](https://www.eventbookings.com/explore-events/)
- [TicketTailor](https://www.tickettailor.com/discover/)
- [Viagogo](https://www.viagogo.com/ww)
- [Loket](https://www.loket.com/)
