package com.nguyenminhtri.example05.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenminhtri.example05.service.FileService;

@Service
public class FileServiceImpl implements FileService {

    @Value("${project.image}")
    private String path;

    @Override
    public String uploadImage(String path, MultipartFile file) throws IOException {
        // Get file name
        String name = file.getOriginalFilename();

        // Random name generate file
        String randomId = UUID.randomUUID().toString();
        String fileName = randomId.concat(name.substring(name.lastIndexOf(".")));

        // Full path
        String filePath = path + File.separator + fileName;

        // Create folder if not created
        File f = new File(path);
        if (!f.exists()) {
            f.mkdir();
        }

        // File copy
        Files.copy(file.getInputStream(), Paths.get(filePath));

        return fileName;
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(path, file);
    }

    @Override
    public InputStream getResource(String path, String fileName) throws FileNotFoundException {
        String fullPath = path + File.separator + fileName;
        InputStream is = new FileInputStream(fullPath);
        return is;
    }
}
