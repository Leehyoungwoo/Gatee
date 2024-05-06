package io.ssafy.gatee.domain.member.entity;


import io.ssafy.gatee.domain.family_schedule.entity.FamilySchedule;
import io.ssafy.gatee.domain.base.BaseEntity;
import io.ssafy.gatee.domain.file.entity.File;
import io.ssafy.gatee.domain.member.dto.request.MemberEditReq;
import io.ssafy.gatee.domain.member.dto.request.MemberSaveReq;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("status=TRUE")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    private String name;

    private String email;

    private String nickname;

    private LocalDate birth;

    private BirthType birthType;

    private String mood;

    private String phoneNumber;

    private String notificationToken;   // 알림 전송용 토큰

    // 1:1 관계에서 자식 entity의 pk를 가지고 있는 부모 entity에 적용하는 어노테이션
    // mappedBy에 부모 클래스를 작성하여 이 관계의 주인을 나타냄
    @ManyToOne
    @JoinColumn(name = "file_id")
    private File file;

    @Enumerated(EnumType.STRING)
    private Privilege privilege;

    // 회원 정보 저장 - file field 추가 예정
    public void saveInfo(MemberSaveReq memberSaveReq) {
        this.name = memberSaveReq.name();
        this.privilege = Privilege.USER;    // 추가 정보 저장시 권한 변경
        this.nickname = memberSaveReq.nickname();
        this.birth = LocalDate.parse(memberSaveReq.birth(), DateTimeFormatter.ISO_DATE);
        this.birthType = BirthType.valueOf(memberSaveReq.birthType());
    }

    // 회원 정보 수정
    public void editInfo(MemberEditReq memberEditReq)   {
        this.name = memberEditReq.name();
        this.nickname = memberEditReq.nickname();
        this.birth = LocalDate.parse(memberEditReq.birth(), DateTimeFormatter.ISO_DATE);
        this.birthType = BirthType.valueOf(memberEditReq.birthType());
        if (Objects.nonNull(memberEditReq.phoneNumber())) {
            this.phoneNumber = memberEditReq.phoneNumber();
        }
    }
    
    // 토큰 수정
    public void saveNotificationToken(String token) {
        this.notificationToken = token;
    }

    // 기분 상태 수정
    public void editMood(String mood) {
        this.mood = mood;
    }
}
