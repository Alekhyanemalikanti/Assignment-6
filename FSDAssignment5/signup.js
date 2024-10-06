document.addEventListener('DOMContentLoaded', function() {
    // Check for error messages from a previous signup attempt
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    if (error) {
        document.getElementById('errorMessage').textContent = 'User already exists. Try logging in.';
    }

    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate inputs
        if (!username || !email || !password) {
            document.getElementById('errorMessage').textContent = 'Please fill in all fields.';
            return;
        }

        const response = await fetch('/signupUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        });

        if (response.ok) {
            alert(await response.text());
            window.location.href = '/login'; // Redirect to login page after successful signup
        } else {
            const errorMessage = await response.text();
            document.getElementById('errorMessage').textContent = errorMessage; // Display error message
        }
    });
});
