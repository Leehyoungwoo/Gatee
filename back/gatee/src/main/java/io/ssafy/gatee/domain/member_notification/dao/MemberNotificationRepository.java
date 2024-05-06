package io.ssafy.gatee.domain.member_notification.dao;

import io.ssafy.gatee.domain.member.entity.Member;
import io.ssafy.gatee.domain.member_notification.entity.MemberNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberNotificationRepository extends JpaRepository<MemberNotification, Long> {

    MemberNotification findByMember(Member member);
}
