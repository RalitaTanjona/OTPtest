// webotp.js

document.addEventListener('DOMContentLoaded', () => {
    const otpInput = document.getElementById('otpInput');
    const otpForm = document.getElementById('otpForm');
    const statusMessage = document.getElementById('statusMessage');

    // Function to handle the OTP request
    async function handleOTPRequest() {
        // Check if WebOTP API is supported by the browser
        if ('OTPCredential' in window && 'credentials' in navigator) {
            try {
                statusMessage.textContent = 'Waiting for OTP via SMS...'; // Update status message
                
                // Request the OTP credential
                const content = await navigator.credentials.get({
                    otp: { transport: ['sms'] } // Specify that we are looking for an OTP from SMS
                });

                // If OTP is received and contains a code, fill the input field
                if (content && content.code) {
                    otpInput.value = content.code;
                    statusMessage.textContent = 'OTP received and filled!';
                    // Optionally, you can automatically submit the form here
                    // otpForm.submit(); 
                } else {
                    statusMessage.textContent = 'No OTP received via API.';
                }
            } catch (err) {
                console.error('WebOTP API error:', err);
                if (err.name === 'AbortError') {
                    // User cancelled the prompt or the request timed out
                    statusMessage.textContent = 'WebOTP process aborted (user cancelled or timeout).';
                } else {
                    statusMessage.textContent = `Error getting OTP: ${err.message}`;
                }
            }
        } else {
            // Inform the user if the WebOTP API is not supported
            statusMessage.textContent = 'WebOTP API not supported in this browser. Please enter OTP manually.';
            console.warn('WebOTP API not supported.');
        }
    }

    // Trigger the OTP request when the page loads.
    // In a real application, you might trigger this after a user requests an OTP from your server.
    handleOTPRequest();

    // Add event listener for form submission
    otpForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Display a message indicating the OTP is being verified
        statusMessage.textContent = `Verifying OTP: ${otpInput.value}... (This is where you'd send to your backend)`;
        console.log('OTP submitted:', otpInput.value);
        // In a real application, you would send otpInput.value to your server for verification.
    });
});