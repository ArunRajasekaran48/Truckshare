package com.truckshare.truck_service.services;

import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.repository.TruckRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TruckService {

    private final TruckRepository truckRepository;

    public TruckService(TruckRepository truckRepository) {
        this.truckRepository = truckRepository;
    }

    public Truck createTruck(Truck truck) {
        // Business logic can be added later
        return truckRepository.save(truck);
    }

    public List<Truck> searchTrucks(String from, String to) {
        return truckRepository.findByFromLocationAndToLocation(from, to);
    }
}
