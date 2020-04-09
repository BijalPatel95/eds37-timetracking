const query = {
    category: `with temp as (
        select tt.projectName templateName,tv.trackingPeriod,ti.value projectName, tf.name fieldName, tf.timeTracker,
        iif(tfo.optionValue IS NULL, Cast (tv.value as nvarchar), tfo.optionValue) fieldValue,
        tv.username from timeTrackingInputs ti
        INNER JOIN timeTrackingTemplate tt ON tt.id = ti.templateId and tt.fund = 'EDS37'
        INNER JOIN timeTrackingValues tv ON ti.id = tv.inputId and tv.trackingPeriod = (select max(trackingPeriod) from timeTrackingValues  where username in (select username from userFund where fund= 'EDS37'))
        INNER JOIN timeTrackingFields tf ON tv.fieldId = tf.id
        LEFT JOIN timeTrackingFieldsOption tfo ON tf.id = tfo.fieldId AND CAST(tv.value AS nvarchar) = CAST(tfo.id AS nvarchar)
        ), total as (
        select 'Total' as category, 4 as sortOrder,
        sum(Cast(h.fieldValue as float)) as timeSpentThisWeek, '100%' shareOfTimeSpend from temp d
        LEFT JOIN temp h ON d.templateName = h.templateName AND d.projectName = h.projectName AND d.trackingPeriod = h.trackingPeriod AND h.timeTracker = 1
        where d.fieldName = 'Direction' or (d.templateName = 'Non Research' and d.timeTracker = 0)
        ), summary as(
        select 
        case when d.fieldValue != 'Long' and d.fieldValue != 'Short' then 'Others' else d.fieldValue end as category, case when max(d.fieldValue) = 'Long' then 1 when max(d.fieldValue) = 'Short' then 2 else 3 end  as sortOrder,
        sum(Cast(h.fieldValue as float)) as timeSpentThisWeek from temp d
        LEFT JOIN temp h ON d.templateName = h.templateName AND d.projectName = h.projectName AND d.trackingPeriod = h.trackingPeriod AND h.timeTracker = 1
        where d.fieldName = 'Direction' or (d.templateName = 'Non Research' and d.timeTracker = 0)
        group by case when d.fieldValue != 'Long' and d.fieldValue != 'Short' then 'Others' else d.fieldValue end
        ), finalOutput as (
        select *, case when (select timeSpentThisWeek from total) = 0 then '0%' else cast(round(timeSpentThisWeek / (select timeSpentThisWeek from total) * 100,0) as nvarchar)+'%' end  as  shareOfTimeSpend from summary
        UNION 
        select category, sortOrder,timeSpentThisWeek, case when  (select timeSpentThisWeek from total) = 0 then '0%' else shareOfTimeSpend end as shareOfTimeSpend from total
        
        )
        
        select *,case when (ROW_NUMBER() over (order by sortOrder asc))%2 = 0 then 'border: 1px solid white !important; background:#dae5f4' else 'border: 1px solid white !important; background:#b8d1f3' end as style from finalOutput
        order by sortOrder`
    ,
    sector: `with temp1 as (
        select tt.projectName templateName,tv.trackingPeriod,ti.value projectName, tf.name fieldName, tf.timeTracker, 
        iif(tfo.optionValue IS NULL, Cast (tv.value as nvarchar), tfo.optionValue) fieldValue,
        tv.username from timeTrackingInputs ti
        INNER JOIN timeTrackingTemplate tt ON tt.id = ti.templateId and tt.fund = 'EDS37' and tt.projectName = 'Research'
        INNER JOIN timeTrackingValues tv ON ti.id = tv.inputId and tv.trackingPeriod = (select max(trackingPeriod) from timeTrackingValues  where username in (select username from userFund where fund= 'EDS37'))
        INNER JOIN timeTrackingFields tf ON tv.fieldId = tf.id
        LEFT JOIN timeTrackingFieldsOption tfo ON tf.id = tfo.fieldId AND CAST(tv.value AS nvarchar) = CAST(tfo.id AS nvarchar)
        ), gicsMappingTimeTracking as (
        select fd.sector, case when d.fieldValue != 'Long' and d.fieldValue != 'Short' then 'Others' else d.fieldValue end as category, d.projectName,
        Cast(h.fieldValue as float) as timeSpentThisWeek, h.username, h.fieldName
        from temp1 d
        LEFT JOIN temp1 h ON d.templateName = h.templateName AND d.projectName = h.projectName AND d.trackingPeriod = h.trackingPeriod AND h.timeTracker = 1
        Inner JOIN financial_data fd on d.projectName = fd.ticker
        where d.fieldName = 'Direction' or (d.templateName = 'Non Research' and d.timeTracker = 0) 
        ),temp as (
        select tt.projectName templateName,tv.trackingPeriod,ti.value projectName, tf.name fieldName, tf.timeTracker,
        iif(tfo.optionValue IS NULL, Cast (tv.value as nvarchar), tfo.optionValue) fieldValue,
        tv.username from timeTrackingInputs ti
        INNER JOIN timeTrackingTemplate tt ON tt.id = ti.templateId and tt.fund = 'EDS37'
        INNER JOIN timeTrackingValues tv ON ti.id = tv.inputId and tv.trackingPeriod = (select max(trackingPeriod) from timeTrackingValues  where username in (select username from userFund where fund= 'EDS37'))
        INNER JOIN timeTrackingFields tf ON tv.fieldId = tf.id
        LEFT JOIN timeTrackingFieldsOption tfo ON tf.id = tfo.fieldId AND CAST(tv.value AS nvarchar) = CAST(tfo.id AS nvarchar)
        ), totalTemp as (
        select 'Total' as category, 4 as sortOrder,
        sum(Cast(h.fieldValue as float)) as timeSpentThisWeek, '100%' shareOfTimeSpend from temp d
        LEFT JOIN temp h ON d.templateName = h.templateName AND d.projectName = h.projectName AND d.trackingPeriod = h.trackingPeriod AND h.timeTracker = 1
        where d.fieldName = 'Direction' or (d.templateName = 'Non Research' and d.timeTracker = 0)
        ), summaryTemp as(
        select 
        case when d.fieldValue != 'Long' and d.fieldValue != 'Short' then 'Others' else d.fieldValue end as category, case when max(d.fieldValue) = 'Long' then 1 when max(d.fieldValue) = 'Short' then 2 else 3 end  as sortOrder,
        sum(Cast(h.fieldValue as float)) as timeSpentThisWeek from temp d
        LEFT JOIN temp h ON d.templateName = h.templateName AND d.projectName = h.projectName AND d.trackingPeriod = h.trackingPeriod AND h.timeTracker = 1
        where d.fieldName = 'Direction' or (d.templateName = 'Non Research' and d.timeTracker = 0)
        group by case when d.fieldValue != 'Long' and d.fieldValue != 'Short' then 'Others' else d.fieldValue end
        ), finalOutputTemp as (
        select *, case when (select timeSpentThisWeek from totalTemp) = 0 then '0%' else cast(round(timeSpentThisWeek / (select timeSpentThisWeek from totalTemp) * 100,0) as nvarchar)+'%' end  as  shareOfTimeSpend from summaryTemp
        UNION 
        select category, sortOrder,timeSpentThisWeek, case when  (select timeSpentThisWeek from totalTemp) = 0 then '0%' else shareOfTimeSpend end as shareOfTimeSpend from totalTemp
        
        )
		,tableSummaryTemp as (
		 select *,case when (ROW_NUMBER() over (order by sortOrder asc))%2 = 0 then 'border: 1px solid white !important; background:#dae5f4' else 'border: 1px solid white !important; background:#b8d1f3' end as style from finalOutputTemp
		),
		 total as (
        select sum(timeSpentThisWeek) as totalHours from gicsMappingTimeTracking
        ), gicsMappingTimeTrackingGroup as (
        select sector,
        case when (select case when timeSpentThisWeek is null then 0 else timeSpentThisWeek end from tableSummaryTemp where category = 'Long') = 0 then 0 else round(sum(case when category = 'Long' then timeSpentThisWeek else 0 end )/ (select case when timeSpentThisWeek is null then 0 else timeSpentThisWeek end from tableSummaryTemp where category = 'Long') * 100,1) end shareOfTimeSpendOnLongs,
        case when (select case when timeSpentThisWeek is null then 0 else timeSpentThisWeek end from tableSummaryTemp where category = 'Short') = 0 then 0 else round(sum(case when category = 'Short' then timeSpentThisWeek else 0 end )/ (select case when timeSpentThisWeek is null then 0 else timeSpentThisWeek end from tableSummaryTemp where category = 'Short') * 100,1) end shareOfTimeSpendOnShort,
        case when (select totalHours from total) = 0 then 0 else round((sum(case when category = 'Long' then timeSpentThisWeek else 0 end) + sum(case when category = 'Short' then timeSpentThisWeek else 0 end ))/ (select totalHours from total) * 100,0) end as shareOfTotalTimeSpend
        from gicsMappingTimeTracking
        group by sector
        ), finalOutput as (
        select sector, 
        cast(round(shareOfTimeSpendOnLongs,0) as nvarchar)+'%' 
        as shareOfTimeSpendOnLongs, cast(round(shareOfTimeSpendOnshort,0) as nvarchar)+'%' as shareOfTimeSpendOnShort, 
        cast(shareOfTotalTimeSpend as nvarchar)+'%' as shareOfTotalTimeSpend  
        from gicsMappingTimeTrackingGroup
        union
        select 'Total'as sector,
        case when (select totalHours from total) = 0 then '0%' else cast((select sum(shareOfTimeSpendOnLongs) from gicsMappingTimeTrackingGroup)as varchar)+'%' end as shareOfTimeSpendOnLongs,
        case when (select totalHours from total) = 0 then '0%' else cast((select sum(shareOfTimeSpendOnShort) from gicsMappingTimeTrackingGroup) as varchar)+'%' end as shareOfTimeSpendOnShort,
        case when (select totalHours from total) = 0 then '0%' else '100%' end as shareOfTotalTimeSpend
        from total
        )
        
        select *,case when (ROW_NUMBER() over (order by sector asc))%2 = 0 then 'border: 1px solid white !important; background:#dae5f4' else 'border: 1px solid white !important; background:#b8d1f3' end as style  from finalOutput



`
    ,
    noInputUsernames: `
    select firstname +' '+ lastName as username from userFund 
    where fund='EDS37' and username not in (
        select username from timeTrackingValues where trackingPeriod = (select max(trackingPeriod) from timeTrackingValues where username in (select username from userfund where fund = 'EDS37'))
    ) and username not in ('hound.eds','jcrusco','jsalinas','jauerbach','jsalinas','mventura','brian.sunshine')`
}

module.exports = query;