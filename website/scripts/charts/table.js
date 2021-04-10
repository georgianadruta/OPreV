var dataSet = [
    [ "Belgium","47.5","49.3","48.7" ],
    [ "Bulgaria","50.8","54.0","59.5" ],
    [ "Germany","52.1","52.1",":" ],
    [ "Czechia","56.6","56.8","62.3" ],
    [ "Denmark",":","47.7",":" ],
    [ "Estonia","51.0","53.9","56.1" ],
    [ "Ireland",":","55.7","57.1" ],
    [ "Greece","56.3","56.7",":" ],
    [ "Spain","53.0","52.4","51.7"],
    [ "France","43.6","47.2","46.1" ],
    [ "Croatia",":","57.4","60.9" ],
    [ "Italy",":","44.9",":" ],
    [ "Cyprus","51.3","48.3","52.7" ],
    [ "Latvia","54.9","56.5","57.0" ],
    [ "Lithuania",":","55.6","56.2" ],
    [ "Luxemburg",":","48.0","49.3" ],
    [ "Hungary","54.9","55.2","56.3" ],
    [ "Malta","59.7","61.0","62.2"],
    [ "Netherlands",":","49.4","47.0"],
    [ "Austria","49.3","48.0","50.0"],
    [ "Poland","54.0","54.7","56.0" ],
    [ "Portugal",":","53.6","53.3" ],
    [ "Romania","50.3","55.8","62.9" ],
    [ "Slovenia","56.6","56.6","52.5" ],
    [ "Slovakia","50.7","54.2","54.5" ],
    [ "Finland",":","54.7","61.1" ],
    [ "Sweden",":","49.9",":" ],
    [ "Iceland",":","57.6",":" ],
    [ "Norway",":","49.3","50.4" ],
    [ "Switzerland",":",":",":" ],
    [ "United Kingdom",":","55.7","56.1" ],
    [ "North Macedonia",":",":","55.7" ],
    [ "Serbia",":",":","49.5" ],
    [ "Turkey","50.6","56.5",":" ]
];
    $(document).ready(function() {

        table = $('#example').DataTable( {
            data: dataSet,
        columns: [
            { title: "Country" },
            { title: "2008" },
            { title: "2014" },
            { title: "2017" }
        ]
        } );
    
        $(table)( {
        paging: false,
        destroy: true,
        searching: false,
        responsive: true
    } );
});