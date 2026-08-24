-- ============================================================================
-- 002 — Demo bookings
--
-- Spec §4.6 (/book-a-demo) and §5.4 items 5–6.
--
-- The booking calendar itself lives in Cal.com or Calendly; this table is our
-- own copy of what was booked. Two reasons to keep it rather than relying on
-- the scheduling tool: the no-show rate in §1.3 has to be computable without
-- an export, and a booking has to be joinable to the lead that produced it.
-- ============================================================================

create table if not exists public.demo_bookings (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Nullable: someone can book straight from the calendar embed without ever
  -- submitting our form. We reconcile by email in that case.
  lead_id           uuid references public.website_leads(id) on delete set null,

  -- ── Who booked ──────────────────────────────────────────────────────────
  full_name         text not null,
  work_email        text not null,
  phone             text,
  company_name      text,
  employee_band     text,

  -- ── The slot ────────────────────────────────────────────────────────────
  slot_start        timestamptz not null,
  slot_end          timestamptz not null,
  timezone          text not null default 'Asia/Kolkata',
  meeting_url       text,
  assigned_to       text,

  -- ── Scheduler linkage ───────────────────────────────────────────────────
  -- provider_booking_uid is what the webhook sends us; unique so a retried or
  -- duplicated webhook delivery updates the row instead of creating a second.
  provider              text check (provider in ('cal.com', 'calendly', 'manual')),
  provider_booking_uid  text unique,
  calendar_event_id     text,

  -- ── Reminders (spec §5.4 item 5: 24h and 1h) ────────────────────────────
  reminder_24h_sent_at  timestamptz,
  reminder_1h_sent_at   timestamptz,

  -- ── Outcome (spec §1.3: no-show rate ≤ 25%) ─────────────────────────────
  outcome           text not null default 'Scheduled' check (outcome in
                      ('Scheduled', 'Held', 'No-show', 'Cancelled', 'Rescheduled')),
  rescheduled_from  uuid references public.demo_bookings(id) on delete set null,
  outcome_notes     text,

  constraint demo_bookings_slot_order check (slot_end > slot_start)
);

comment on table public.demo_bookings is
  'Our own record of demo slots booked. Mirrors Cal.com/Calendly so no-show rate and lead attribution stay queryable.';

create index if not exists demo_bookings_slot_start_idx
  on public.demo_bookings (slot_start);
create index if not exists demo_bookings_lead_id_idx
  on public.demo_bookings (lead_id);
create index if not exists demo_bookings_email_idx
  on public.demo_bookings (lower(work_email));
create index if not exists demo_bookings_outcome_idx
  on public.demo_bookings (outcome, slot_start desc);

-- Reminder sweeps ask "which upcoming bookings still need a reminder?".
-- Partial index keeps that scan tiny however large the history grows.
create index if not exists demo_bookings_reminders_pending_idx
  on public.demo_bookings (slot_start)
  where outcome = 'Scheduled'
    and (reminder_24h_sent_at is null or reminder_1h_sent_at is null);

drop trigger if exists demo_bookings_touch on public.demo_bookings;
create trigger demo_bookings_touch
  before update on public.demo_bookings
  for each row execute function public.touch_updated_at();

-- Booking a demo should move the originating lead along the pipeline. Done
-- here so it happens whether the booking arrived via our form or a webhook.
create or replace function public.advance_lead_on_booking()
returns trigger
language plpgsql
as $$
begin
  if new.lead_id is not null then
    update public.website_leads
       set status = 'Demo booked'
     where id = new.lead_id
       and status in ('New', 'Contacted');
  end if;
  return new;
end;
$$;

drop trigger if exists demo_bookings_advance_lead on public.demo_bookings;
create trigger demo_bookings_advance_lead
  after insert on public.demo_bookings
  for each row execute function public.advance_lead_on_booking();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.demo_bookings enable row level security;

drop policy if exists "anon may book a demo" on public.demo_bookings;
create policy "anon may book a demo"
  on public.demo_bookings
  for insert
  to anon
  with check (true);

-- No select policy: a visitor must not be able to enumerate who else booked.
