package io.ssafy.gatee.global.redis.dao;

import io.ssafy.gatee.global.redis.dto.OnlineRoomMember;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OnlineRoomMemberRepository extends CrudRepository<OnlineRoomMember, Long> {
}
