package io.ssafy.gatee.domain.schedule.application;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleEditReq;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleParticipateReq;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleSaveRecordReq;
import io.ssafy.gatee.domain.schedule.dto.request.ScheduleSaveReq;
import io.ssafy.gatee.domain.schedule.dto.response.ScheduleInfoRes;
import io.ssafy.gatee.domain.schedule.dto.response.ScheduleListRes;
import io.ssafy.gatee.global.exception.error.bad_request.DoNotHavePermissionException;
import io.ssafy.gatee.global.exception.error.not_found.FamilyNotFoundException;
import io.ssafy.gatee.global.exception.error.not_found.FamilyScheduleNotFoundException;
import io.ssafy.gatee.global.exception.error.not_found.MemberFamilyScheduleNotFoundException;
import io.ssafy.gatee.global.exception.error.not_found.ScheduleNotFoundException;

import java.util.UUID;

public interface ScheduleService {
    ScheduleListRes readSchedule(Long familyId) throws FamilyNotFoundException;
    ScheduleInfoRes readScheduleDetail(Long scheduleId, Long familyId) throws ScheduleNotFoundException, FamilyScheduleNotFoundException, MemberFamilyScheduleNotFoundException;
    void saveSchedule(ScheduleSaveReq scheduleSaveReq, UUID memberId) throws FamilyNotFoundException, FirebaseMessagingException;
    void editSchedule(ScheduleEditReq scheduleEditReq, UUID memberId, Long scheduleId) throws ScheduleNotFoundException, DoNotHavePermissionException, FamilyScheduleNotFoundException, MemberFamilyScheduleNotFoundException, FamilyNotFoundException;
    void participateSchedule(ScheduleParticipateReq scheduleParticipateReq, UUID memberId, Long scheduleId) throws FamilyScheduleNotFoundException, MemberFamilyScheduleNotFoundException;
    void saveScheduleRecord(ScheduleSaveRecordReq scheduleSaveRecordReq, UUID memberId, Long scheduleId);
}
