package com.bloodhelp;

import java.security.Principal;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(
            NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/notifications")
    public String showNotifications(
            Principal principal,
            Model model) {

        List<Notification> notifications =
                notificationRepository
                .findByRecipientUsernameOrderByCreatedAtDesc(
                        principal.getName());

        model.addAttribute("notifications", notifications);

        return "notifications";
    }

    @PostMapping("/notifications/read/{id}")
    public String markAsRead(
            @PathVariable Long id,
            Principal principal) {

        Notification notification =
                notificationRepository.findById(id).orElse(null);

        if (notification != null &&
                notification.getRecipientUsername()
                .equals(principal.getName())) {

            notification.setRead(true);
            notificationRepository.save(notification);
        }

        return "redirect:/notifications";
    }
}
