class JamaatPage {
    constructor() {
        this.init()
    }

    init() {
        this.setupSidebar()
    }

    setupSidebar() {
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
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new JamaatPage()
})
