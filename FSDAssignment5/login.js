document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate inputs
    if (!username || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const response = await fetch('/loginUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.status === 200) {
        alert(await response.text());
        window.location.href = '/index'; // Redirect to index page
    } else {
        alert(await response.text()); // Display error message
    }
});
