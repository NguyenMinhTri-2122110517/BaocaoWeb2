package com.nguyenminhtri.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.dto.BannerDTO;
import com.nguyenminhtri.example05.service.BannerService;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    @PostMapping("/admin/banners")
    public ResponseEntity<BannerDTO> createBanner(@RequestBody BannerDTO bannerDTO) {
        BannerDTO createdBanner = bannerService.createBanner(bannerDTO);
        return new ResponseEntity<>(createdBanner, HttpStatus.CREATED);
    }

    @PutMapping("/admin/banners/{id}")
    public ResponseEntity<BannerDTO> updateBanner(
            @PathVariable Long id,
            @RequestBody BannerDTO bannerDTO) {
        BannerDTO updatedBanner = bannerService.updateBanner(id, bannerDTO);
        return ResponseEntity.ok(updatedBanner);
    }

    @PutMapping("/admin/banners/{bannerId}/image")
    public ResponseEntity<BannerDTO> updateBannerImage(
            @PathVariable Long bannerId,
            @RequestParam("image") MultipartFile image) throws IOException {
        BannerDTO updatedBanner = bannerService.updateBannerImage(bannerId, image);
        return new ResponseEntity<>(updatedBanner, HttpStatus.OK);
    }

    @DeleteMapping("/admin/banners/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/banners")
    public ResponseEntity<List<BannerDTO>> getAllBanners() {
        List<BannerDTO> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(banners);
    }

    @GetMapping("/public/banners/active")
    public ResponseEntity<List<BannerDTO>> getActiveBanners() {
        List<BannerDTO> activeBanners = bannerService.getActiveBanners();
        return ResponseEntity.ok(activeBanners);
    }

    @GetMapping("/public/banners/{id}")
    public ResponseEntity<BannerDTO> getBannerById(@PathVariable Long id) {
        BannerDTO banner = bannerService.getBannerById(id);
        return ResponseEntity.ok(banner);
    }

    @GetMapping("/public/banners/image/{fileName}")
    public ResponseEntity<InputStreamResource> getBannerImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = bannerService.getBannerImage(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);
        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }
} 