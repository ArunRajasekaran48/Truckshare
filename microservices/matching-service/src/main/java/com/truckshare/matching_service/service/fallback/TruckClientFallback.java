package com.truckshare.matching_service.service.fallback;

import com.truckshare.matching_service.dto.TruckResponseDTO;
import com.truckshare.matching_service.exception.ExternalServiceUnavailableException;
import com.truckshare.matching_service.service.TruckClient;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class TruckClientFallback implements TruckClient {

    @Override
    public List<TruckResponseDTO> searchTrucks(String from, String to, Double weight, Double volume) {
        throw new ExternalServiceUnavailableException("Truck service is unavailable. Please try again later.");
    }

    @Override
    public List<TruckResponseDTO> splitSearchTrucks(String from, String to) {
        throw new ExternalServiceUnavailableException("Truck service is unavailable. Please try again later.");
    }
}