package io.ssafy.gatee.global.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class FirebaseInit {

    @Value("${firebase.database-url}")
    private String databaseUrl;

    @Value("${firebase.admin-sdk-path}")
    private String adminSdkPath;

    private boolean isInitialized = false;

    @PostConstruct // 의존성 주입 완료 후 실행, 생성자보다 늦게 호출, 다른 리소스에서 호출되지 않아도 수행된다
    public void init() {
        try {
            if (!isInitialized) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setDatabaseUrl(databaseUrl)
                        .setCredentials(GoogleCredentials.fromStream(new ClassPathResource(adminSdkPath).getInputStream()))
                        .build();
                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    isInitialized = true;
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}