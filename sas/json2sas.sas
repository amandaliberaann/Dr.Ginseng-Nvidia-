%macro json_to_sas(base_input_path, dataset_output_lib, folder_list, file_list);

    /* Loop through all folders */
    %let i = 1;
    %let folder = %scan(&folder_list, &i);

    %do %while(&folder ne );

        /* Loop through all JSON files in each folder */
        %let j = 1;
        %let json_file = %scan(&file_list, &j);

        %do %while(&json_file ne );

            /* Construct the full JSON file input path */
            %let json_input_path = &base_input_path/&folder/&json_file..json;

            /* Debug: Print out the current file being processed */
            %put NOTE: Processing file: &json_input_path;

            /* Check if the file exists before proceeding */
            %if %sysfunc(fileexist(&json_input_path)) %then %do;

                /* Reassign the libname to ensure it can be read multiple times */
                libname myjson clear; /* Clear the previous assignment */
                filename fitFile "&json_input_path";
                libname myjson JSON fileref=fitFile;

                /* Construct the SAS dataset name: folder_file_name */
                %let dataset_name = &dataset_output_lib..&folder._&json_file;

                /* Convert the JSON file to a SAS dataset */
                data &dataset_name;
                    set myjson.root;
                run;

                /* Debug: Print the first 10 observations of the new SAS dataset */
                proc print data=&dataset_name (obs=10);
                run;

            %end;
            %else %do;
                %put ERROR: The file &json_input_path does not exist.;
            %end;

            /* Move on to the next JSON file */
            %let j = %eval(&j + 1);
            %let json_file = %scan(&file_list, &j);

        %end;

        /* Move on to the next folder */
        %let i = %eval(&i + 1);
        %let folder = %scan(&folder_list, &i);

    %end;

%mend;

/* Example: specify base paths, folders p01 to p16, and JSON file list */
%json_to_sas(
    /export/viya/homes/xgao4@our.ecu.edu.au/FitProject/Fitdata, /* Base input path */
    work, /* Output libname for SAS datasets */
    p01, /* Folder list */
    distance exercise lightly_active_minutes moderately_active_minutes resting_heart_rate sedentary_minutes sleep steps time_in_heart_rate_zones very_active_minutes /* File list */
);


