package com.truckshare.truck_service.repository;

import com.truckshare.truck_service.models.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TruckRepository extends JpaRepository<Truck, UUID> {
    List<Truck> findByFromLocationAndToLocation(String from, String to);
}
