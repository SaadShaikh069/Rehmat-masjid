$(document).ready(function () {
    var currentPage = window.location.pathname.split('/').pop();

    // Sidebar active link
    $('aside ul li a').each(function () {
        var href = $(this).attr('href');
        if (href === currentPage) {
            $(this).closest('li').addClass('active-link');
        }
    });

    // Sidebar toggle
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

    // Append student data (without indexing)
    students.forEach((val) => {
        $('#example tbody').append('<tr><td></td><td>' + val.name + '</td><td>' + val.building + '</td></tr>');
    });

    // Initialize DataTable
    var table = $('#example').DataTable({
        dom: 'Btp',
        pageLength: 50,
        ordering: false,
        columnDefs: [
            { orderable: false, targets: 0 } // disable sort on Sr#
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
            },
            {
                text: '<i class="fas fa-image"></i> Download as Image',
                className: 'btn btn-primary mt-3 w-100',
                action: function () {
                    html2canvas(document.getElementById('example')).then(function (canvas) {
                        var imgData = canvas.toDataURL('image/png');
                        var link = document.createElement('a');
                        link.href = imgData;
                        link.download = 'table_image.png';
                        link.click();
                    });
                }
            }
        ],
        drawCallback: function (settings) {
            var api = this.api();
            var startIndex = api.page.info().start;
            api.column(0, { page: 'current' }).nodes().each(function (cell, i) {
                cell.innerHTML = startIndex + i + 1;
            });
        }
    });

    // Populate building filter
    var uniqueBuildings = [];
    students.forEach((val) => {
        if (!uniqueBuildings.includes(val.building)) {
            uniqueBuildings.push(val.building);
            $('#buildingFilter').append('<option value="' + val.building + '">' + val.building + '</option>');
        }
    });

    // Filter by building
    $('#buildingFilter').on('change', function () {
        var selectedBuilding = $(this).val();
        if (selectedBuilding) {
            var escaped = selectedBuilding.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            table.column(2).search('^' + escaped + '$', true, false).draw();
        } else {
            table.column(2).search('').draw();
        }
    });
});
