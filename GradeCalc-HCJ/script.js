        let total = 0;
        let totalCredits = 0;

        for (let i = 1; i <= 5; i++) {
            let mark = Number(prompt("Enter mark for subject " + i));
            let credit = Number(prompt("Enter credit for subject " + i));

            if (mark < 0 || mark > 100 || credit <= 0) {
                alert("Invalid mark or credit");
                i--;
                continue;
            }

            total += mark;
            totalCredits += credit;
        }

        let average = total / 5;
        let grade;

        if (average >= 90)
            grade = "O";
        else if (average >= 80)
            grade = "A+";
        else if (average >= 70)
            grade = "A";
        else if (average >= 60)
            grade = "B";
        else if (average >= 50)
            grade = "C";
        else
            grade = "Fail";

        document.write("<h3>Total Marks: " + total + "</h3>");
        document.write("<h3>Average: " + average.toFixed(2) + "</h3>");
        document.write("<h3>Total Credits: " + totalCredits + "</h3>");
        document.write("<h3>Grade: " + grade + "</h3>");