package com.nguyenminhtri.example05.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.dto.BannerDTO;
import com.nguyenminhtri.example05.entity.Banner;
import com.nguyenminhtri.example05.exceptions.ResourceNotFoundException;
import com.nguyenminhtri.example05.repository.BannerRepo;
import com.nguyenminhtri.example05.service.BannerService;
import com.nguyenminhtri.example05.service.FileService;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerRepo bannerRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;

    @Override
    public BannerDTO createBanner(BannerDTO bannerDTO) {
        Banner banner = modelMapper.map(bannerDTO, Banner.class);
        banner.setImage("default.png"); // Set default image
        Banner savedBanner = bannerRepo.save(banner);
        return modelMapper.map(savedBanner, BannerDTO.class);
    }

    @Override
    public BannerDTO updateBanner(Long id, BannerDTO bannerDTO) {
        Banner banner = bannerRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Banner", "id", id));

        banner.setName(bannerDTO.getName());
        banner.setImage(bannerDTO.getImage());
        banner.setActive(bannerDTO.isActive());

        Banner updatedBanner = bannerRepo.save(banner);
        return modelMapper.map(updatedBanner, BannerDTO.class);
    }

    @Override
    public BannerDTO updateBannerImage(Long bannerId, MultipartFile image) throws IOException {
        Banner banner = bannerRepo.findById(bannerId)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", "id", bannerId));

        String fileName = fileService.uploadImage(path, image);
        banner.setImage(fileName);

        Banner updatedBanner = bannerRepo.save(banner);
        return modelMapper.map(updatedBanner, BannerDTO.class);
    }

    @Override
    public void deleteBanner(Long id) {
        Banner banner = bannerRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Banner", "id", id));
        bannerRepo.delete(banner);
    }

    @Override
    public BannerDTO getBannerById(Long id) {
        Banner banner = bannerRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Banner", "id", id));
        return modelMapper.map(banner, BannerDTO.class);
    }

    @Override
    public List<BannerDTO> getAllBanners() {
        List<Banner> banners = bannerRepo.findAll();
        return banners.stream()
            .map(banner -> modelMapper.map(banner, BannerDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    public List<BannerDTO> getActiveBanners() {
        List<Banner> banners = bannerRepo.findByActiveTrue();
        return banners.stream()
            .map(banner -> modelMapper.map(banner, BannerDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    public InputStream getBannerImage(String fileName) throws FileNotFoundException {
        return fileService.getResource(path, fileName);
    }
} 