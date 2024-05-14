package io.ssafy.gatee.domain.schedule_record.dto.response;

import io.ssafy.gatee.domain.file.dto.FileUrlRes;
import io.ssafy.gatee.domain.file.entity.File;
import io.ssafy.gatee.domain.schedule_record.entity.ScheduleRecord;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;

@Builder
public record ScheduleRecordRes(

        @NotNull
        String content,

        @NotNull
        List<FileUrlRes> fileUrlList
) {
    public static ScheduleRecordRes toDto(ScheduleRecord scheduleRecord, List<File> fileList) {
        return ScheduleRecordRes.builder()
                .content(scheduleRecord.getContent())
                .fileUrlList(fileList.stream().map(FileUrlRes::toDto).toList())
                .build();
    }
}
