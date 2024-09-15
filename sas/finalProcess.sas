/* Final merge */
data fitlib.combined_daily;
    merge fitlib.daily_aggregated_final fitlib.combined1 ;
    by dateTime;   
run;

/*Fixing format and adding participant data*/
data fitlib.combined_daily;
    set fitlib.combined_daily;  
    participant_id = "01";  
    gender = "male"; 
    height = 195;  
run;
/*Check the mean, median, standard deviation, lower quartile, upper quartile of the steps, calories, distance*/

proc means data=fitlib.combined_daily n mean median std 
                q1 q3 min max maxdec=2;
	var steps calories distance ;
run;


/*Check the mean, median, standard deviation, lower quartile, and upper quartile of the very_active_minutes lightly_active_minutes moderately_active_minutes
sedentary_minutes*/

proc means data=fitlib.combined_daily n mean median std 
                q1 q3 min max maxdec=2;
	var very_active_minutes lightly_active_minutes moderately_active_minutes sedentary_minutes ;
run;
/* Data Distribution*/
ods graphics on /width=600 ;
ods select histogram probplot;
proc univariate data=fitlib.combined_daily;
	var steps calories distance ;
	histogram steps calories distance /normal (mu=est sigma=est) ;
	probplot steps calories distance /normal (mu=est sigma=est);
run;
