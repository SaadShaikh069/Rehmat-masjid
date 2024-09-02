$(document).ready(function () {
    var currentPage = window.location.pathname.split('/').pop();

    // Iterate over each <a> tag in the sidebar
    $('aside ul li a').each(function () {
        var href = $(this).attr('href');

        // Check if the href matches the current page
        if (href === currentPage) {
            // Change the color of the corresponding <li>
            $(this).closest('li').addClass('active-link');
        }
    });
    //sidebar toggle code 
    // $('#toggleSidebar').on('click', function () {
    //     $('aside').animate({
    //         left: $('aside').css('left') == '0px' ? '-100vw' : '0px'
    //     });
    // });
    // $('#closeSidebar').on('click',function(){
    //     $('aside').css({"left":"-100vw"});
    // })


    function toggleSidebar(isOpen) {
        $('aside').animate({ left: isOpen ? '0px' : '-100vw' }, 300, function () {
            $('#overlay').fadeToggle(isOpen);
            $('body').css('overflow', isOpen ? 'hidden' : 'auto');
        });
    }

    $('#toggleSidebar').on('click', function () {
        const isOpen = $('aside').css('left') !== '0px';
        toggleSidebar(isOpen);
    });

    $('#closeSidebar, #overlay').on('click', function () {
        toggleSidebar(false);
    });

    // Append rows to the table with indexing and student data
    students.forEach((val, index) => {
        $('#example').append('<tr><td>' + (index + 1) + '</td><td>' + val.name + '</td><td>' + val.building + '</td></tr>');
    });

    // Initialize DataTable with indexing and other configurations
    var table = $('#example').DataTable({
        "dom": 'Btp', // Include Buttons in the DataTable
        "pageLength": 50, // Default page length can be set here if needed
        "ordering": false,
        "columnDefs": [
            { "orderable": false, "targets": 0 } // Disable ordering on the indexing column
        ],
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                className: 'btn btn-success'
            },
            {
                extend: 'pdf',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                className: 'btn btn-danger'
            }, {
                text: '<i class="fas fa-image"></i> Download as Image',
                className: 'btn btn-primary mt-3 w-100',
                action: function (e, dt, node, config) {
                    html2canvas(document.getElementById('example')).then(function (canvas) {
                        var imgData = canvas.toDataURL('image/png'); // Convert canvas to PNG image
                        var link = document.createElement('a'); // Create a download link
                        link.href = imgData; // Set link URL to image data
                        link.download = 'table_image.png'; // Set the default download filename
                        link.click(); // Trigger the download
                    });
                }
            }
        ]
    });

    // Populate the building filter dropdown with unique building names from the students data
    var uniqueBuildings = [];
    students.forEach((val) => {
        var building = val.building;
        if (!uniqueBuildings.includes(building)) {
            uniqueBuildings.push(building);
            $('#buildingFilter').append('<option value="' + building + '">' + building + '</option>');
        }
    });

    // Filter the table based on the selected building
    $('#buildingFilter').on('change', function () {
        var selectedBuilding = $(this).val();
        if (selectedBuilding) {
            // Escape any special characters in the building name for the regex
            var escapedBuilding = selectedBuilding.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            table.column(2).search('^' + escapedBuilding + '$', true, false).draw(); // Adjust index for building column
        } else {
            table.column(2).search('').draw(); // Adjust index for building column
        }
    });



});