-- ═══════════════════════════════════════════════════════════════
--  AgriSmart — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ── FARMS ────────────────────────────────────────────────────
create table if not exists farms (
  id           uuid      default gen_random_uuid() primary key,
  user_id      uuid      references auth.users not null,
  location     text      not null,
  lat          decimal(10,6),
  lon          decimal(10,6),
  state_name   text,
  district     text,
  land_size    decimal(8,2),
  soil_type    text,
  water_avail  text,
  budget       text,
  risk_pref    text,
  altitude_m   decimal(8,1),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── RECOMMENDATIONS ───────────────────────────────────────────
create table if not exists recommendations (
  id               uuid       default gen_random_uuid() primary key,
  farm_id          uuid       references farms,
  user_id          uuid       references auth.users not null,
  top_crop         text       not null,
  top_crop_conf    int,
  drought_risk     int,
  flood_risk       int,
  forecast_rain    decimal(8,2),
  historical_rain  decimal(8,2),
  current_temp     decimal(5,1),
  all_crops        jsonb,       -- full ranked list as JSON
  news_sentiment   jsonb,       -- LLM output stored for audit
  weather_source   text,
  created_at       timestamptz default now()
);

-- ── INSURANCE POLICIES ────────────────────────────────────────
create table if not exists insurance_policies (
  id               uuid       default gen_random_uuid() primary key,
  user_id          uuid       references auth.users not null,
  farm_id          uuid       references farms,
  crop             text       not null,
  plan_name        text,
  premium_inr      decimal(10,2),
  max_payout_inr   decimal(10,2),
  coverage_acres   decimal(8,2),
  trigger_rain_mm  decimal(6,2),
  trigger_temp_c   decimal(5,1),
  status           text       default 'active', -- active | triggered | expired | cancelled
  activated_at     timestamptz default now(),
  expires_at       timestamptz,
  created_at       timestamptz default now()
);

-- ── PAYOUTS ───────────────────────────────────────────────────
create table if not exists payouts (
  id               uuid       default gen_random_uuid() primary key,
  policy_id        uuid       references insurance_policies,
  user_id          uuid       references auth.users not null,
  amount_inr       decimal(10,2) not null,
  trigger_reason   text,
  trigger_value    text,
  tx_hash          text,       -- blockchain tx hash
  status           text        default 'completed',
  processed_at     timestamptz default now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
alter table farms                enable row level security;
alter table recommendations      enable row level security;
alter table insurance_policies   enable row level security;
alter table payouts              enable row level security;

-- Policies — users only see their own data
create policy "Users manage own farms"
  on farms for all using (auth.uid() = user_id);

create policy "Users view own recommendations"
  on recommendations for all using (auth.uid() = user_id);

create policy "Users view own policies"
  on insurance_policies for all using (auth.uid() = user_id);

create policy "Users view own payouts"
  on payouts for all using (auth.uid() = user_id);

-- ── INDEXES ───────────────────────────────────────────────────
create index if not exists idx_farms_user          on farms(user_id);
create index if not exists idx_recommendations_user on recommendations(user_id);
create index if not exists idx_policies_user        on insurance_policies(user_id);
create index if not exists idx_payouts_policy       on payouts(policy_id);

-- ── FARMER PROFILES ───────────────────────────────────────────
create table if not exists farmer_profiles (
  id              uuid references auth.users primary key,
  phone           text unique not null,
  full_name       text,
  village         text,
  district        text,
  state           text,
  preferred_lang  text default 'en',
  avatar_seed     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table farmer_profiles enable row level security;

create policy "Users manage own profile"
  on farmer_profiles for all using (auth.uid() = id);

create index if not exists idx_profiles_phone on farmer_profiles(phone);
