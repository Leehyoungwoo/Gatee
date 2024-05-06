package io.ssafy.gatee.domain.photo.application;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.ssafy.gatee.domain.family.dao.FamilyRepository;
import io.ssafy.gatee.domain.family.entity.Family;
import io.ssafy.gatee.domain.file.dao.FileRepository;
import io.ssafy.gatee.domain.file.entity.File;
import io.ssafy.gatee.domain.member.dao.MemberRepository;
import io.ssafy.gatee.domain.member.entity.Member;
import io.ssafy.gatee.domain.member_family.dao.MemberFamilyRepository;
import io.ssafy.gatee.domain.member_family.entity.MemberFamily;
import io.ssafy.gatee.domain.photo.dao.PhotoRepository;
import io.ssafy.gatee.domain.photo.dao.PhotoRepositoryCustom;
import io.ssafy.gatee.domain.photo.dto.request.Filter;
import io.ssafy.gatee.domain.photo.dto.request.PhotoListReq;
import io.ssafy.gatee.domain.photo.dto.request.PhotoSaveReq;
import io.ssafy.gatee.domain.photo.dto.response.PhotoDetailRes;
import io.ssafy.gatee.domain.photo.dto.response.PhotoListRes;
import io.ssafy.gatee.domain.photo.entity.Photo;
import io.ssafy.gatee.domain.push_notification.application.PushNotificationService;
import io.ssafy.gatee.domain.push_notification.dto.request.DataFCMReq;
import io.ssafy.gatee.domain.push_notification.dto.request.PushNotificationFCMReq;
import io.ssafy.gatee.domain.push_notification.entity.Type;
import io.ssafy.gatee.domain.reaction.dao.ReactionRepository;
import io.ssafy.gatee.domain.reaction.dto.response.ReactionMemberRes;
import io.ssafy.gatee.domain.reaction.entity.Reaction;
import io.ssafy.gatee.global.exception.error.bad_request.DoNotHavePermissionException;
import io.ssafy.gatee.global.exception.error.bad_request.WrongTypeFilterException;
import io.ssafy.gatee.global.exception.error.not_found.MemberFamilyNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static io.ssafy.gatee.global.exception.message.ExceptionMessage.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PhotoServiceImpl implements PhotoService {

    private final PhotoRepository photoRepository;

    private final MemberRepository memberRepository;

    private final FamilyRepository familyRepository;

    private final MemberFamilyRepository memberFamilyRepository;

    private final ReactionRepository reactionRepository;

    private final FileRepository fileRepository;

    private final PhotoRepositoryCustom photoRepositoryCustom;

    private final PushNotificationService pushNotificationService;

    // 사진 목록 조회
    @Override
    public List<PhotoListRes> readPhotoList(PhotoListReq photoListReq) throws WrongTypeFilterException {
        Family family = familyRepository.getReferenceById(photoListReq.familyId());

        List<MemberFamily> memberFamilyList = memberFamilyRepository.findAllByFamily(family)
                .orElseThrow(() -> new MemberFamilyNotFoundException(MEMBER_FAMILY_NOT_FOUND));

        Filter filter = Filter.valueOf(photoListReq.filter());

        List<Photo> photoList;

        if (Filter.DAY.equals(filter)) {
            photoList = photoRepositoryCustom.findPhotoListByDay(memberFamilyList);
        } else if (Filter.MONTH.equals(filter)) {
            photoList = photoRepositoryCustom.findPhotoListByMonth(memberFamilyList, photoListReq.year(), photoListReq.month());
        } else if (Filter.YEAR.equals(filter)) {
            photoList = photoRepositoryCustom.findPhotoListByYear(memberFamilyList, photoListReq.year());
        } else {
            throw new WrongTypeFilterException(WRONG_TYPE_FILTER);
        }

        return photoList.stream().map(PhotoListRes::toDto).toList();
    }

    // 사진 상세 조회
    @Override
    public PhotoDetailRes readPhotoDetail(Long photoId, UUID memberId) {
        Photo photo = photoRepository.getReferenceById(photoId);

        List<Reaction> reactionList = reactionRepository.findAllByPhoto(photo);

        List<ReactionMemberRes> reactionMemberResList = reactionList.stream()
                .map(ReactionMemberRes::toDto).toList();

        boolean isReaction = false;

        List<Boolean> booleans = reactionList.stream().map((Reaction reaction) -> memberId.equals(reaction.getMember().getId())).toList();

        if (booleans.contains(true)) {
            isReaction = true;
        }

        return PhotoDetailRes.builder()
                .photoId(photoId)
                .imageUrl(photo.getFile().getUrl())
                .reactionList(reactionMemberResList)
                .isReaction(isReaction)
                .build();
    }

    // 사진 등록
    @Override
    @Transactional
    public Long savePhoto(PhotoSaveReq photoSaveReq, UUID memberId) throws FirebaseMessagingException {
        MemberFamily memberFamily = memberFamilyRepository.getReferenceById(photoSaveReq.memberFamilyId());

        File file = fileRepository.getReferenceById(photoSaveReq.fileId());

        Photo photo = Photo.builder()
                .memberFamily(memberFamily)
                .file(file)
                .build();

        photoRepository.save(photo);


        
        // 사진 등록시 가족들에게 알림
        pushNotificationService.sendPushOneToMany(PushNotificationFCMReq.builder()
                        .title("앨범 사진 등록")
                        .content(memberFamily.getMember().getName() + "님이 사진을 등록하셨습니다.")
                        .receiverId(memberFamilyRepository.findMyFamily(memberId))
                        .senderId(memberFamily.getMember().getId())
                        .dataFCMReq(DataFCMReq.builder()
                                .type(Type.ALBUM)
                                .typeId(photo.getId())
                                .build())
                        .build());

        return photo.getId();
    }

    // 사진 삭제
    @Override
    @Transactional
    public void deletePhoto(Long memberFamilyId, Long photoId) throws DoNotHavePermissionException {
        Photo photo = photoRepository.getReferenceById(photoId);

        if (photo.getMemberFamily().getId().equals(memberFamilyId)) {
            photo.deleteData();
        } else {
            throw new DoNotHavePermissionException(DO_NOT_HAVE_REQUEST);
        }
    }

    // 사진 상호작용 생성
    @Override
    @Transactional
    public void savePhotoReaction(UUID memberId, Long photoId) {
        Photo photo = photoRepository.getReferenceById(photoId);

        Member member = memberRepository.getReferenceById(memberId);

        Reaction reaction = Reaction.builder()
                .photo(photo)
                .member(member)
                .build();

        reactionRepository.save(reaction);
    }

    // 사진 상호작용 삭제
    @Override
    @Transactional
    public void deletePhotoReaction(UUID memberId, Long photoId) {
        Photo photo = photoRepository.getReferenceById(photoId);

        Member member = memberRepository.getReferenceById(memberId);

        Reaction reaction = reactionRepository.findReactionByMemberAndPhoto(member, photo);

        reactionRepository.delete(reaction);
    }
}
