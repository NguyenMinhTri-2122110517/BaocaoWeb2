package com.nguyenminhtri.example05.security.oauth2;

import java.util.Map;

public class OAuth2UserInfo {
    private Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public String getEmail() {
        return (String) attributes.get("email");
    }

    public String getName() {
        return (String) attributes.get("name");
    }

    public String getPicture() {
        return (String) attributes.get("picture");
    }
} 