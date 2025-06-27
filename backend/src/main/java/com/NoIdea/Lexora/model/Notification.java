package com.NoIdea.Lexora.model;

import com.NoIdea.Lexora.enums.NotificationStatus;
import com.NoIdea.Lexora.model.User.UserEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Notification
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String message;
    private String notification;
    private NotificationStatus status;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity reciever;
}