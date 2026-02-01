// Order food button (placeholder logic)
document.querySelector(".order-btn").addEventListener("click", () => {
    alert("Redirecting to food ordering page...");
});

// Example: guest vs registered user history
const isGuest = false; // change to true to simulate guest

if (isGuest) {
    console.log("Guest user: limited shopping history stored in browser");
} else {
    console.log("Registered user: full order history available");
}
