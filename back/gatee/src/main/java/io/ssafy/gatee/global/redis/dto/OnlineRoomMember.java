package io.ssafy.gatee.global.redis.dto;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@RedisHash(value = "onlineMember")
public class OnlineRoomMember {

    @Id
    private Long id;

    @Setter
    private Set<UUID> onlineUsers;
}
