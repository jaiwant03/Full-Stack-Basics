// ==========================================================================
// JOB APPLICATION FORM - CLIENT-SIDE VALIDATION & LOGIC
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const form = document.getElementById("jobForm");

    // Modal elements
    const successModal = document.getElementById("successModal");
    const modalTopCloseBtn = document.getElementById("modalTopCloseBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const submitAnotherBtn = document.getElementById("submitAnotherBtn");
    const printReceiptBtn = document.getElementById("printReceiptBtn");

    // Banner elements
    const statusBanner = document.getElementById("statusBanner");
    const bannerMessage = document.getElementById("bannerMessage");
    const closeBannerBtn = document.getElementById("closeBannerBtn");

    // Progress elements
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    // Field references
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("nameError");

    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    const phoneInput = document.getElementById("phone");
    const phoneError = document.getElementById("phoneError");

    const dobInput = document.getElementById("dob");
    const dobError = document.getElementById("dobError");

    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const genderError = document.getElementById("genderError");

    const qualificationInput = document.getElementById("qualification");
    const qualificationError = document.getElementById("qualificationError");

    const collegeInput = document.getElementById("college");
    const collegeError = document.getElementById("collegeError");

    const yearInput = document.getElementById("year");
    const yearError = document.getElementById("yearError");

    const cgpaInput = document.getElementById("cgpa");
    const cgpaError = document.getElementById("cgpaError");

    const positionInput = document.getElementById("position");
    const positionError = document.getElementById("positionError");

    const departmentInput = document.getElementById("department");
    const departmentError = document.getElementById("departmentError");

    const experienceInput = document.getElementById("experience");
    const experienceError = document.getElementById("experienceError");

    const salaryInput = document.getElementById("salary");
    const salaryError = document.getElementById("salaryError");

    const workTypeInputs = document.querySelectorAll('input[name="workType"]');
    const workTypeError = document.getElementById("workTypeError");

    const skillInputs = document.querySelectorAll('input[name="skills"]');
    const skillsError = document.getElementById("skillsError");

    const otherSkillsInput = document.getElementById("otherSkills");
    const otherSkillsError = document.getElementById("otherSkillsError");

    const resumeInput = document.getElementById("resumeFile");
    const resumeError = document.getElementById("resumeFileError");
    const dropZone = document.getElementById("dropZone");
    const filePreview = document.getElementById("filePreview");
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    const fileSizeDisplay = document.getElementById("fileSizeDisplay");
    const removeFileBtn = document.getElementById("removeFileBtn");

    const portfolioInput = document.getElementById("portfolio");
    const portfolioError = document.getElementById("portfolioError");

    const linkedinInput = document.getElementById("linkedin");
    const linkedinError = document.getElementById("linkedinError");

    const githubInput = document.getElementById("github");
    const githubError = document.getElementById("githubError");

    const coverLetterInput = document.getElementById("coverLetter");
    const coverLetterError = document.getElementById("coverLetterError");
    const coverLetterCount = document.getElementById("coverLetterCount");

    const whyHireInput = document.getElementById("whyHire");
    const whyHireError = document.getElementById("whyHireError");
    const whyHireCount = document.getElementById("whyHireCount");

    const declarationInput = document.getElementById("declaration");
    const declarationError = document.getElementById("declarationError");

    // ======================================================================
    // SAFE ERROR HELPER FUNCTIONS
    // ======================================================================

    function showError(input, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add("show");
        }
        if (input) {
            input.classList.add("input-error");
            input.classList.remove("input-valid");
        }
    }

    function clearError(input, errorElement) {
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.classList.remove("show");
        }
        if (input) {
            input.classList.remove("input-error");
            input.classList.add("input-valid");
        }
    }

    // ======================================================================
    // VALIDATION FUNCTIONS
    // ======================================================================

    // 1. Full Name
    function validateName() {
        const name = nameInput.value.trim();
        if (name === "") {
            showError(nameInput, nameError, "Please enter your full name.");
            return false;
        }
        if (name.length < 3) {
            showError(nameInput, nameError, "Name must contain at least 3 characters.");
            return false;
        }
        if (!/^[A-Za-z ]+$/.test(name)) {
            showError(nameInput, nameError, "Name must contain only alphabets and spaces.");
            return false;
        }
        clearError(nameInput, nameError);
        return true;
    }
    nameInput.addEventListener("input", function () {
        validateName();
        updateFormProgress();
    });

    // 2. Email Address
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            showError(emailInput, emailError, "Please enter your email address.");
            return false;
        }
        if (!emailPattern.test(email)) {
            showError(emailInput, emailError, "Please enter a valid email address (e.g. name@example.com).");
            return false;
        }
        clearError(emailInput, emailError);
        return true;
    }
    emailInput.addEventListener("input", function () {
        validateEmail();
        updateFormProgress();
    });

    // 3. Phone Number
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phonePattern = /^[0-9]{10}$/;

        if (phone === "") {
            showError(phoneInput, phoneError, "Please enter your phone number.");
            return false;
        }
        if (!phonePattern.test(phone)) {
            showError(phoneInput, phoneError, "Please enter a valid 10-digit phone number.");
            return false;
        }
        clearError(phoneInput, phoneError);
        return true;
    }
    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
        validatePhone();
        updateFormProgress();
    });

    // 4. Date of Birth (Optional, cannot be in future)
    function validateDOB() {
        const dob = dobInput.value;
        if (dob === "") {
            clearError(dobInput, dobError);
            return true;
        }
        const selectedDate = new Date(dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showError(dobInput, dobError, "Date of birth cannot be in the future.");
            return false;
        }
        clearError(dobInput, dobError);
        return true;
    }
    dobInput.addEventListener("change", function () {
        validateDOB();
        updateFormProgress();
    });

    // 5. Gender (Required)
    function validateGender() {
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        if (!selectedGender) {
            showError(null, genderError, "Please select your gender.");
            return false;
        }
        clearError(null, genderError);
        return true;
    }
    genderInputs.forEach(function (radio) {
        radio.addEventListener("change", function () {
            validateGender();
            updateFormProgress();
        });
    });

    // 6. Qualification (Required)
    function validateQualification() {
        if (qualificationInput.value === "") {
            showError(qualificationInput, qualificationError, "Please select your qualification.");
            return false;
        }
        clearError(qualificationInput, qualificationError);
        return true;
    }
    qualificationInput.addEventListener("change", function () {
        validateQualification();
        updateFormProgress();
    });

    // 7. College / University (Optional)
    function validateCollege() {
        const college = collegeInput.value.trim();
        if (college === "") {
            clearError(collegeInput, collegeError);
            return true;
        }
        if (college.length < 2) {
            showError(collegeInput, collegeError, "College name must have at least 2 characters.");
            return false;
        }
        clearError(collegeInput, collegeError);
        return true;
    }
    collegeInput.addEventListener("input", validateCollege);

    // 8. Graduation Year (Optional)
    function validateYear() {
        const val = yearInput.value.trim();
        if (val === "") {
            clearError(yearInput, yearError);
            return true;
        }
        const year = Number(val);
        if (year < 1950 || year > 2100) {
            showError(yearInput, yearError, "Graduation year must be between 1950 and 2100.");
            return false;
        }
        clearError(yearInput, yearError);
        return true;
    }
    yearInput.addEventListener("input", function () {
        if (this.value.length > 4) {
            this.value = this.value.slice(0, 4);
        }
        validateYear();
    });

    // 9. CGPA (Required: 8.0 or above)
    function validateCGPA() {
        const val = cgpaInput.value.trim();
        if (val === "") {
            showError(cgpaInput, cgpaError, "Please enter your CGPA.");
            return false;
        }
        const cgpa = Number(val);
        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            showError(cgpaInput, cgpaError, "Please enter a valid CGPA between 0.0 and 10.0.");
            return false;
        }
        if (cgpa < 8.0) {
            showError(cgpaInput, cgpaError, "CGPA must be 8.0 or above to meet the requirement.");
            return false;
        }
        clearError(cgpaInput, cgpaError);
        return true;
    }
    cgpaInput.addEventListener("input", function () {
        validateCGPA();
        updateFormProgress();
    });

    // 10. Position Applied For (Required)
    function validatePosition() {
        const position = positionInput.value.trim();
        if (position === "") {
            showError(positionInput, positionError, "Please enter the position applied for.");
            return false;
        }
        if (position.length < 2) {
            showError(positionInput, positionError, "Position title must have at least 2 characters.");
            return false;
        }
        clearError(positionInput, positionError);
        return true;
    }
    positionInput.addEventListener("input", function () {
        validatePosition();
        updateFormProgress();
    });

    // 11. Department (Optional)
    if (departmentInput) {
        departmentInput.addEventListener("change", function () {
            clearError(departmentInput, departmentError);
        });
    }

    // 12. Experience (Optional)
    function validateExperience() {
        const val = experienceInput.value.trim();
        if (val === "") {
            clearError(experienceInput, experienceError);
            return true;
        }
        const exp = Number(val);
        if (isNaN(exp) || exp < 0 || exp > 50) {
            showError(experienceInput, experienceError, "Experience must be between 0 and 50 years.");
            return false;
        }
        clearError(experienceInput, experienceError);
        return true;
    }
    experienceInput.addEventListener("input", validateExperience);

    // 13. Expected Salary (Optional)
    if (salaryInput) {
        salaryInput.addEventListener("input", function () {
            clearError(salaryInput, salaryError);
        });
    }

    // 14. Work Type (Optional)
    workTypeInputs.forEach(function (radio) {
        radio.addEventListener("change", function () {
            clearError(null, workTypeError);
        });
    });

    // 15. Skills (Optional)
    skillInputs.forEach(function (box) {
        box.addEventListener("change", function () {
            clearError(null, skillsError);
        });
    });

    // 16. Resume File (Required, PDF/DOC/DOCX, <= 5MB)
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    function updateFileDisplay(file) {
        if (file) {
            fileNameDisplay.textContent = file.name;
            fileSizeDisplay.textContent = formatFileSize(file.size);
            filePreview.style.display = "flex";
            dropZone.style.display = "none";
        } else {
            filePreview.style.display = "none";
            dropZone.style.display = "block";
            resumeInput.value = "";
        }
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener("click", function () {
            updateFileDisplay(null);
            validateResume();
            updateFormProgress();
        });
    }

    // Drag and drop handlers
    if (dropZone) {
        ['dragenter', 'dragover'].forEach(function (eventName) {
            dropZone.addEventListener(eventName, function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(function (eventName) {
            dropZone.addEventListener(eventName, function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('dragover');
            });
        });

        dropZone.addEventListener('drop', function (e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                resumeInput.files = files;
                validateResume();
                updateFormProgress();
            }
        });
    }

    function validateResume() {
        const file = resumeInput.files[0];
        if (!file) {
            showError(null, resumeError, "Please upload your resume.");
            updateFileDisplay(null);
            return false;
        }

        const allowedExtensions = [".pdf", ".doc", ".docx"];
        const fileName = file.name.toLowerCase();
        const isValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!isValidExt) {
            showError(null, resumeError, "Invalid file format. Please upload a PDF, DOC, or DOCX document.");
            updateFileDisplay(null);
            return false;
        }

        const maxBytes = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxBytes) {
            showError(null, resumeError, "File size exceeds 5 MB. Please upload a smaller file.");
            updateFileDisplay(null);
            return false;
        }

        clearError(null, resumeError);
        updateFileDisplay(file);
        return true;
    }
    resumeInput.addEventListener("change", function () {
        validateResume();
        updateFormProgress();
    });

    // 17. URL Validators (Portfolio, LinkedIn, GitHub)
    function validateURL(input, errorElement) {
        if (!input) return true;
        const val = input.value.trim();
        if (val === "") {
            clearError(input, errorElement);
            return true;
        }
        try {
            const parsed = new URL(val);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                throw new Error("Protocol not http/https");
            }
            clearError(input, errorElement);
            return true;
        } catch (e) {
            showError(input, errorElement, "Please enter a valid URL including http:// or https://");
            return false;
        }
    }

    if (portfolioInput) {
        portfolioInput.addEventListener("input", function () {
            validateURL(portfolioInput, portfolioError);
        });
    }
    if (linkedinInput) {
        linkedinInput.addEventListener("input", function () {
            validateURL(linkedinInput, linkedinError);
        });
    }
    if (githubInput) {
        githubInput.addEventListener("input", function () {
            validateURL(githubInput, githubError);
        });
    }

    // 18. Character Counters for Textareas
    if (coverLetterInput && coverLetterCount) {
        coverLetterInput.addEventListener("input", function () {
            coverLetterCount.textContent = `${this.value.length} / 1000`;
            clearError(coverLetterInput, coverLetterError);
        });
    }
    if (whyHireInput && whyHireCount) {
        whyHireInput.addEventListener("input", function () {
            whyHireCount.textContent = `${this.value.length} / 800`;
            clearError(whyHireInput, whyHireError);
        });
    }

    // 19. Declaration Checkbox (Required)
    function validateDeclaration() {
        if (!declarationInput.checked) {
            showError(null, declarationError, "Please confirm the declaration before submitting.");
            return false;
        }
        clearError(null, declarationError);
        return true;
    }
    declarationInput.addEventListener("change", function () {
        validateDeclaration();
        updateFormProgress();
    });

    // ======================================================================
    // LIVE FORM COMPLETION PROGRESS TRACKER
    // ======================================================================

    function updateFormProgress() {
        const requiredChecks = [
            Boolean(nameInput.value.trim().length >= 3 && /^[A-Za-z ]+$/.test(nameInput.value.trim())),
            Boolean(emailInput.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())),
            Boolean(phoneInput.value.trim().length === 10),
            Boolean(document.querySelector('input[name="gender"]:checked')),
            Boolean(qualificationInput.value !== ""),
            Boolean(cgpaInput.value.trim() && Number(cgpaInput.value) >= 8.0 && Number(cgpaInput.value) <= 10),
            Boolean(positionInput.value.trim().length >= 2),
            Boolean(resumeInput.files && resumeInput.files.length > 0),
            Boolean(declarationInput.checked)
        ];

        const total = requiredChecks.length;
        const completed = requiredChecks.filter(Boolean).length;
        const percentage = Math.round((completed / total) * 100);

        if (progressBar) {
            progressBar.style.width = percentage + "%";
        }
        if (progressText) {
            progressText.textContent = percentage + "% Completed";
        }
    }

    // ======================================================================
    // MODAL & BANNER CONTROL
    // ======================================================================

    function openSuccessModal(details) {
        // Populate modal data
        document.getElementById("summaryAppId").textContent = details.appId;
        document.getElementById("summaryName").textContent = details.name;
        document.getElementById("summaryPosition").textContent = details.position;
        document.getElementById("summaryEmail").textContent = details.email;
        document.getElementById("summaryPhone").textContent = details.phone;
        document.getElementById("summaryTimestamp").textContent = details.timestamp;

        // Display modal
        successModal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent background scroll

        // Show top banner too
        if (statusBanner) {
            statusBanner.style.display = "flex";
            if (bannerMessage) {
                bannerMessage.textContent = "Your response has been submitted successfully!";
            }
        }
    }

    function closeSuccessModal() {
        if (successModal) {
            successModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    if (modalTopCloseBtn) modalTopCloseBtn.addEventListener("click", closeSuccessModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeSuccessModal);

    // Close when clicking modal backdrop
    if (successModal) {
        successModal.addEventListener("click", function (e) {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }

    // Submit another response button
    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener("click", function () {
            closeSuccessModal();
            resetEntireForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Print Receipt button
    if (printReceiptBtn) {
        printReceiptBtn.addEventListener("click", function () {
            window.print();
        });
    }

    // Close banner button
    if (closeBannerBtn) {
        closeBannerBtn.addEventListener("click", function () {
            statusBanner.style.display = "none";
        });
    }

    // ======================================================================
    // FORM RESET HANDLER
    // ======================================================================

    function resetEntireForm() {
        form.reset();

        // Clear file display
        updateFileDisplay(null);

        // Clear error text and classes
        document.querySelectorAll(".error-message").forEach(function (error) {
            error.textContent = "";
            error.classList.remove("show");
        });

        document.querySelectorAll(".input-error, .input-valid").forEach(function (el) {
            el.classList.remove("input-error", "input-valid");
        });

        // Reset character counters
        if (coverLetterCount) coverLetterCount.textContent = "0 / 1000";
        if (whyHireCount) whyHireCount.textContent = "0 / 800";

        // Reset progress bar
        updateFormProgress();
    }

    form.addEventListener("reset", function () {
        setTimeout(function () {
            resetEntireForm();
        }, 10);
    });

    // ======================================================================
    // FORM SUBMISSION HANDLER
    // ======================================================================

    form.addEventListener("submit", function (event) {
        // Prevent default browser submission
        event.preventDefault();

        // Run all individual validations
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isDOBValid = validateDOB();
        const isGenderValid = validateGender();
        const isQualificationValid = validateQualification();
        const isCollegeValid = validateCollege();
        const isYearValid = validateYear();
        const isCGPAValid = validateCGPA();
        const isPositionValid = validatePosition();
        const isExperienceValid = validateExperience();
        const isResumeValid = validateResume();
        const isPortfolioValid = validateURL(portfolioInput, portfolioError);
        const isLinkedinValid = validateURL(linkedinInput, linkedinError);
        const isGithubValid = validateURL(githubInput, githubError);
        const isDeclarationValid = validateDeclaration();

        const isAllValid =
            isNameValid &&
            isEmailValid &&
            isPhoneValid &&
            isDOBValid &&
            isGenderValid &&
            isQualificationValid &&
            isCollegeValid &&
            isYearValid &&
            isCGPAValid &&
            isPositionValid &&
            isExperienceValid &&
            isResumeValid &&
            isPortfolioValid &&
            isLinkedinValid &&
            isGithubValid &&
            isDeclarationValid;

        if (!isAllValid) {
            // Find the first error or invalid field and scroll to it smoothly
            const firstErrorElem = document.querySelector(".input-error, .error-message.show");
            if (firstErrorElem) {
                const target = firstErrorElem.classList.contains("error-message")
                    ? firstErrorElem.parentElement
                    : firstErrorElem;

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                if (typeof target.focus === "function") {
                    target.focus();
                }
            }
            return;
        }

        // ==================================================================
        // SUCCESS HANDLING: BUILD SUMMARY & OPEN CONFIRMATION
        // ==================================================================

        // Generate unique application ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const appId = `#APP-2026-${randomNum}`;

        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }) + " at " + now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const submissionData = {
            appId: appId,
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            position: positionInput.value.trim(),
            timestamp: formattedDate
        };

        // Open the rich confirmation modal
        openSuccessModal(submissionData);

        // Log formatted submission to developer console
        console.log("%c Application Submitted Successfully! ", "background: #2e7d32; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;");
        console.table(submissionData);
    });

    // Initialize progress on page load
    updateFormProgress();
});