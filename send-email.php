<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize and validate email
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "invalid";
        exit;
    }

    // Sanitize other fields
    $name = htmlspecialchars(trim($_POST['name']));
    $subjectInput = htmlspecialchars(trim($_POST['subject']));
    $messageInput = nl2br(htmlspecialchars(trim($_POST['message'])));

    // Multiple recipients
    $to = "balaji@ecowisepower.in, ramesh@ecowisepower.in";
    $subject = "Contact Form: " . $subjectInput;
    $message = "
        <strong>Name:</strong> {$name}<br>
        <strong>Email:</strong> {$email}<br>
        <strong>Message:</strong><br>{$messageInput}
    ";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: <$email>";

    if (mail($to, $subject, $message, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>
