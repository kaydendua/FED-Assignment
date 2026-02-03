const stepIndicator = document.getElementById("stepIndicator");

const steps = {
    1: document.getElementById("step1"),
    2: document.getElementById("step2"),
    3: document.getElementById("step3")
};

function showStep(step) {
    Object.values(steps).forEach(s => s.classList.add("hidden"));
    steps[step].classList.remove("hidden");
    stepIndicator.textContent = `Step ${step} of 3`;
}

document.getElementById("nextBtn1").addEventListener("click", () => showStep(2));
document.getElementById("backBtn1").addEventListener("click", () => showStep(1));
document.getElementById("nextBtn2").addEventListener("click", () => showStep(3));
document.getElementById("backBtn2").addEventListener("click", () => showStep(2));

document.getElementById("submitBtn").addEventListener("click", () => {
    if (!document.getElementById("agree").checked) {
        alert("Please agree to the terms.");
        return;
    }
    alert("Vendor application submitted!");
});
