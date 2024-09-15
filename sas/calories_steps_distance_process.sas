/*  generating hourly calories data summrised by sum(calories) */

proc sql;
    create table fitlib.hourly_aggregated as
    select 
        intnx('hour', dateTime, 0) as HourBlock format=datetime19.,  /* 将dateTime对齐到小时 */
        sum(steps) as TotalSteps,
        sum(distance) as TotalDistance,
        sum(calories) as TotalCalories
    from fitlib.combined2
    group by HourBlock;
quit;

/* generating daily calories data summrised by sum(calories) */


proc sql;
    create table fitlib.daily_aggregated as
    select 
        datepart(dateTime) as DayBlock format=date9., /* 使用datepart提取日期部分 */
        sum(steps) as TotalSteps,
        sum(distance) as TotalDistance,
        sum(calories) as TotalCalories
    from fitlib.combined2
    group by DayBlock;
quit;
/*  changing distance from centimeter to km */
data fitlib.daily_aggregated_renamed;
    set fitlib.daily_aggregated;
    dateTime = DayBlock; /* 更改DayBlock为dateTime */
    steps = TotalSteps; /* 更改TotalSteps为steps */
    calories = TotalCalories; /* 更改TotalCalories为calories */
    distance = TotalDistance / 100000; /* 将distance从厘米转换为公里 */
    format dateTime date9.;
    drop TotalSteps TotalDistance TotalCalories DayBlock; /* 删除原始列 */
run;
