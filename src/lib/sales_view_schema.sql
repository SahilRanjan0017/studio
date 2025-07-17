-- src/lib/sales_view_schema.sql
-- This SQL statement creates the `sales_team_performance_view` used by the BPL Sales Dashboard.
-- This view should be created in your Supabase SQL Editor.
-- It aggregates daily scores and calculates a running cumulative total for each sales participant.

CREATE OR REPLACE VIEW public.sales_team_performance_view AS
WITH daily_scores AS (
    -- Step 1: Aggregate scores for each person, each day
    SELECT
        s.record_date,
        s.name,
        s.role,
        s.manager_name,
        s.city,
        SUM(s.score_change) AS daily_score
    FROM
        public.sales_score_tracking s
    GROUP BY
        s.record_date,
        s.name,
        s.role,
        s.manager_name,
        s.city
),
cumulative_scores AS (
    -- Step 2: Calculate the running total score for each person over time
    SELECT
        ds.record_date,
        ds.name,
        ds.role,
        ds.manager_name,
        ds.city,
        ds.daily_score,
        SUM(ds.daily_score) OVER (PARTITION BY ds.name, ds.role, ds.manager_name, ds.city ORDER BY ds.record_date ASC) AS cumulative_score
    FROM
        daily_scores ds
)
-- Step 3: Select all the calculated fields for the final view
SELECT
    cs.record_date,
    cs.name,
    cs.role,
    cs.manager_name,
    cs.city,
    cs.daily_score,
    cs.cumulative_score
FROM
    cumulative_scores cs
ORDER BY
    cs.record_date DESC,
    cs.cumulative_score DESC;

-- HOW TO USE:
-- 1. Navigate to the SQL Editor in your Supabase project dashboard.
-- 2. Copy the entire content of this file.
-- 3. Paste it into a new query tab in the SQL Editor.
-- 4. Click "Run" to create the view.
-- 5. Ensure you have a `sales_score_tracking` table with columns like `record_date`, `name`, `role`, `manager_name`, `city`, and `score_change`.
-- 6. The website will now be able to query this view to populate the BPL Sales leaderboard.
