package com.bloodhelp;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientUsernameOrderByCreatedAtDesc(
            String recipientUsername);

    long countByRecipientUsernameAndReadFalse(
            String recipientUsername);
}