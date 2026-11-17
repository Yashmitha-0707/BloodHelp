package com.bloodhelp;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final DonorRepository donorRepository;
    private final NotificationRepository notificationRepository;

    public NotificationService(
            DonorRepository donorRepository,
            NotificationRepository notificationRepository) {

        this.donorRepository = donorRepository;
        this.notificationRepository = notificationRepository;
    }

    public void notifyMatchingDonors(BloodRequest request) {

        List<Donor> matchingDonors =
                donorRepository
                .findByBloodGroupIgnoreCaseAndCityIgnoreCaseAndVerifiedTrueAndAvailableTrue(
                        request.getBloodGroup(),
                        request.getCity()
                );

        for (Donor donor : matchingDonors) {

            String username = donor.getRegisteredByUsername();

            if (username == null || username.isBlank()) {
                continue;
            }

            Notification notification = new Notification();

            notification.setRecipientUsername(username);
            notification.setTitle("New Blood Request");

            notification.setMessage(
                    "A " + request.getBloodGroup()
                    + " blood request for "
                    + request.getUnits()
                    + " units has been submitted in "
                    + request.getCity()
                    + ". Please check the request details."
            );

            notification.setBloodRequestId(request.getId());
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);

            notificationRepository.save(notification);
        }
    }
}