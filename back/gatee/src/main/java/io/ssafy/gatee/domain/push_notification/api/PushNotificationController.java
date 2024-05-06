package io.ssafy.gatee.domain.push_notification.api;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.ssafy.gatee.domain.push_notification.application.PushNotificationService;
import io.ssafy.gatee.domain.push_notification.dto.request.NaggingReq;
import io.ssafy.gatee.domain.push_notification.dto.request.TokenReq;
import io.ssafy.gatee.global.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class PushNotificationController {

    private final PushNotificationService notificationService;

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/test")
    public String testNotice(@RequestBody TokenReq tokenReq) throws FirebaseMessagingException {
        log.info(tokenReq.token());
        notificationService.sendTestPush(tokenReq.token());
        return "notification success";
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/nagging")
    public void sendNagging(@RequestBody NaggingReq naggingReq, @AuthenticationPrincipal CustomUserDetails customUserDetails) throws FirebaseMessagingException {
        notificationService.sendNagging(naggingReq, customUserDetails.getMemberId());
    }
}
