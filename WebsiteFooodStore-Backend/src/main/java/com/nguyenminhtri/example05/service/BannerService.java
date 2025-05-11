package com.nguyenminhtri.example05.service;

import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.dto.BannerDTO;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface BannerService {
    BannerDTO createBanner(BannerDTO bannerDTO);
    BannerDTO updateBanner(Long id, BannerDTO bannerDTO);
    BannerDTO updateBannerImage(Long bannerId, MultipartFile image) throws IOException;
    void deleteBanner(Long id);
    BannerDTO getBannerById(Long id);
    List<BannerDTO> getAllBanners();
    List<BannerDTO> getActiveBanners();
    InputStream getBannerImage(String fileName) throws FileNotFoundException;
} 