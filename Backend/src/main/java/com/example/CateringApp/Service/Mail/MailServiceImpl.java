package com.example.CateringApp.Service.Mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.CateringApp.Model.Client;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(Client client)
            throws MessagingException {
        String url = "http://localhost:3000/verifyClient?token=" + client.getVerificationCode();
        String content = "Dear [[name]],<br>"
                + "Poniżej znajduje się link do aktywacji:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">Aktywuj konto</a></h3>";
        content = content.replace("[[name]]", client.getFullName());
        content = content.replace("[[URL]]", url);

        MimeMessage message = mailSender.createMimeMessage();
        message.setRecipients(MimeMessage.RecipientType.TO, client.getEmail());
        message.setSubject("Weryfikacja konta CateringApp");
        message.setContent(content, "text/html; charset=utf-8");

        mailSender.send(message);
    }

    @Override
    public void sendResetPasswordEmail(Client client) throws MessagingException {
        String url = "http://localhost:3000/resetPassword?clientId=" + client.getId();
        String content = "Dear [[name]],<br>"
                + "Poniżej znajduje się link do zmiany hasła:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">Zmiana hasła</a></h3>";
        content = content.replace("[[name]]", client.getFullName());
        content = content.replace("[[URL]]", url);

        MimeMessage message = mailSender.createMimeMessage();
        message.setRecipients(MimeMessage.RecipientType.TO, client.getEmail());
        message.setSubject("Zmiana hasła konta CateringApp");
        message.setContent(content, "text/html; charset=utf-8");

        mailSender.send(message);
    }

}
