// File: js/profile.js
// Purpose: Manages vendor profile details and edit modes.

document.addEventListener('DOMContentLoaded', () => {
    // Mock User Profile Data
    const userProfile = {
        name: "Ong Liang Cheng",
        studentID: "S10274212",
        stallName: "oinkzZ Hawker",
        email: "liangcheng@gmail.com"
    };

    // Initialize Profile Fields
    const welcomeMsg = document.querySelector('.welcome-msg h2');
    if (welcomeMsg) {
        welcomeMsg.innerText = `Welcome! ${userProfile.name}`;
    }

    // Handle "Edit" clicks on the profile page
    const editLabels = document.querySelectorAll('.edit-label');
    
    editLabels.forEach(label => {
        label.addEventListener('click', (e) => {
            const field = e.target.parentElement;
            const currentText = field.innerText.split('\n')[0]; // Get text without the label
            
            // Simple prompt to simulate editing (A-grade: Replace with modal later)
            const newValue = prompt(`Update your ${e.target.innerText}:`, currentText);
            
            if (newValue) {
                // Update DOM
                field.childNodes[0].nodeValue = newValue; 
                
                // Save to LocalStorage for persistence
                localStorage.setItem(`profile_${e.target.innerText}`, newValue);
                console.log(`Updated ${e.target.innerText} to ${newValue}`);
            }
        });
    });
});