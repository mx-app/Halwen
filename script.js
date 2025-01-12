// Telegram Web App integration
const tg = window.Telegram.WebApp;
tg.expand();

// Get user data
const userData = tg.initDataUnsafe.user;
document.getElementById("username").value = userData.username || "Not available";
document.getElementById("userId").value = userData.id || "Not available";

// Send message function
function sendMessage() {
    const message = document.getElementById("message").value.trim();
    const messageType = document.querySelector('input[name="messageType"]:checked');
    const username = userData.username || "Not available";
    const userId = userData.id;

    if (!message || !messageType) {
        tg.showAlert("Please select a message type and enter your feedback.");
        return;
    }

    // Check daily send limit
    const lastSent = localStorage.getItem(`lastSent_${userId}`);
    const currentDate = new Date().toISOString().split('T')[0]; // Today's date

    if (lastSent === currentDate) {
        tg.showAlert("You can only send one message per day. Please try again tomorrow.");
        return;
    }

    const botToken = "7645890661:AAEwfvZjaQPmyf181QYTRZ-kEQgluG-rPrQ"; // Replace with your bot token
    const adminId = "6793556284";  // Replace with the admin chat ID

    const text = `Message Type: ${messageType.value}\n`
        + `User ID: ${userId}\n`
        + `Username: @${username}\n\n`
        + `Message:\n${message}`;

    // Send the message to the bot
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: adminId,
            text: text
        })
    }).then(response => {
        if (response.ok) {
            tg.showAlert("Message sent successfully!");
            document.getElementById("message").value = "";
            localStorage.setItem(`lastSent_${userId}`, currentDate); // Save send date
        } else {
            tg.showAlert("Failed to send the message. Please try again.");
        }
    }).catch(error => {
        console.error("Error:", error);
        tg.showAlert("An error occurred. Please try again later.");
    });
}
