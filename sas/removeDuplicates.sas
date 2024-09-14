proc sort data=fitlib.sleep out=fitlib.sleep_clean nodupkey;
    by startTime;
run;
