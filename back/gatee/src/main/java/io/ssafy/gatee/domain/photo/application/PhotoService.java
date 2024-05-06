package io.ssafy.gatee.domain.photo.application;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.ssafy.gatee.domain.photo.dto.request.PhotoListReq;
import io.ssafy.gatee.domain.photo.dto.request.PhotoSaveReq;
import io.ssafy.gatee.domain.photo.dto.response.PhotoDetailRes;
import io.ssafy.gatee.domain.photo.dto.response.PhotoListRes;
import io.ssafy.gatee.global.exception.error.bad_request.DoNotHavePermissionException;
import io.ssafy.gatee.global.exception.error.bad_request.WrongTypeFilterException;

import java.util.List;
import java.util.UUID;

public interface PhotoService {
    List<PhotoListRes> readPhotoList(PhotoListReq photoListReq) throws WrongTypeFilterException;
    PhotoDetailRes readPhotoDetail(Long photoId, UUID memberId);
    Long savePhoto(PhotoSaveReq photoSaveReq, UUID memberId) throws FirebaseMessagingException;
    void deletePhoto(Long memberFamilyId, Long photoId) throws DoNotHavePermissionException;
    void savePhotoReaction(UUID memberId, Long photoId);
    void deletePhotoReaction(UUID memberId, Long photoId);
}
