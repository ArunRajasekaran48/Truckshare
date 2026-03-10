# TruckShare

Share extra truck space — book a whole truck or split your shipment across several trucks.

## Overview
TruckShare links truck owners who have spare space with businesses that need to ship goods. Businesses can book space by weight or volume. If needed, one shipment can be split across multiple trucks.

## Goal
Lower shipping cost and waste by matching available truck space with shipment needs. This makes shipping smaller loads cheaper and more flexible.

## Architecture

- **Microservices**: Spring Boot (Java) with Eureka service discovery
- **Database**: PostgreSQL (one database per service)
- **Messaging**: RabbitMQ (event-driven, async communication via Topic Exchange)
- **Sync Communication**: OpenFeign (used only for strict read queries, e.g., fetching shipment details during booking validation)
- **Gateway**: API Gateway for routing and centralized authorization
- **Resilience**: Transactional Outbox Pattern to guarantee at-least-once event delivery

## Services

| Service | Port | Responsibility |
|---|---|---|
| `api-gateway` | 9191 | Routes all requests, handles auth headers |
| `service-registry` | 8761 | Eureka service discovery |
| `user-service` | 8080 | User management & JWT authentication |
| `truck-service` | 8081 | Truck registration & capacity management |
| `shipment-service` | 8082 | Shipment creation & status tracking |
| `matching-service` | 8083 | Automatically matches shipments to available trucks |
| `booking-service` | 8084 | Booking proposals & payment acknowledgment |

## Event-Driven Flow (RabbitMQ)

All inter-service state changes flow asynchronously over a single RabbitMQ **Topic Exchange** (`truckshare.exchange`). Direct calls (Feign) are only used for read-only queries that need an immediate response.

```
[Business User]
    |
    | POST /shipments
    v
[shipment-service] ---(ShipmentCreatedEvent)---> [matching-service]
                                                        |
                                                        | Finds matching trucks, stores them
                                                        |
[Business User]
    |
    | GET /match/{shipmentId}       <-- Fetches stored matches
    |
    | POST /bookings
    v
[booking-service] ---(BookingCreatedEvent)---> [truck-service] (reserves capacity)
    |
    | POST /bookings/{id}/acknowledge-payment
    v
[booking-service] ---(BookingConfirmedEvent)---> [truck-service] (deducts capacity, may set FULL)
                                              \-> [shipment-service] (updates allocated weight/volume, sets BOOKED)
```

## Transactional Outbox Pattern

To ensure zero event loss (even if RabbitMQ is temporarily down), all producer services use the Transactional Outbox Pattern:

1. **Atomic Write**: The business entity (e.g., Booking) AND the corresponding `OutboxEvent` row are saved to PostgreSQL in the same local ACID transaction.
2. **Polling Publisher**: A `@Scheduled` background job in each producer service queries the `outbox_events` table every 5 seconds for unprocessed rows and publishes them to RabbitMQ.
3. **At-Least-Once Guarantee**: If RabbitMQ is down, the event sits safely in the database and is retried automatically once the broker recovers.

## Key Features

- Truck owners list trucks with route, available weight/volume.
- Businesses create shipment requests specifying pickup, drop-off, weight, and volume.
- Supports **non-split** (single truck) and **split** (multiple trucks) shipments.
- Automatic truck matching — when a shipment is created, `matching-service` finds suitable trucks in the background.
- Booking flow: view matched trucks → propose booking → acknowledge payment → shipment marked BOOKED.
- Shipment status lifecycle: **PENDING → MATCHED → PARTIALLY_BOOKED → BOOKED**.
- Truck capacity is automatically deducted once a booking is confirmed.

## Who It Helps
- **Truck owners** — earn from empty or partly empty trips.
- **Businesses** — ship small loads without paying for a full truck.
- **Logistics coordinators** — manage flexible, cost-effective shipments.

## Example End-to-End Flow

### 1. Register a truck
```
POST /trucks
{
  "fromLocation": "Chennai", "toLocation": "Bangalore",
  "capacityWeight": 1000.0, "capacityVolume": 500.0,
  "availableWeight": 1000.0, "availableVolume": 500.0
}
```

### 2. Create a shipment (split allowed)
```
POST /shipments
{
  "fromLocation": "Chennai", "toLocation": "Bangalore",
  "requiredWeight": 1000.0, "requiredVolume": 500.0,
  "isSplit": true
}
```
→ `matching-service` automatically receives a `ShipmentCreatedEvent` and stores matched trucks.

### 3. View matched trucks
```
GET /match/{shipmentId}
```
→ Returns a list of trucks that can fulfill the shipment.

### 4. Book a truck
```
POST /bookings
{ "shipmentId": "...", "truckId": "...", "allocatedWeight": 1000.0, "allocatedVolume": 500.0 }
```
→ Shipment status: **PARTIALLY_BOOKED** or **BOOKED**

### 5. Acknowledge payment
```
POST /bookings/{bookingId}/acknowledge-payment/{paymentReference}
```
→ `BookingConfirmedEvent` is published → Truck capacity is deducted → Shipment is marked **BOOKED**.

## Running Locally

**Prerequisites:**
- Java 21+
- PostgreSQL running on `localhost:5432`
- RabbitMQ running on `localhost:5672` (e.g., via Docker: `docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management`)

**Start order:**
1. `service-registry`
2. `api-gateway`
3. `truck-service`, `shipment-service`, `booking-service`, `matching-service`

> Hibernate (`ddl-auto=update`) will auto-create all required tables, including the `outbox_events` table, on first startup.

## FAQ

**Q: Can I split a shipment?**
A: Yes, set `isSplit: true` when creating the shipment.

**Q: What if RabbitMQ goes down during a booking?**
A: No events are lost. The Transactional Outbox Pattern persists all events to PostgreSQL first. They are automatically delivered once RabbitMQ recovers.

**Q: How do I know which trucks match my shipment?**
A: After creating a shipment, call `GET /match/{shipmentId}`. The `matching-service` has already computed and stored the best matches asynchronously.

**Q: When does a shipment become BOOKED?**
A: When the total confirmed allocated weight and volume equals the shipment's required amounts.
