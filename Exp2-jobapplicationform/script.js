// ==========================================
// JOB APPLICATION FORM - JAVASCRIPT
// LIVE CLIENT-SIDE VALIDATION
// ==========================================

// Get the form
const form = document.getElementById("jobForm");

// ==========================================
// HELPER FUNCTION - SHOW ERROR
// ==========================================

function showError(input, errorElement, message) {

    errorElement.textContent = message;
    errorElement.classList.add("show");

    if (input) {
        input.classList.add("input-error");
        input.classList.remove("input-valid");
    }
}


// ==========================================
// HELPER FUNCTION - REMOVE ERROR
// ==========================================

function clearError(input, errorElement) {

    errorElement.textContent = "";
    errorElement.classList.remove("show");

    if (input) {
        input.classList.remove("input-error");
        input.classList.add("input-valid");
    }
}


// ==========================================
// NAME VALIDATION
// ==========================================

const nameInput = document.getElementById("name");
const nameError = document.getElementById("nameError");

function validateName() {

    const name = nameInput.value.trim();

    if (name === "") {

        showError(
            nameInput,
            nameError,
            "Please enter your full name."
        );

        return false;
    }

    if (name.length < 3) {

        showError(
            nameInput,
            nameError,
            "Name must contain at least 3 characters."
        );

        return false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {

        showError(
            nameInput,
            nameError,
            "Name must contain only letters."
        );

        return false;
    }

    clearError(nameInput, nameError);

    return true;
}

nameInput.addEventListener("input", validateName);


// ==========================================
// EMAIL VALIDATION
// ==========================================

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

function validateEmail() {

    const email = emailInput.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {

        showError(
            emailInput,
            emailError,
            "Please enter your email address."
        );

        return false;
    }

    if (!emailPattern.test(email)) {

        showError(
            emailInput,
            emailError,
            "Please enter a valid email ID."
        );

        return false;
    }

    clearError(emailInput, emailError);

    return true;
}

emailInput.addEventListener("input", validateEmail);


// ==========================================
// PHONE NUMBER VALIDATION
// ==========================================

const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");

function validatePhone() {

    const phone = phoneInput.value.trim();

    const phonePattern =
        /^[0-9]{10}$/;

    if (phone === "") {

        showError(
            phoneInput,
            phoneError,
            "Please enter your phone number."
        );

        return false;
    }

    if (!phonePattern.test(phone)) {

        showError(
            phoneInput,
            phoneError,
            "Please enter a valid 10-digit phone number."
        );

        return false;
    }

    clearError(phoneInput, phoneError);

    return true;
}


// Allow only numbers while typing
phoneInput.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

    validatePhone();
});


// ==========================================
// DATE OF BIRTH VALIDATION
// ==========================================

const dobInput = document.getElementById("dob");
const dobError = document.getElementById("dobError");

function validateDOB() {

    const dob = dobInput.value;

    if (dob === "") {

        // DOB is optional in your HTML,
        // so don't show an error when empty.
        clearError(dobInput, dobError);

        return true;
    }

    const selectedDate = new Date(dob);
    const today = new Date();

    if (selectedDate > today) {

        showError(
            dobInput,
            dobError,
            "Date of birth cannot be in the future."
        );

        return false;
    }

    clearError(dobInput, dobError);

    return true;
}

dobInput.addEventListener("change", validateDOB);


// ==========================================
// GENDER VALIDATION
// ==========================================

const genderInputs =
    document.querySelectorAll('input[name="gender"]');

const genderError =
    document.getElementById("genderError");

function validateGender() {

    const selectedGender =
        document.querySelector(
            'input[name="gender"]:checked'
        );

    if (!selectedGender) {

        showError(
            null,
            genderError,
            "Please select your gender."
        );

        return false;
    }

    clearError(null, genderError);

    return true;
}


genderInputs.forEach(function (radio) {

    radio.addEventListener("change", validateGender);

});


// ==========================================
// QUALIFICATION VALIDATION
// ==========================================

const qualificationInput =
    document.getElementById("qualification");

const qualificationError =
    document.getElementById("qualificationError");

function validateQualification() {

    if (qualificationInput.value === "") {

        showError(
            qualificationInput,
            qualificationError,
            "Please select your qualification."
        );

        return false;
    }

    clearError(
        qualificationInput,
        qualificationError
    );

    return true;
}

qualificationInput.addEventListener(
    "change",
    validateQualification
);


// ==========================================
// COLLEGE VALIDATION
// ==========================================

const collegeInput =
    document.getElementById("college");

const collegeError =
    document.getElementById("collegeError");

function validateCollege() {

    const college = collegeInput.value.trim();

    // College is optional in your HTML
    if (college === "") {

        clearError(collegeInput, collegeError);

        return true;
    }

    if (college.length < 2) {

        showError(
            collegeInput,
            collegeError,
            "Please enter a valid college name."
        );

        return false;
    }

    clearError(collegeInput, collegeError);

    return true;
}

collegeInput.addEventListener(
    "input",
    validateCollege
);


// ==========================================
// GRADUATION YEAR VALIDATION
// ==========================================

const yearInput =
    document.getElementById("year");

const yearError =
    document.getElementById("yearError");

function validateYear() {

    const value = yearInput.value;

    // Optional field
    if (value === "") {

        clearError(yearInput, yearError);

        return true;
    }

    const year = Number(value);

    if (year < 1950 || year > 2100) {

        showError(
            yearInput,
            yearError,
            "Please enter a valid graduation year."
        );

        return false;
    }

    clearError(yearInput, yearError);

    return true;
}

yearInput.addEventListener(
    "input",
    function () {

        // Maximum 4 digits
        if (this.value.length > 4) {

            this.value =
                this.value.slice(0, 4);
        }

        validateYear();
    }
);


// ==========================================
// CGPA / PERCENTAGE VALIDATION
// ==========================================

const cgpaInput =
    document.getElementById("cgpa");

const cgpaError =
    document.getElementById("cgpaError");

function validateCGPA() {

    const value = cgpaInput.value;

    // If empty
    if (value === "") {

        showError(
            cgpaInput,
            cgpaError,
            "Please enter your CGPA."
        );

        return false;
    }

    const cgpa = Number(value);

    // CGPA must be between 8 and 10
    if (cgpa < 8) {

        showError(
            cgpaInput,
            cgpaError,
            "CGPA must be 8.0 or above."
        );

        return false;
    }

    if (cgpa > 10) {

        showError(
            cgpaInput,
            cgpaError,
            "CGPA cannot be greater than 10."
        );

        return false;
    }

    clearError(cgpaInput, cgpaError);

    return true;
}

cgpaInput.addEventListener(
    "input",
    validateCGPA
);

cgpaInput.addEventListener(
    "input",
    validateCGPA
);


// ==========================================
// POSITION VALIDATION
// ==========================================

const positionInput =
    document.getElementById("position");

const positionError =
    document.getElementById("positionError");

function validatePosition() {

    const position =
        positionInput.value.trim();

    if (position === "") {

        showError(
            positionInput,
            positionError,
            "Please enter the position you are applying for."
        );

        return false;
    }

    if (position.length < 2) {

        showError(
            positionInput,
            positionError,
            "Please enter a valid position."
        );

        return false;
    }

    clearError(
        positionInput,
        positionError
    );

    return true;
}

positionInput.addEventListener(
    "input",
    validatePosition
);


// ==========================================
// DEPARTMENT
// ==========================================

const departmentInput =
    document.getElementById("department");

const departmentError =
    document.getElementById("departmentError");

departmentInput.addEventListener(
    "change",
    function () {

        // Department is optional
        clearError(
            departmentInput,
            departmentError
        );
    }
);


// ==========================================
// EXPERIENCE VALIDATION
// ==========================================

const experienceInput =
    document.getElementById("experience");

const experienceError =
    document.getElementById("experienceError");

function validateExperience() {

    const value = experienceInput.value;

    // Optional field
    if (value === "") {

        clearError(
            experienceInput,
            experienceError
        );

        return true;
    }

    const experience =
        Number(value);

    if (experience < 0 || experience > 50) {

        showError(
            experienceInput,
            experienceError,
            "Experience must be between 0 and 50 years."
        );

        return false;
    }

    clearError(
        experienceInput,
        experienceError
    );

    return true;
}

experienceInput.addEventListener(
    "input",
    validateExperience
);


// ==========================================
// EXPECTED SALARY
// ==========================================

const salaryInput =
    document.getElementById("salary");

const salaryError =
    document.getElementById("salaryError");

salaryInput.addEventListener(
    "input",
    function () {

        // Salary is optional
        clearError(
            salaryInput,
            salaryError
        );

    }
);


// ==========================================
// WORK TYPE
// ==========================================

const workTypeInputs =
    document.querySelectorAll(
        'input[name="workType"]'
    );

const workTypeError =
    document.getElementById("workTypeError");

workTypeInputs.forEach(function (radio) {

    radio.addEventListener(
        "change",
        function () {

            clearError(
                null,
                workTypeError
            );

        }
    );

});


// ==========================================
// SKILLS
// ==========================================

const skillInputs =
    document.querySelectorAll(
        'input[name="skills"]'
    );

const skillsError =
    document.getElementById("skillsError");

skillInputs.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        function () {

            clearError(
                null,
                skillsError
            );

        }
    );

});


// ==========================================
// OTHER SKILLS
// ==========================================

const otherSkillsInput =
    document.getElementById("otherSkills");

const otherSkillsError =
    document.getElementById("otherSkillsError");

otherSkillsInput.addEventListener(
    "input",
    function () {

        // Optional field
        clearError(
            otherSkillsInput,
            otherSkillsError
        );

    }
);


// ==========================================
// RESUME VALIDATION
// ==========================================

const resumeInput =
    document.getElementById("resumeFile");

const resumeError =
    document.getElementById("resumeFileError");

function validateResume() {

    const resume =
        resumeInput.files[0];

    if (!resume) {

        showError(
            resumeInput,
            resumeError,
            "Please upload your resume."
        );

        return false;
    }


    // ======================================
    // RESUME FILE TYPE
    // ======================================

    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx"
    ];

    const fileName =
        resume.name.toLowerCase();

    const validFile =
        allowedExtensions.some(
            function (extension) {

                return fileName.endsWith(
                    extension
                );

            }
        );


    if (!validFile) {

        showError(
            resumeInput,
            resumeError,
            "Please upload PDF, DOC or DOCX format."
        );

        return false;
    }


    // ======================================
    // RESUME FILE SIZE
    // Maximum 5 MB
    // ======================================

    const maxSize =
        5 * 1024 * 1024;

    if (resume.size > maxSize) {

        showError(
            resumeInput,
            resumeError,
            "Resume file size should not exceed 5 MB."
        );

        return false;
    }


    clearError(
        resumeInput,
        resumeError
    );

    return true;
}

resumeInput.addEventListener(
    "change",
    validateResume
);


// ==========================================
// PORTFOLIO URL
// ==========================================

const portfolioInput =
    document.getElementById("portfolio");

const portfolioError =
    document.getElementById("portfolioError");

function validateURL(input, errorElement) {

    const value =
        input.value.trim();

    // Optional field
    if (value === "") {

        clearError(
            input,
            errorElement
        );

        return true;
    }

    try {

        const url =
            new URL(value);

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            throw new Error();

        }

        clearError(
            input,
            errorElement
        );

        return true;

    } catch (error) {

        showError(
            input,
            errorElement,
            "Please enter a valid URL."
        );

        return false;
    }
}

portfolioInput.addEventListener(
    "input",
    function () {

        validateURL(
            portfolioInput,
            portfolioError
        );

    }
);


// ==========================================
// LINKEDIN URL
// ==========================================

const linkedinInput =
    document.getElementById("linkedin");

const linkedinError =
    document.getElementById("linkedinError");

linkedinInput.addEventListener(
    "input",
    function () {

        validateURL(
            linkedinInput,
            linkedinError
        );

    }
);


// ==========================================
// GITHUB URL
// ==========================================

const githubInput =
    document.getElementById("github");

const githubError =
    document.getElementById("githubError");

githubInput.addEventListener(
    "input",
    function () {

        validateURL(
            githubInput,
            githubError
        );

    }
);


// ==========================================
// COVER LETTER
// ==========================================

const coverLetterInput =
    document.getElementById("coverLetter");

const coverLetterError =
    document.getElementById("coverLetterError");

coverLetterInput.addEventListener(
    "input",
    function () {

        // Optional field
        clearError(
            coverLetterInput,
            coverLetterError
        );

    }
);


// ==========================================
// WHY HIRE YOU
// ==========================================

const whyHireInput =
    document.getElementById("whyHire");

const whyHireError =
    document.getElementById("whyHireError");

whyHireInput.addEventListener(
    "input",
    function () {

        // Optional field
        clearError(
            whyHireInput,
            whyHireError
        );

    }
);


// ==========================================
// DECLARATION VALIDATION
// ==========================================

const declarationInput =
    document.getElementById("declaration");

const declarationError =
    document.getElementById("declarationError");

function validateDeclaration() {

    if (!declarationInput.checked) {

        showError(
            null,
            declarationError,
            "Please accept the declaration before submitting."
        );

        return false;
    }

    clearError(
        null,
        declarationError
    );

    return true;
}

declarationInput.addEventListener(
    "change",
    validateDeclaration
);


// ==========================================
// FORM SUBMIT
// ==========================================

form.addEventListener(
    "submit",
    function (event) {

        // Stop page refresh
        event.preventDefault();


        // Validate all required fields
        const validName =
            validateName();

        const validEmail =
            validateEmail();

        const validPhone =
            validatePhone();

        const validDOB =
            validateDOB();

        const validGender =
            validateGender();

        const validQualification =
            validateQualification();

        const validCollege =
            validateCollege();

        const validYear =
            validateYear();

        const validCGPA =
            validateCGPA();

        const validPosition =
            validatePosition();

        const validExperience =
            validateExperience();

        const validResume =
            validateResume();

        const validPortfolio =
            validateURL(
                portfolioInput,
                portfolioError
            );

        const validLinkedin =
            validateURL(
                linkedinInput,
                linkedinError
            );

        const validGithub =
            validateURL(
                githubInput,
                githubError
            );

        const validDeclaration =
            validateDeclaration();


        // ======================================
        // CHECK ALL VALIDATIONS
        // ======================================

        const isFormValid =
            validName &&
            validEmail &&
            validPhone &&
            validDOB &&
            validGender &&
            validQualification &&
            validCollege &&
            validYear &&
            validCGPA &&
            validPosition &&
            validExperience &&
            validResume &&
            validPortfolio &&
            validLinkedin &&
            validGithub &&
            validDeclaration;


        // ======================================
        // STOP IF INVALID
        // ======================================

        if (!isFormValid) {

            // Find first error
            const firstError =
                document.querySelector(
                    ".input-error"
                );

            if (firstError) {

                firstError.focus();

                firstError.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

            return;
        }


        // ======================================
        // SUCCESS MESSAGE
        // ======================================

        alert(
            "Job application submitted successfully!"
        );


        // ======================================
        // CONSOLE MESSAGE
        // ======================================

        console.log(
            "Application Submitted"
        );

        console.log(
            "Name:",
            nameInput.value.trim()
        );

        console.log(
            "Email:",
            emailInput.value.trim()
        );

        console.log(
            "Phone:",
            phoneInput.value.trim()
        );

        console.log(
            "Position:",
            positionInput.value.trim()
        );


        // ======================================
        // RESET FORM
        // ======================================

        form.reset();

        // Remove validation styles/messages
        document
            .querySelectorAll(".error-message")
            .forEach(function (error) {

                error.textContent = "";

                error.classList.remove("show");

            });

        document
            .querySelectorAll(
                ".input-error, .input-valid"
            )
            .forEach(function (input) {

                input.classList.remove(
                    "input-error",
                    "input-valid"
                );

            });

    }
);


// ==========================================
// FORM RESET
// ==========================================

form.addEventListener(
    "reset",
    function () {

        setTimeout(function () {

            // Remove all error messages
            document
                .querySelectorAll(
                    ".error-message"
                )
                .forEach(function (error) {

                    error.textContent = "";

                    error.classList.remove(
                        "show"
                    );

                });


            // Remove validation borders
            document
                .querySelectorAll(
                    ".input-error, .input-valid"
                )
                .forEach(function (input) {

                    input.classList.remove(
                        "input-error",
                        "input-valid"
                    );

                });


            console.log(
                "Form has been reset."
            );

        }, 0);

    }
);