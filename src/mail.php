<?php 
 echo "<script type='text/javascript'>alert('AAAA');</script>";
  $email = $_POST['email'];
  $recipient = 'takuma.kakehi@gmail.com';
  $formcontent= $_POST['message'];     
  $subject = "PORTFOLIO : contact form";
  $mailheader = "From: $email \r\n";
  mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
?>