-- This SQL code defines a view named 'sale_view' to aggregate and calculate scores
-- for the BPL Sales dashboard.
-- To use this, you must have a table named 'bpl_sales' with the required columns.

-- 1. Create your raw data table (if it doesn't exist)
-- Example:
-- CREATE TABLE public.bpl_sales (
--   id SERIAL PRIMARY KEY,
--   record_date DATE NOT NULL,
--   name TEXT NOT NULL,
--   role TEXT NOT NULL, -- e.g., 'OS', 'IS', 'ME'
--   manager_name TEXT,
--   city TEXT,
--   score_change INTEGER NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- 2. Run the CREATE VIEW statement below in your Supabase SQL Editor.

-- This view calculates daily scores and then computes a cumulative score over time
-- for each participant, partitioned by their name, role, manager, and city.

create or replace view public.sale_view as
with
  daily_scores as (
    select
      s.record_date,
      s.name,
      s.role,
      s.manager_name,
      s.city,
      sum(s.score_change) as daily_score
    from
      bpl_sales s
    group by
      s.record_date,
      s.name,
      s.role,
      s.manager_name,
      s.city
  ),
  cumulative_scores as (
    select
      ds.record_date,
      ds.name,
      ds.role,
      ds.manager_name,
      ds.city,
      ds.daily_score,
      sum(ds.daily_score) over (
        partition by
          ds.name,
          ds.role,
          ds.manager_name,
          ds.city
        order by
          ds.record_date
      ) as cumulative_score
    from
      daily_scores ds
  )
select
  cs.record_date,
  cs.name,
  cs.role,
  cs.manager_name,
  cs.city,
  cs.daily_score,
  cs.cumulative_score
from
  cumulative_scores cs
order by
  cs.record_date desc,
  cs.cumulative_score desc;
