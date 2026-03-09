package com.truckshare.truck_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TruckServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TruckServiceApplication.class, args);
	}

}
