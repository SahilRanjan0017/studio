create view public.sale_view as
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