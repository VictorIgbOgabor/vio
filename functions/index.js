const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure the email transport using Nodemailer
// It retrieves credentials from the environment variables set in Step 2.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().gmail.email, // Your sending Gmail address
        pass: functions.config().gmail.password, // Your App Password or Gmail password
    },
});

/**
 * Cloud Function to send an email when a new message is added to Firestore.
 * Triggered on 'onCreate' for documents in the 'messages' collection.
 */
exports.sendEmailOnNewMessage = functions.firestore
    .document('messages/{docId}') // Listen for new documents in the 'messages' collection
    .onCreate(async (snap, context) => {
        const newMessage = snap.data(); // Get the data of the new document
        const docId = context.params.docId; // Get the ID of the new document

        // Destructure the message data.
        // ENSURE these field names (name, email, message) EXACTLY match
        // the field names you are using when saving data from your website form to Firestore.
        const { name, email, message, timestamp } = newMessage;

        // Create email content
        const mailOptions = {
            from: 'Vio Fresh Website <ogaborvictorigb@gmail.com>', // Sender display name and email
            to: 'ogaborvictorigb@gmail.com', // **YOUR EMAIL ADDRESS where you want to receive submissions**
            subject: `New Form Submission from ${name || 'A visitor'}`, // Subject line
            html: `
                <p>You have a new message from your website:</p>
                <p><strong>Name:</strong> ${name || 'N/A'}</p>
                <p><strong>Email:</strong> ${email || 'N/A'}</p>
                <p><strong>Message:</strong><br>${message || 'N/A'}</p>
                <p><strong>Submitted At:</strong> ${timestamp ? new Date(timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
                <p><strong>Firestore Document ID:</strong> ${docId}</p>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully!');
            return null; // Return null to indicate success
        } catch (error) {
            console.error('Error sending email:', error);
            // You can add more robust error handling here, e.g., logging to a different service
            return null; // Return null even on error to avoid retry loops
        }
    });