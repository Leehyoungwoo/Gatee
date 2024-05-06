package io.ssafy.gatee.domain.push_notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("status=TRUE")
public class PushNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Type type;

    private Long typeId;

    private UUID senderId;

    @ElementCollection(fetch = FetchType.LAZY)
    private List<UUID> receiverId;

    private String title;

    private String content;

    private boolean isCheck;

    @PrePersist
    public void prePersist() {
        this.isCheck = false;
    }
}
