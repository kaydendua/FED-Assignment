document.addEventListener("DOMContentLoaded", () => {

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            const field = btn.closest(".info-field");
            const text = field.querySelector(".info-text");
            const input = field.querySelector(".info-input");

            const isPassword = field.previousElementSibling.textContent.trim() === "Password";

            // EDIT MODE
            if (btn.textContent === "Edit") {

                text.style.display = "none";
                input.style.display = "block";

                // If password → show actual password
                if (isPassword) {
                    input.type = "text";
                }

                input.value = input.value; // keep real value
                input.focus();
                btn.textContent = "Save";
            }

            // SAVE MODE
            else {

                if (isPassword) {
                    text.textContent = "••••••••"; // hide password
                } else {
                    text.textContent = input.value;
                }

                text.style.display = "block";
                input.style.display = "none";
                btn.textContent = "Edit";
            }

        });

    });

});

