package io.ssafy.gatee.global.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class FirebaseInit {

    @Value("${firebase.database-url}")
    private String databaseUrl;

    @Value("${firebase.admin-sdk-path}")
    private String adminSdkPath;

    private boolean isInitialized = false;

    @PostConstruct
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
