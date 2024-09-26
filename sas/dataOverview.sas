/* Use PROC CONTENTS to extract variable details for all datasets in the work library */
proc contents data=work._all_ out=var_details(keep=memname name type length label);
run;

/* Sort the var_details dataset by MEMNAME so it can be grouped in the next step */
proc sort data=var_details;
    by memname;
run;

/* Use BY statement to display variable details grouped by dataset name (MEMNAME) */
proc print data=var_details;
    by memname;
    title "Variable Details for Each Dataset";
run;
