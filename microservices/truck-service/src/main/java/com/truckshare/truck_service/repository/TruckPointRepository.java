package com.truckshare.truck_service.repository;

import com.truckshare.truck_service.models.TruckPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TruckPointRepository extends JpaRepository<TruckPoint, UUID> {
}
