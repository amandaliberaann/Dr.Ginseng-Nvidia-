/* 修改fitlib.very_active_minutes fitlib.lightly_active_minutes fitlib.moderately_active_minutes */
/*           fitlib.sedentary_minutes value这列的相关名称用于后续merge table */

data fitlib.very_active_minutes; 
set fitlib.very_active_minutes;
rename value = very_active_minutes; 
run;
data fitlib.lightly_active_minutes; 
set fitlib.lightly_active_minutes;
rename value = lightly_active_minutes; 
run;
data fitlib.moderately_active_minutes; 
set fitlib.moderately_active_minutes;
rename value = moderately_active_minutes;
run;
data fitlib.sedentary_minutes; 
set fitlib.sedentary_minutes;
rename value = sedentary_minutes; 
run;


/* rename(dateTime = dateOfSleep) in sleep data set */
data fitlib.sleep_clean;
set fitlib.sleep_clean; /* 使用你的数据集名称 */
rename dateOfSleep = dateTime; /* 重命名操作 */
dateTime = dhms(dateTime, 0, 0, 0);
format dateTime datetime.; /* 更改显示格式 */
run;
/* combine all tables together together */

data combined;
    merge fitlib.very_active_minutes fitlib.lightly_active_minutes fitlib.moderately_active_minutes
          fitlib.sedentary_minutes fitlib.sleep_clean;
   
    by dateTime;
    
run;

proc print data=combined;
   title 'Data Set Combined';
run;
