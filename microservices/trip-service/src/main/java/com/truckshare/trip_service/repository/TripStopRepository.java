package com.truckshare.trip_service.repository;

import com.truckshare.trip_service.models.TripStop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TripStopRepository extends JpaRepository<TripStop, UUID> {
}
