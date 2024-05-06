package io.ssafy.gatee.domain.push_notification.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
@Document(collection = "notification")
public class PushNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Type type;

    private Long typeId;

    private UUID senderId;

    private List<UUID> receiverId;

    private String title;

    private String content;

    private boolean isCheck;

    @PrePersist
    public void prePersist() {
        this.isCheck = false;
    }
}
