package io.ssafy.gatee.domain.schedule.application;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.ssafy.gatee.domain.family.dao.FamilyRepository;
import io.ssafy.gatee.domain.family.entity.Family;
import io.ssafy.gatee.domain.family_schedule.dao.FamilyScheduleRepository;
import io.ssafy.gatee.domain.family_schedule.dao.FamilyScheduleRepositoryCustom;
import io.ssafy.gatee.domain.family_schedule.entity.FamilySchedule;
import io.ssafy.gatee.domain.file.dao.FileRepository;
import io.ssafy.gatee.domain.member.dao.MemberRepository;
import io.ssafy.gatee.domain.member.entity.Member;
import io.ssafy.gatee.domain.member_family.dao.MemberFamilyRepository;
import io.ssafy.gatee.domain.member_family.entity.MemberFamily;
import io.ssafy.gatee.domain.member_family_schedule.dao.MemberFamilyScheduleRepository;
import io.ssafy.gatee.domain.member_family_schedule.entity.MemberFamilySchedule;
import io.ssafy.gatee.domain.photo.dao.PhotoRepository;
import io.ssafy.gatee.domain.photo.entity.Photo;
import io.ssafy.gatee.domain.photo_schedule_record.dao.PhotoScheduleRecordRepository;
import io.ssafy.gatee.domain.photo_schedule_record.entity.PhotoScheduleRecord;
import io.ssafy.gatee.domain.push_notification.application.PushNotificationService;
import io.ssafy.gatee.domain.push_notification.dto.request.DataFCMReq;
import io.ssafy.gatee.domain.push_notification.dto.request.PushNotificationFCMReq;
import io.ssafy.gatee.domain.push_notification.entity.Type;
import io.ssafy.gatee.domain.schedule.dao.ScheduleRepository;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleEditReq;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleParticipateReq;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleSaveRecordReq;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleSaveReq;
import io.ssafy.gatee.domain.schedule.dto.response.ScheduleInfoRes;
import io.ssafy.gatee.domain.schedule.dto.response.ScheduleListInfoRes;
import io.ssafy.gatee.domain.schedule.dto.response.ScheduleListRes;
import io.ssafy.gatee.domain.schedule.entity.Category;
import io.ssafy.gatee.domain.schedule.entity.Schedule;
import io.ssafy.gatee.domain.schedule_record.dao.ScheduleRecordRepository;
import io.ssafy.gatee.domain.schedule_record.entity.ScheduleRecord;
import io.ssafy.gatee.global.exception.error.bad_request.DoNotHavePermissionException;
import io.ssafy.gatee.global.exception.error.not_found.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static io.ssafy.gatee.global.exception.message.ExceptionMessage.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;

    private final ScheduleRecordRepository scheduleRecordRepository;

    private final MemberRepository memberRepository;

    private final FamilyRepository familyRepository;

    private final MemberFamilyRepository memberFamilyRepository;

    private final FamilyScheduleRepository familyScheduleRepository;

    private final FamilyScheduleRepositoryCustom familyScheduleRepositoryCustom;

    private final MemberFamilyScheduleRepository memberFamilyScheduleRepository;

    private final PhotoRepository photoRepository;

    private final PhotoScheduleRecordRepository photoScheduleRecordRepository;

    private final FileRepository fileRepository;

    private final PushNotificationService pushNotificationService;

    // 전체 일정 조회
    @Override
    public ScheduleListRes readSchedule(Long familyId) throws FamilyNotFoundException {
        Family family = familyRepository.getReferenceById(familyId);

        return ScheduleListRes.builder()
                .personalScheduleList(familyScheduleRepositoryCustom.getPersonalScheduleList(family))
                .groupScheduleList(familyScheduleRepositoryCustom.getGroupScheduleList(family))
                .build();
    }

    // 일정 상세 조회
    @Override
    public ScheduleInfoRes readScheduleDetail(Long scheduleId, Long familyId) throws ScheduleNotFoundException, FamilyScheduleNotFoundException, MemberFamilyScheduleNotFoundException {
        Schedule schedule = scheduleRepository.getReferenceById(scheduleId);

        Family family = familyRepository.getReferenceById(familyId);

        FamilySchedule familySchedule = familyScheduleRepository.findByFamilyAndSchedule(family, schedule)
                .orElseThrow(() -> new FamilyScheduleNotFoundException(FAMILY_SCHEDULE_NOT_FOUND));

        List<MemberFamilySchedule> memberFamilyScheduleList = memberFamilyScheduleRepository.findAllByFamilySchedule(familySchedule)
                .orElseThrow(() -> new MemberFamilyScheduleNotFoundException(MEMBER_FAMILY_SCHEDULE_NOT_FOUND));

        List<Member> memberList = memberFamilyScheduleList.stream().map(MemberFamilySchedule::getMember).toList();

        return ScheduleInfoRes.toDto(schedule, memberList);
    }

    // 일정 등록
    @Override
    @Transactional
    public void saveSchedule(ScheduleSaveReq scheduleSaveReq, UUID memberId) throws FamilyNotFoundException, FirebaseMessagingException {
        Schedule schedule = Schedule.builder()
                .category(Category.valueOf(scheduleSaveReq.category()))
                .title(scheduleSaveReq.title())
                .emoji(scheduleSaveReq.emoji())
                .content(scheduleSaveReq.content())
                .startDate(LocalDateTime.parse(scheduleSaveReq.startDate()))
                .endDate(LocalDateTime.parse(scheduleSaveReq.endDate()))
                .build();

        scheduleRepository.save(schedule);

        Member member = memberRepository.getReferenceById(memberId);

        Family family = familyRepository.getReferenceById(Long.valueOf(scheduleSaveReq.familyId()));

        FamilySchedule familySchedule = FamilySchedule.builder()
                .schedule(schedule)
                .family(family)
                .build();

        familyScheduleRepository.save(familySchedule);

        MemberFamilySchedule memberFamilySchedule = MemberFamilySchedule.builder()
                .member(member)
                .familySchedule(familySchedule)
                .isCreater(true)
                .build();

        memberFamilyScheduleRepository.save(memberFamilySchedule);

        // 알림발송
        pushNotificationService.sendPushOneToMany(PushNotificationFCMReq.builder()
                                .senderId(memberId)
                                .receiverId(memberFamilyRepository.findMyFamily(memberId))
                                .title("일정 등록")
                                .content(member.getName() + "님이 일정을 등록하였습니다.")
                                .dataFCMReq(DataFCMReq.builder()
                                    .type(Type.SCHEDULE)
                                    .typeId(schedule.getId()).build())
                                .build());
    }

    // 일정 수정
    @Override
    @Transactional
    public void editSchedule(ScheduleEditReq scheduleEditReq, UUID memberId, Long scheduleId)
            throws DoNotHavePermissionException, FamilyScheduleNotFoundException, MemberFamilyScheduleNotFoundException, FamilyNotFoundException {
        Member member = memberRepository.getReferenceById(memberId);

        Family family = familyRepository.getReferenceById(Long.valueOf(scheduleEditReq.familyId()));

        Schedule schedule = scheduleRepository.getReferenceById(scheduleId);

        FamilySchedule familySchedule = familyScheduleRepository.findByFamilyAndSchedule(family, schedule)
                .orElseThrow(() -> new FamilyScheduleNotFoundException(FAMILY_SCHEDULE_NOT_FOUND));

        MemberFamilySchedule memberFamilySchedule = memberFamilyScheduleRepository.findByMemberAndFamilySchedule(member, familySchedule)
                .orElseThrow(() -> new MemberFamilyScheduleNotFoundException(MEMBER_FAMILY_SCHEDULE_NOT_FOUND));

        // 해당 유저가 일정을 만든 사람인지 확인
        if (memberFamilySchedule.isCreater()) {
            schedule.editSchedule(scheduleEditReq);
        } else {
            throw new DoNotHavePermissionException(DO_NOT_HAVE_REQUEST);
        }
    }

    // 일정 참여
    @Override
    @Transactional
    public void participateSchedule(ScheduleParticipateReq scheduleParticipateReq, UUID memberId, Long scheduleId)
            throws FamilyScheduleNotFoundException {
        Member member = memberRepository.getReferenceById(memberId);

        Family family = familyRepository.getReferenceById(Long.valueOf(scheduleParticipateReq.familyId()));

        Schedule schedule = scheduleRepository.getReferenceById(scheduleId);

        FamilySchedule familySchedule = familyScheduleRepository.findByFamilyAndSchedule(family, schedule)
                .orElseThrow(() -> new FamilyScheduleNotFoundException(FAMILY_SCHEDULE_NOT_FOUND));

        memberFamilyScheduleRepository.findByMemberAndFamilySchedule(member, familySchedule)
            .orElse(memberFamilyScheduleRepository.save(MemberFamilySchedule.builder()
                        .member(member)
                        .familySchedule(familySchedule)
                        .isCreater(false)
                        .build())
            );
    }

    // 일정 후기 등록
    @Override
    @Transactional
    public void saveScheduleRecord(ScheduleSaveRecordReq scheduleSaveRecordReq, UUID memberId, Long scheduleId) {
        Member member = memberRepository.getReferenceById(memberId);

        Family family = familyRepository.getReferenceById(scheduleSaveRecordReq.familyId());

        MemberFamily memberFamily = memberFamilyRepository.findByMemberAndFamily(member, family)
                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND));

        Schedule schedule = scheduleRepository.getReferenceById(scheduleId);

        ScheduleRecord scheduleRecord = ScheduleRecord.builder()
                .content(scheduleSaveRecordReq.content())
                .schedule(schedule)
                .build();

        scheduleRecordRepository.save(scheduleRecord);

        List<Photo> photos = scheduleSaveRecordReq.fileIdList().stream().map(fileId ->
            Photo.builder()
                    .memberFamily(memberFamily)
                    .file(fileRepository.getReferenceById(fileId))
                    .build()).toList();

        List<Photo> photoList = photoRepository.saveAll(photos);

        List<PhotoScheduleRecord> photoScheduleRecordList = photoList.stream().map(photo ->
                PhotoScheduleRecord.builder()
                        .photo(photo)
                        .scheduleRecord(scheduleRecord)
                        .build()).toList();

        photoScheduleRecordRepository.saveAll(photoScheduleRecordList);
    }
}
