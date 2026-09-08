-- ============================================================================
-- 007 — Record the 'login' rate-limit bucket
--
-- No schema change: bucket is free text and check_rate_limit() already takes
-- the bucket, limit and window as parameters, so the admin login throttle
-- reuses all of it as-is. This migration exists to keep the column comment
-- honest — a list of buckets that omits the one guarding the admin login is
-- worse than no list, because the next person trusts it.
--
-- Why login is here at all: the throttle used to be an in-memory Map, which
-- on serverless means per-instance, which means an attacker spreading guesses
-- across instances was never really limited. The shared count fixes that.
-- ============================================================================

comment on column public.rate_limit_events.bucket is
  'Which limiter the row belongs to: lead | newsletter | download | booking | login.';

comment on table public.rate_limit_events is
  'Shared counters for the public form limiters and the admin login throttle. '
  'ip_hash is a salted SHA-256 of the client address — never the raw IP. '
  'Rows age out of each limiter''s window on their own; prune_rate_limit_events() '
  'is housekeeping, not correctness.';
