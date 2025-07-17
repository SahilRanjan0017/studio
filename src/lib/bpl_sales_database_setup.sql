-- This script sets up the necessary database objects for the BPL Sales dashboard.
-- Running this in your Supabase SQL Editor will create the table, add sample data,
-- and create the view required by the application.

-- 1. Create the base table 'bpl_sales'
-- This table will store the raw score events for each person.
DROP TABLE IF EXISTS public.bpl_sales;
CREATE TABLE public.bpl_sales (
    id SERIAL PRIMARY KEY,
    record_date DATE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- e.g., 'OS', 'IS', 'CP_OS', 'CP_IS'
    manager_name TEXT,
    city TEXT,
    score_change INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert some sample data into the 'bpl_sales' table
-- This provides initial data so the leaderboard is not empty.
-- You can replace this with your actual data.
INSERT INTO public.bpl_sales (record_date, name, role, manager_name, city, score_change) VALUES
-- Day 1 Data
('2024-07-20', 'Amit Sharma', 'OS', 'Rajesh Kumar', 'Delhi', 10),
('2024-07-20', 'Priya Singh', 'OS', 'Rajesh Kumar', 'Delhi', 5),
('2024-07-20', 'Karan Verma', 'IS', 'Sunita Gupta', 'Mumbai', 6),
('2024-07-20', 'Sneha Reddy', 'IS', 'Sunita Gupta', 'Mumbai', 4),
('2024-07-20', 'Rohan Bose', 'CP_OS', 'Vikram Rathore', 'Bangalore', 12),
('2024-07-20', 'Meera Iyer', 'CP_IS', 'Anjali Desai', 'Bangalore', 8),
-- Day 2 Data
('2024-07-21', 'Amit Sharma', 'OS', 'Rajesh Kumar', 'Delhi', 5),
('2024-07-21', 'Karan Verma', 'IS', 'Sunita Gupta', 'Mumbai', 2),
('2024-07-21', 'Rohan Bose', 'CP_OS', 'Vikram Rathore', 'Bangalore', -2),
('2024-07-21', 'Meera Iyer', 'CP_IS', 'Anjali Desai', 'Bangalore', 6),
('2024-07-21', 'Vikas Patel', 'OS', 'Rajesh Kumar', 'Pune', 8),
('2024-07-21', 'Aditi Rao', 'CP_OS', 'Vikram Rathore', 'Pune', 10);


-- 3. Create or replace the 'sale_view'
-- This view processes the raw data from 'bpl_sales' to calculate daily and cumulative scores.
-- The application queries this view directly.
DROP VIEW IF EXISTS public.sale_view;
CREATE VIEW public.sale_view AS
WITH daily_scores AS (
    SELECT
        s.record_date,
        s.name,
        s.role,
        s.manager_name,
        s.city,
        SUM(s.score_change) AS daily_score
    FROM
        public.bpl_sales s
    GROUP BY
        s.record_date,
        s.name,
        s.role,
        s.manager_name,
        s.city
), cumulative_scores AS (
    SELECT
        ds.record_date,
        ds.name,
        ds.role,
        ds.manager_name,
        ds.city,
        ds.daily_score,
        SUM(ds.daily_score) OVER (
            PARTITION BY ds.name, ds.role, ds.manager_name, ds.city
            ORDER BY ds.record_date
        ) AS cumulative_score
    FROM
        daily_scores ds
)
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

-- After running this, your database will be set up correctly
-- and the BPL Sales dashboard should display the sample data.
