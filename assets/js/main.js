// State management
let appState = {
    students: [],
    filteredStudents: [],
    currentPage: 1,
    entriesPerPage: 50,
    currentSort: { column: null, direction: "asc" },
}

const updateState = (newState) => {
    appState = { ...appState, ...newState }
}

const getState = () => ({ ...appState })

const setupSidebar = () => {
    const currentPage = window.location.pathname.split("/").pop()

    // Set active link
    document.querySelectorAll("aside ul li a").forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.closest("li").classList.add("active-link")
        }
    })

    // Sidebar toggle functionality
    const toggleSidebar = document.getElementById("toggleSidebar")
    const closeSidebar = document.getElementById("closeSidebar")
    const overlay = document.getElementById("overlay")
    const aside = document.querySelector("aside")

    const openSidebar = () => {
        aside.style.left = "0px"
        overlay.style.display = "block"
        document.body.style.overflow = "hidden"
    }

    const closeSidebarFn = () => {
        aside.style.left = "-100vw"
        overlay.style.display = "none"
        document.body.style.overflow = "auto"
    }

    toggleSidebar.addEventListener("click", openSidebar)
    closeSidebar.addEventListener("click", closeSidebarFn)
    overlay.addEventListener("click", closeSidebarFn)
}

const populateBuildingFilter = (students) => {
    const buildingFilter = document.getElementById("buildingFilter")
    const uniqueBuildings = [...new Set(students.map((student) => student.building))]

    uniqueBuildings.forEach((building) => {
        const option = document.createElement("option")
        option.value = building
        option.textContent = building
        buildingFilter.appendChild(option)
    })
}

const setupEventListeners = () => {
    // Building filter
    document.getElementById("buildingFilter").addEventListener("change", (e) => {
        filterByBuilding(e.target.value)
    })

    // Search input
    document.getElementById("searchInput").addEventListener("input", (e) => {
        search(e.target.value)
    })

    // Entries per page
    document.getElementById("entriesPerPage").addEventListener("change", (e) => {
        updateState({
            entriesPerPage: Number.parseInt(e.target.value),
            currentPage: 1,
        })
        renderTable()
    })
}

const filterByBuilding = (building) => {
    const { students } = getState()
    const filteredStudents = building ? students.filter((student) => student.building === building) : [...students]

    updateState({ filteredStudents, currentPage: 1 })
    renderTable()
}

const search = (query) => {
    const { students } = getState()
    const searchTerm = query.toLowerCase()

    let filteredStudents
    if (searchTerm) {
        filteredStudents = students.filter(
            (student) =>
                student.name.toLowerCase().includes(searchTerm) || student.building.toLowerCase().includes(searchTerm),
        )
    } else {
        const buildingFilter = document.getElementById("buildingFilter").value
        filteredStudents = buildingFilter
            ? students.filter((student) => student.building === buildingFilter)
            : [...students]
    }

    updateState({ filteredStudents, currentPage: 1 })
    renderTable()
}

const renderTable = () => {
    const { filteredStudents, currentPage, entriesPerPage } = getState()
    const tbody = document.querySelector("#example tbody")
    tbody.innerHTML = ""

    const totalEntries = filteredStudents.length
    const startIndex = entriesPerPage === -1 ? 0 : (currentPage - 1) * entriesPerPage
    const endIndex = entriesPerPage === -1 ? totalEntries : startIndex + entriesPerPage
    const currentPageData = filteredStudents.slice(startIndex, endIndex)

    currentPageData.forEach((student, index) => {
        const row = document.createElement("tr")
        const serialNumber = startIndex + index + 1

        row.innerHTML = `
      <td>${serialNumber}</td>
      <td>${student.name}</td>
      <td>${student.building}</td>
    `
        tbody.appendChild(row)
    })

    renderPagination()
    renderTableInfo()
}

const renderPagination = () => {
    const { filteredStudents, currentPage, entriesPerPage } = getState()
    const paginationContainer = document.getElementById("pagination")
    paginationContainer.innerHTML = ""

    if (entriesPerPage === -1) return

    const totalPages = Math.ceil(filteredStudents.length / entriesPerPage)
    if (totalPages <= 1) return

    const pagination = document.createElement("nav")
    pagination.className = "pagination-container"
    const ul = document.createElement("ul")
    ul.className = "pagination"

    const prevLi = createPaginationButton("Previous", currentPage - 1, currentPage === 1)
    ul.appendChild(prevLi)

    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    for (let i = startPage; i <= endPage; i++) {
        const li = createPaginationButton(i.toString(), i, false, i === currentPage)
        ul.appendChild(li)
    }

    const nextLi = createPaginationButton("Next", currentPage + 1, currentPage === totalPages)
    ul.appendChild(nextLi)

    pagination.appendChild(ul)
    paginationContainer.appendChild(pagination)
}

const createPaginationButton = (text, page, disabled = false, active = false) => {
    const li = document.createElement("li")
    li.className = `page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`
    li.innerHTML = `<a class="page-link paginate_button ${active ? "current" : ""}" href="#">${text}</a>`

    if (!disabled && !active) {
        li.addEventListener("click", (e) => {
            e.preventDefault()
            updateState({ currentPage: page })
            renderTable()
        })
    }

    return li
}

const renderTableInfo = () => {
    const { filteredStudents, currentPage, entriesPerPage } = getState()
    const tableInfo = document.getElementById("tableInfo")
    const totalEntries = filteredStudents.length

    if (entriesPerPage === -1) {
        tableInfo.textContent = `Showing all ${totalEntries} entries`
    } else {
        const startIndex = (currentPage - 1) * entriesPerPage + 1
        const endIndex = Math.min(currentPage * entriesPerPage, totalEntries)
        tableInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`
    }
}

const setupExportButtons = () => {
    document.getElementById("exportExcel").addEventListener("click", exportToExcel)
    document.getElementById("exportPDF").addEventListener("click", exportToPDF)
    document.getElementById("exportImage").addEventListener("click", exportToImage)
}

const exportToExcel = () => {
    const { filteredStudents } = getState()
    const XLSX = window.XLSX
    const data = filteredStudents.map((student, index) => ({
        "Sr#": index + 1,
        Name: student.name,
        Building: student.building,
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students")
    XLSX.writeFile(wb, "rehmat_masjid_students.xlsx")
}

const exportToPDF = () => {
    const { filteredStudents } = getState()
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Rehmat Masjid Student List", 20, 20)

    let yPosition = 40
    doc.setFontSize(12)
    doc.text("Sr#", 20, yPosition)
    doc.text("Name", 50, yPosition)
    doc.text("Building", 120, yPosition)

    yPosition += 10

    filteredStudents.forEach((student, index) => {
        if (yPosition > 280) {
            doc.addPage()
            yPosition = 20
        }

        doc.text((index + 1).toString(), 20, yPosition)
        doc.text(student.name, 50, yPosition)
        doc.text(student.building, 120, yPosition)
        yPosition += 8
    })

    doc.save("rehmat_masjid_students.pdf")
}

const exportToImage = () => {
    const html2canvas = window.html2canvas
    html2canvas(document.getElementById("example")).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = imgData
        link.download = "rehmat_masjid_students.png"
        link.click()
    })
}

const initializeApp = () => {
    // Determine which data to use based on the page
    const currentPage = window.location.pathname.split("/").pop()
    let initialData = window.students || []

    if (currentPage === "4-mah-sathi.html") {
        initialData = window.fourthMonthSathi || []
    }

    // Initialize state
    updateState({
        students: initialData,
        filteredStudents: [...initialData],
    })

    // Setup all functionality
    setupSidebar()
    populateBuildingFilter(getState().students)
    setupEventListeners()
    renderTable()
    setupExportButtons()
}

document.addEventListener("DOMContentLoaded", initializeApp)
