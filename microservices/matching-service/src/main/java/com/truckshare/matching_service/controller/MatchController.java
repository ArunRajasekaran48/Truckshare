package com.truckshare.matching_service.controller;

import com.truckshare.matching_service.dto.MatchResponseDTO;
import com.truckshare.matching_service.dto.TruckResponseDTO;
import com.truckshare.matching_service.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/match")
@RequiredArgsConstructor
public class MatchController {

    MatchingService matchingService;
    @GetMapping("/{id}")
    public ResponseEntity<List<TruckResponseDTO>> getMatches(@PathVariable UUID id){
        return matchingService.findMatches(id);
    }
}
