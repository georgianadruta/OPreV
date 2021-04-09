var dataSet = [
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ],
    [ "Romania","99","89","87" ]
];
    $(document).ready(function() {
    $('#example').DataTable( {
        data: dataSet,
        columns: [
            { title: "Country" },
            { title: "2008" },
            { title: "2014" },
            { title: "2017" }
        ]
    } );
} );