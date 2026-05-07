## RentEase NG — MVP Plan

A modern, mobile-responsive SaaS for Nigerian landlords, agents, property managers, and tenants to track properties, tenants, rent, receipts, maintenance, and lease renewals.

### Brand & Design System
- **Name:** PayPadi
- **Primary:** Deep purple `#1F0954`
- **Accents:** white, light gray, soft green (paid), amber (pending), red (overdue)
- **Typography:** Clean sans-serif (Inter), generous spacing, rounded cards, subtle shadows
- **Currency:** ₦ formatting everywhere with thousands separators
- **Status badges:** Paid / Pending / Overdue / Resolved / Vacant / Occupied / Under Maintenance
- Tables with search + filter, empty states, delete-confirmation modals, toast notifications

### Public Site
1. **Landing page (`/`)**
   - Hero with headline, subhead, "Get Started" + "View Demo" CTAs
   - Feature cards: Tenant records, Rent reminders, Payment history, Digital receipts, Maintenance complaints, Lease expiry reminders
   - "Built for Nigeria" section: annual rent, agent commission, caution fee, service charge, WhatsApp-style reminders, bank transfer confirmation
   - Pricing: Starter / Professional / Agency (mock pricing in ₦)
   - FAQ accordion
   - Footer with links + contact

2. **Login / Signup (`/login`, `/signup`)**
   - Email + password (Lovable Cloud auth, with Google sign-in)
   - Account type selector during signup: Landlord, Agent, Property Manager, Tenant
   - "View Demo" auto-loads a seeded demo account

### Authenticated App (under `/app`)
Sidebar layout (collapsible on mobile) with top bar showing user/role and logout.

3. **Dashboard** — Summary cards (properties, tenants, rent collected this month, overdue, pending maintenance, leases expiring soon) + charts (monthly rent collection bar chart, occupancy rate donut, maintenance status breakdown).

4. **Properties** — List/grid with filters; add/edit modal capturing name, address, type (apartment/duplex/self-con/shop/office/warehouse), units, landlord, assigned agent, service charge, status.

5. **Tenants** — Table + add/edit form: name, phone, email, property/unit, rent amount, cycle (monthly/quarterly/yearly), lease start/end, caution fee, payment status, emergency contact.

6. **Rent Payments** — Record payments with tenant, property, amount due/paid/balance, method (bank transfer/cash/POS/card), date, status, proof-of-payment upload placeholder, "Generate Receipt" action.

7. **Receipts** — List of generated receipts with receipt #, tenant, property, amount, date, method; Download (PDF placeholder) and Send (email/WhatsApp placeholder) buttons.

8. **Maintenance Requests** — Submit (tenant) and manage (manager/agent): type (plumbing/electrical/security/cleaning/structural/other), description, priority, status, assignee, dates.

9. **Lease Expiry Reminders** — Tenants with leases ending soon, days remaining, renewal status, "Send Reminder" button (placeholder).

10. **Reports** — Cards/tables for total collected, outstanding rent, occupancy rate, property performance, maintenance cost summary, agent performance, tenant debt.

11. **Settings** — Company profile, user management, role permissions, payment settings placeholder (Paystack/Flutterwave), reminder settings, notification preferences.

### Roles & Access (conceptual RBAC)
- **Admin / Property Manager:** full access
- **Landlord:** own properties only
- **Agent:** assigned properties only
- **Tenant:** own rent, receipts, complaints
Roles stored in a separate `user_roles` table with a `has_role()` security-definer function; RLS enforces visibility.

### Database (Lovable Cloud / Supabase)
Tables: `profiles`, `user_roles`, `properties`, `tenants`, `payments`, `receipts`, `maintenance_requests`, `lease_reminders`, `notifications`. Each gets RLS policies based on role + ownership. Seed with realistic Nigerian sample data (names like Adebayo, Chinedu, Aisha; addresses in Lagos/Abuja/PH; rents ₦80,000/mo, ₦500,000/yr, ₦1,200,000/yr).

### Out of Scope (placeholders only)
- Real Paystack / Flutterwave processing — mock status updates
- Real WhatsApp / email sending — toast confirmations only
- PDF receipt generation — download button shows toast
- Proof-of-payment file upload — UI placeholder

### Technical Notes
- TanStack Start file-based routing; each page is its own route file with proper SEO metadata
- Lovable Cloud for auth + DB; `requireSupabaseAuth` for server functions
- shadcn/ui components, Tailwind v4, Recharts for dashboard charts, sonner for toasts
- Mobile-first responsive layouts throughout

After approval I'll scaffold the database, seed sample data, build the landing + auth, then the dashboard and each module.