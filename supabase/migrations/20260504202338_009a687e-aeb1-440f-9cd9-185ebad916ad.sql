
-- Enums
create type public.app_role as enum ('admin', 'property_manager', 'landlord', 'agent', 'tenant');
create type public.property_type as enum ('apartment', 'duplex', 'self_contained', 'shop', 'office', 'warehouse');
create type public.property_status as enum ('occupied', 'vacant', 'under_maintenance');
create type public.rent_cycle as enum ('monthly', 'quarterly', 'yearly');
create type public.payment_status as enum ('paid', 'partial', 'pending', 'overdue');
create type public.payment_method as enum ('bank_transfer', 'cash', 'pos', 'card');
create type public.complaint_type as enum ('plumbing', 'electrical', 'security', 'cleaning', 'structural', 'other');
create type public.priority_level as enum ('low', 'medium', 'high');
create type public.request_status as enum ('open', 'in_progress', 'resolved');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- has_role function
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

-- Convenience: any management role
create or replace function public.is_manager(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('admin','property_manager')
  );
$$;

-- Properties
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  type public.property_type not null default 'apartment',
  units int not null default 1,
  landlord_id uuid references auth.users(id) on delete set null,
  landlord_name text,
  agent_id uuid references auth.users(id) on delete set null,
  agent_name text,
  service_charge numeric(12,2) not null default 0,
  status public.property_status not null default 'vacant',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.properties enable row level security;

-- Tenants
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text,
  email text,
  property_id uuid references public.properties(id) on delete set null,
  unit_label text,
  rent_amount numeric(12,2) not null default 0,
  rent_cycle public.rent_cycle not null default 'yearly',
  lease_start date,
  lease_end date,
  caution_fee numeric(12,2) not null default 0,
  payment_status public.payment_status not null default 'pending',
  emergency_contact text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tenants enable row level security;

-- Payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  amount_due numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  balance numeric(12,2) generated always as (amount_due - amount_paid) stored,
  method public.payment_method not null default 'bank_transfer',
  payment_date date not null default current_date,
  status public.payment_status not null default 'pending',
  proof_url text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;

-- Receipts
create table public.receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  payment_id uuid references public.payments(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  tenant_name text,
  property_name text,
  amount numeric(12,2) not null default 0,
  paid_on date not null default current_date,
  method public.payment_method not null default 'bank_transfer',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.receipts enable row level security;

-- Maintenance requests
create table public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  tenant_name text,
  property_id uuid references public.properties(id) on delete set null,
  unit_label text,
  type public.complaint_type not null default 'other',
  description text not null,
  priority public.priority_level not null default 'medium',
  status public.request_status not null default 'open',
  assigned_to uuid references auth.users(id) on delete set null,
  assigned_name text,
  cost numeric(12,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.maintenance_requests enable row level security;

-- Lease reminders
create table public.lease_reminders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  lease_end date not null,
  renewal_status text not null default 'pending',
  last_reminder_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.lease_reminders enable row level security;

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text,
  kind text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_properties_updated before update on public.properties for each row execute function public.set_updated_at();
create trigger trg_tenants_updated before update on public.tenants for each row execute function public.set_updated_at();
create trigger trg_maintenance_updated before update on public.maintenance_requests for each row execute function public.set_updated_at();

-- Auto-create profile and default tenant role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'tenant'))
  on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== RLS Policies =====

-- profiles
create policy "Profiles: own select" on public.profiles for select using (auth.uid() = id or public.is_manager(auth.uid()));
create policy "Profiles: own update" on public.profiles for update using (auth.uid() = id);
create policy "Profiles: own insert" on public.profiles for insert with check (auth.uid() = id);

-- user_roles
create policy "Roles: own select" on public.user_roles for select using (auth.uid() = user_id or public.is_manager(auth.uid()));
create policy "Roles: managers manage" on public.user_roles for all using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));

-- properties
create policy "Properties: visible" on public.properties for select using (
  public.is_manager(auth.uid())
  or landlord_id = auth.uid()
  or agent_id = auth.uid()
  or exists (select 1 from public.tenants t where t.property_id = properties.id and t.user_id = auth.uid())
);
create policy "Properties: managers/landlords insert" on public.properties for insert with check (
  public.is_manager(auth.uid()) or public.has_role(auth.uid(),'landlord') or public.has_role(auth.uid(),'agent')
);
create policy "Properties: managers/owners update" on public.properties for update using (
  public.is_manager(auth.uid()) or landlord_id = auth.uid() or agent_id = auth.uid()
);
create policy "Properties: managers/owners delete" on public.properties for delete using (
  public.is_manager(auth.uid()) or landlord_id = auth.uid()
);

-- tenants
create policy "Tenants: visible" on public.tenants for select using (
  public.is_manager(auth.uid())
  or user_id = auth.uid()
  or exists (select 1 from public.properties p where p.id = tenants.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
);
create policy "Tenants: managers/owners write" on public.tenants for all using (
  public.is_manager(auth.uid()) or exists (select 1 from public.properties p where p.id = tenants.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
) with check (
  public.is_manager(auth.uid()) or public.has_role(auth.uid(),'landlord') or public.has_role(auth.uid(),'agent')
);

-- payments
create policy "Payments: visible" on public.payments for select using (
  public.is_manager(auth.uid())
  or exists (select 1 from public.tenants t where t.id = payments.tenant_id and t.user_id = auth.uid())
  or exists (select 1 from public.properties p where p.id = payments.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
);
create policy "Payments: managers/owners write" on public.payments for all using (
  public.is_manager(auth.uid())
  or exists (select 1 from public.properties p where p.id = payments.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
) with check (
  public.is_manager(auth.uid()) or public.has_role(auth.uid(),'landlord') or public.has_role(auth.uid(),'agent')
);

-- receipts (same visibility as payments)
create policy "Receipts: visible" on public.receipts for select using (
  public.is_manager(auth.uid())
  or exists (select 1 from public.tenants t where t.id = receipts.tenant_id and t.user_id = auth.uid())
  or exists (select 1 from public.properties p where p.id = receipts.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
);
create policy "Receipts: managers/owners write" on public.receipts for all using (
  public.is_manager(auth.uid())
  or exists (select 1 from public.properties p where p.id = receipts.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
) with check (
  public.is_manager(auth.uid()) or public.has_role(auth.uid(),'landlord') or public.has_role(auth.uid(),'agent')
);

-- maintenance_requests
create policy "Maintenance: visible" on public.maintenance_requests for select using (
  public.is_manager(auth.uid())
  or exists (select 1 from public.tenants t where t.id = maintenance_requests.tenant_id and t.user_id = auth.uid())
  or exists (select 1 from public.properties p where p.id = maintenance_requests.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
  or assigned_to = auth.uid()
);
create policy "Maintenance: tenants insert" on public.maintenance_requests for insert with check (
  auth.uid() is not null
);
create policy "Maintenance: managers/owners update" on public.maintenance_requests for update using (
  public.is_manager(auth.uid())
  or assigned_to = auth.uid()
  or exists (select 1 from public.properties p where p.id = maintenance_requests.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
);
create policy "Maintenance: managers delete" on public.maintenance_requests for delete using (public.is_manager(auth.uid()));

-- lease_reminders
create policy "Lease: visible" on public.lease_reminders for select using (
  public.is_manager(auth.uid())
  or exists (select 1 from public.tenants t where t.id = lease_reminders.tenant_id and t.user_id = auth.uid())
  or exists (select 1 from public.properties p where p.id = lease_reminders.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
);
create policy "Lease: managers/owners write" on public.lease_reminders for all using (
  public.is_manager(auth.uid())
  or exists (select 1 from public.properties p where p.id = lease_reminders.property_id and (p.landlord_id = auth.uid() or p.agent_id = auth.uid()))
) with check (
  public.is_manager(auth.uid()) or public.has_role(auth.uid(),'landlord') or public.has_role(auth.uid(),'agent')
);

-- notifications
create policy "Notifications: own" on public.notifications for select using (auth.uid() = user_id);
create policy "Notifications: own insert" on public.notifications for insert with check (auth.uid() = user_id or public.is_manager(auth.uid()));
create policy "Notifications: own update" on public.notifications for update using (auth.uid() = user_id);
