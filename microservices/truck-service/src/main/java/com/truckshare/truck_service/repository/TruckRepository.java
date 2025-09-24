package com.truckshare.truck_service.repository;

import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.models.TruckStatus;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TruckRepository extends JpaRepository<Truck, UUID> {
   @Query("SELECT t FROM Truck t WHERE t.status = :status AND t.fromLocation = :from AND t.toLocation = :to AND t.availableWeight >= :requiredWeight AND t.availableVolume >= :requiredVolume")
    List<Truck> findByFromLocationAndToLocationWithCapacity(@Param("from") String from,
                                                       @Param("to") String to,
                                                       @Param("requiredWeight") Double requiredWeight,
                                                       @Param("requiredVolume") Double requiredVolume,
                                                       @Param("status") TruckStatus status);
    Optional<Truck> findById(UUID id);
    
    List<Truck> findByOwnerId(String ownerId);

    List<Truck> findByStatus(TruckStatus status);
    List<Truck> findByFromLocationAndToLocationAndStatus(String from, String to, TruckStatus status);
}
