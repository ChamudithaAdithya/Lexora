package com.NoIdea.Lexora.service.MentorMenteeService.MentorMenteeServiceImpl;

import com.NoIdea.Lexora.dto.NotificationDTO.NotificationDTO;
import com.NoIdea.Lexora.enums.NotificationStatus;
import com.NoIdea.Lexora.model.Notification;
import com.NoIdea.Lexora.repository.NotificationRepo;
import com.NoIdea.Lexora.service.MentorMenteeService.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.NoIdea.Lexora.enums.NotificationStatus.READ;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepo notificationRepo;

    @Override
    public List<NotificationDTO> findAllNotificationsByRecieverId(Long reciever_id) {
        try {
            List<Notification> notification = notificationRepo.findAllByReciever_id(reciever_id);
            return notification.stream().map(NotificationDTO::new).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String createNotification(Notification notification) {
        try {
            notification.setStatus(NotificationStatus.UNREAD);
            notificationRepo.save(notification);
            return "Successfully Saved";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to create a notification instance in the database";
        }
    }

    @Override
    public String deleteNotification(Long id) {
        try {
            notificationRepo.deleteById(id);
            return "Successfully deleted";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to delete the notification";
        }
    }

    @Override
    public String updateNotification(Long id) {
        try {
            Notification notification = notificationRepo.findById(id).orElse(null);
            if (notification == null) {
                return "Notification with the id does not exist";
            }
            notification.setStatus(READ);
            notificationRepo.save(notification);
            return "Successfully updated";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to update the status";
        }
    }
}
