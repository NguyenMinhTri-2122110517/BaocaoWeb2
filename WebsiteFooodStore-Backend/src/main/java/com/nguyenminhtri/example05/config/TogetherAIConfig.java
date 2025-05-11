package com.nguyenminhtri.example05.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.Bean;

@Configuration
public class TogetherAIConfig {
    
    @Value("${together.api.key}")
    private String apiKey;

    @Value("${together.model.id}")
    private String modelId;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getModelId() {
        return modelId;
    }
} 