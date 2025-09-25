package com.truckshare.booking_service.repository;

import com.truckshare.booking_service.entity.ShipmentTruck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<ShipmentTruck, UUID> {

    // Get all bookings for a specific shipment
    List<ShipmentTruck> findByShipmentId(UUID shipmentId);

    // Get all bookings for a specific truck
    List<ShipmentTruck> findByTruckId(UUID truckId);
}
