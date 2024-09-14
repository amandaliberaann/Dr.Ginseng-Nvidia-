proc sort data=fitlib.sleep out=fitlib.sleep_clean nodupkey;
    by startTime;
run;

proc sort data=fitlib.steps out=fitlib.steps_clean nodupkey;
    by dateTime;
run;

proc sort data=fitlib.distance out=fitlib.distance_clean nodupkey;
    by dateTime;
run;
