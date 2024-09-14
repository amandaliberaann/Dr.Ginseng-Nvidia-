data fitlib.distance_clean; 
set fitlib.distance_clean;
rename value = distance; 
run;
data fitlib.steps_clean; 
set fitlib.steps_clean;
rename value = steps; 
run;
data fitlib.calories; 
set fitlib.calories;
rename value = calories;
run;


data fitlib.combined2;
    merge fitlib.calories fitlib.steps_clean fitlib.distance_clean ;
    by dateTime;
    
run;

proc print data=combined;
   title 'Data Set Combined';
run;
