// Global variables for 4 Mah Sathi page
let currentData = []
let filteredData = []
let currentPage = 1
let itemsPerPage = 25

// Import html2canvas
const html2canvas = window.html2canvas

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    initializeApp()
    setupEventListeners()
    loadData()
})

// Initialize application
function initializeApp() {
    // No building filter needed for this page
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById("searchInput").addEventListener("input", handleSearch)
    document.getElementById("perPageSelect").addEventListener("change", handlePerPageChange)

    document.addEventListener("click", (e) => {
        const sidebar = document.getElementById("sidebar")
        const hamburger = e.target.closest('[onclick="toggleSidebar()"]')

        if (!sidebar.contains(e.target) && !hamburger && sidebar.classList.contains("show")) {
            if (window.innerWidth <= 768) {
                toggleSidebar()
            }
        }
    })
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar")
    sidebar.classList.toggle("show")
}

function loadData() {
    showLoading()

    setTimeout(() => {
        try {
            currentData = window.fourthMonthSathi || []

            if (currentData.length === 0) {
                console.log("No data found for fourthMonthSathi")
            }

            filteredData = [...currentData]
            currentPage = 1

            renderTable()
            renderPagination()
            updateInfo()
        } catch (error) {
            console.error("Error loading data:", error)
        } finally {
            hideLoading()
        }
    }, 300)
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase()
    filteredData = currentData.filter((item) => {
        return item.name.toLowerCase().includes(searchTerm)
    })

    currentPage = 1
    renderTable()
    renderPagination()
    updateInfo()
}

function handlePerPageChange(event) {
    itemsPerPage = event.target.value === "all" ? filteredData.length : Number.parseInt(event.target.value)
    currentPage = 1
    renderTable()
    renderPagination()
    updateInfo()
}

function renderTable() {
    const tableBody = document.getElementById("tableBody")
    tableBody.innerHTML = ""

    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="2" class="text-center py-4 text-muted">No data found</td></tr>'
        return
    }

    // Generate table rows with index and name only
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = itemsPerPage === filteredData.length ? filteredData.length : startIndex + itemsPerPage
    const pageData = filteredData.slice(startIndex, endIndex)

    pageData.forEach((item, index) => {
        const row = document.createElement("tr")

        // Index column
        const indexTd = document.createElement("td")
        indexTd.textContent = startIndex + index + 1
        indexTd.className = "index-column"
        row.appendChild(indexTd)

        // Name column
        const nameTd = document.createElement("td")
        nameTd.textContent = item.name
        row.appendChild(nameTd)

        tableBody.appendChild(row)
    })
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById("pagination")
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    pagination.innerHTML = ""

    if (totalPages <= 1) {
        document.getElementById("paginationNav").style.display = "none"
        return
    }

    document.getElementById("paginationNav").style.display = "block"

    // Previous button
    const prevLi = document.createElement("li")
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">‹</a>`
    pagination.appendChild(prevLi)

    // First page
    if (currentPage > 3) {
        const firstLi = document.createElement("li")
        firstLi.className = "page-item"
        firstLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(1)">1</a>`
        pagination.appendChild(firstLi)

        if (currentPage > 4) {
            const ellipsisLi = document.createElement("li")
            ellipsisLi.className = "page-item"
            ellipsisLi.innerHTML = `<span class="page-ellipsis">...</span>`
            pagination.appendChild(ellipsisLi)
        }
    }

    // Current page and neighbors
    const startPage = Math.max(1, currentPage - 1)
    const endPage = Math.min(totalPages, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement("li")
        li.className = `page-item ${i === currentPage ? "active" : ""}`
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`
        pagination.appendChild(li)
    }

    // Last page
    if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
            const ellipsisLi = document.createElement("li")
            ellipsisLi.className = "page-item"
            ellipsisLi.innerHTML = `<span class="page-ellipsis">...</span>`
            pagination.appendChild(ellipsisLi)
        }

        const lastLi = document.createElement("li")
        lastLi.className = "page-item"
        lastLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>`
        pagination.appendChild(lastLi)
    }

    // Next button
    const nextLi = document.createElement("li")
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">›</a>`
    pagination.appendChild(nextLi)
}

function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    if (page < 1 || page > totalPages) return

    currentPage = page
    renderTable()
    renderPagination()
    updateInfo()

    window.scrollTo({ top: 0, behavior: "smooth" })
}

function updateInfo() {
    const totalCount = document.getElementById("totalCount")
    const paginationInfo = document.getElementById("paginationInfo")

    totalCount.textContent = `${filteredData.length} records`

    if (filteredData.length > 0) {
        const startIndex = (currentPage - 1) * itemsPerPage + 1
        const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length)
        paginationInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${filteredData.length} entries`
    } else {
        paginationInfo.textContent = "No entries to show"
    }
}

function downloadData(format) {
    showLoading()

    setTimeout(() => {
        const visibleData = getVisibleData()

        switch (format) {
            case "excel":
                downloadCSV(visibleData)
                break
            case "pdf":
                downloadPDF(visibleData)
                break
            case "image":
                downloadTableImage()
                break
        }

        hideLoading()
    }, 500)
}

function getVisibleData() {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = itemsPerPage === filteredData.length ? filteredData.length : startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
}

function downloadCSV(data) {
    if (data.length === 0) return

    const csvContent = [
        "Index,Name",
        ...data.map((row, index) => `"${(currentPage - 1) * itemsPerPage + index + 1}","${row.name}"`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `4-mah-sathi_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
}

function downloadPDF(data) {
    if (data.length === 0) return

    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    // Set title
    doc.setFontSize(16)
    doc.setFont(undefined, "bold")
    doc.text("4 MAH SATHI DATA", 20, 20)

    // Set date
    doc.setFontSize(10)
    doc.setFont(undefined, "normal")
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)

    let y = 50

    // Draw table header
    doc.setFontSize(12)
    doc.setFont(undefined, "bold")
    doc.text("#", 20, y)
    doc.text("NAME", 40, y)

    // Draw table rows
    doc.setFont(undefined, "normal")
    doc.setFontSize(10)

    data.forEach((row, index) => {
        y += 10
        if (y > 280) {
            // New page if needed
            doc.addPage()
            y = 20
        }

        doc.text(String((currentPage - 1) * itemsPerPage + index + 1), 20, y)
        doc.text(String(row.name), 40, y)
    })

    doc.save(`4-mah-sathi_${new Date().toISOString().split("T")[0]}.pdf`)
}

function downloadTableImage() {
    const table = document.getElementById("dataTable")

    html2canvas(table, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
    })
        .then((canvas) => {
            // Create download link
            const link = document.createElement("a")
            link.download = `4-mah-sathi_${new Date().toISOString().split("T")[0]}.png`
            link.href = canvas.toDataURL()
            link.click()
        })
        .catch((error) => {
            console.error("Error generating image:", error)
            // Fallback to canvas method
            downloadTableImageFallback()
        })
}

function downloadTableImageFallback() {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const visibleData = getVisibleData()

    // Calculate canvas size based on content
    const rowHeight = 25
    const headerHeight = 40
    const titleHeight = 60
    canvas.width = 500
    canvas.height = titleHeight + headerHeight + visibleData.length * rowHeight + 40

    // Fill background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw title
    ctx.fillStyle = "#059669"
    ctx.font = "bold 18px Inter"
    ctx.fillText("4 MAH SATHI DATA", 20, 30)

    // Draw date
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px Inter"
    ctx.fillText(`Generated: ${new Date().toLocaleDateString()}`, 20, 50)

    // Draw table headers
    let y = titleHeight + 20
    ctx.fillStyle = "#059669"
    ctx.font = "bold 14px Inter"
    ctx.fillText("#", 20, y)
    ctx.fillText("NAME", 60, y)

    // Draw data rows
    ctx.fillStyle = "#374151"
    ctx.font = "12px Inter"
    visibleData.forEach((row, index) => {
        y += rowHeight
        ctx.fillText(String((currentPage - 1) * itemsPerPage + index + 1), 20, y)
        ctx.fillText(String(row.name), 60, y)
    })

    // Download image
    canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `4-mah-sathi_${new Date().toISOString().split("T")[0]}.png`
        link.click()
        window.URL.revokeObjectURL(url)
    })
}

function showLoading() {
    document.getElementById("loadingOverlay").classList.add("show")
}

function hideLoading() {
    document.getElementById("loadingOverlay").classList.remove("show")
}

// Prevent default link behavior
document.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.getAttribute("href") === "#") {
        e.preventDefault()
    }
})
