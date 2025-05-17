document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".toggle-btn");
    const togglePage = document.querySelector(".toggle-page");
    const toggleContent = document.querySelector(".toggle-content");
    const simOptions = document.querySelectorAll(".sim-option");
    const selectedSimInput = document.getElementById("selectedSim");
    const stopSelectedSimInput = document.getElementById("stopSelectedSim");

    let selectedSim = "SIM 1"; // Default selection

    if (!toggleBtn || !togglePage || !toggleContent) {
        console.error("One or more required elements not found in DOM.");
        return;
    }

    // Show SIM selection page
    toggleBtn.addEventListener("click", function () {
        togglePage.style.display = "flex";
    });

    // Hide page when clicking outside
    togglePage.addEventListener("click", function () {
        this.style.display = "none";
    });

    // Prevent closing when clicking inside the content box
    toggleContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // SIM selection handling
    simOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            simOptions.forEach(opt => opt.classList.remove("active"));
            this.classList.add("active");

            // Get SIM selection from radio button
            selectedSim = this.querySelector("input").value;

            // Set checked radio button
            document.querySelectorAll('input[name="sim"]').forEach(radio => {
                radio.checked = (radio.value === selectedSim);
            });
        });
    });

    // Before form submission, set selected SIM
    document.getElementById("startForm").addEventListener("submit", function () {
        selectedSimInput.value = selectedSim;
    });

    document.getElementById("stopForm").addEventListener("submit", function () {
        stopSelectedSimInput.value = selectedSim;
    });
});
