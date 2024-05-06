package io.ssafy.gatee.domain.photo.api;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.ssafy.gatee.domain.photo.application.PhotoService;
import io.ssafy.gatee.domain.photo.dto.request.PhotoListReq;
import io.ssafy.gatee.domain.photo.dto.request.PhotoSaveReq;
import io.ssafy.gatee.domain.photo.dto.response.PhotoDetailRes;
import io.ssafy.gatee.domain.photo.dto.response.PhotoListRes;
import io.ssafy.gatee.global.exception.error.bad_request.DoNotHavePermissionException;
import io.ssafy.gatee.global.exception.error.bad_request.WrongTypeFilterException;
import io.ssafy.gatee.global.security.user.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {
    private final PhotoService photoService;

    // 사진 목록 조회 (QueryDSL 구현)
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<PhotoListRes> readPhotoList(
            @Valid
            @RequestBody PhotoListReq photoListReq
    ) throws WrongTypeFilterException {
        return photoService.readPhotoList(photoListReq);
    }

    // 사진 상세 조회
    @GetMapping("/{photoId}")
    @ResponseStatus(HttpStatus.OK)
    public PhotoDetailRes readPhotoDetail(
            @PathVariable("photoId") Long photoId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
            ) {
        return photoService.readPhotoDetail(photoId, customUserDetails.getMemberId());
    }

    // 사진 등록
    @PostMapping("/save")
    @ResponseStatus(HttpStatus.OK)
    public Long savePhoto(@Valid @RequestBody PhotoSaveReq photoSaveReq, @AuthenticationPrincipal CustomUserDetails customUserDetails) throws FirebaseMessagingException {
        return photoService.savePhoto(photoSaveReq, customUserDetails.getMemberId());
    }

    // 사진 삭제
    @DeleteMapping("/{photoId}")
    @ResponseStatus(HttpStatus.OK)
    public void deletePhoto(
            @Valid
            @RequestParam Long memberFamilyId,
            @PathVariable("photoId") Long photoId
    ) throws DoNotHavePermissionException {
        photoService.deletePhoto(memberFamilyId, photoId);
    }

    // 사진 상호작용 생성
    @PostMapping("/{photoId}/reaction")
    @ResponseStatus(HttpStatus.OK)
    public void savePhotoReaction(
            @Valid
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable("photoId") Long photoId
    ) {
        photoService.savePhotoReaction(customUserDetails.getMemberId(), photoId);
    }

    // 사진 상호작용 취소
    @DeleteMapping("/{photoId}/reaction")
    @ResponseStatus(HttpStatus.OK)
    public void deletePhotoReaction(
            @Valid
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PathVariable("photoId") Long photoId
    ){
        photoService.deletePhotoReaction(customUserDetails.getMemberId(), photoId);
    }
}
