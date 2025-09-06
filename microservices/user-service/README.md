# User Service

A microservice for managing business users and truck owners in the TruckShare platform.

## Features

### Business Users
- User registration and authentication
- Profile management
- Company and business type information
- Location-based search
- Business type filtering

### Truck Owners
- Driver registration and authentication
- Vehicle information management
- License tracking and validation
- Capacity-based search
- Rating system
- Active driver management

## API Endpoints

### Business Users

#### Registration & Authentication
- `POST /api/v1/business-users/register` - Register new business user
- `POST /api/v1/business-users/login` - Login business user

#### User Management
- `GET /api/v1/business-users/{id}` - Get user by ID
- `PUT /api/v1/business-users/{id}` - Update user
- `DELETE /api/v1/business-users/{id}` - Delete user
- `GET /api/v1/business-users` - Get all users

#### Search & Filtering
- `GET /api/v1/business-users/search/company?companyName={name}` - Search by company
- `GET /api/v1/business-users/search/business-type?businessType={type}` - Search by business type
- `GET /api/v1/business-users/search/location?city={city}&state={state}` - Search by location

### Truck Owners

#### Registration & Authentication
- `POST /api/v1/truck-owners/register` - Register new truck owner
- `POST /api/v1/truck-owners/login` - Login truck owner

#### User Management
- `GET /api/v1/truck-owners/{id}` - Get truck owner by ID
- `PUT /api/v1/truck-owners/{id}` - Update truck owner
- `DELETE /api/v1/truck-owners/{id}` - Delete truck owner
- `GET /api/v1/truck-owners` - Get all truck owners

#### Search & Filtering
- `GET /api/v1/truck-owners/search/vehicle-type?vehicleType={type}` - Search by vehicle type
- `GET /api/v1/truck-owners/search/capacity?minWeight={weight}&minVolume={volume}` - Search by capacity
- `GET /api/v1/truck-owners/active` - Get active drivers
- `GET /api/v1/truck-owners/expiring-licenses` - Get drivers with expiring licenses
- `GET /api/v1/truck-owners/top-rated?minRating={rating}` - Get top rated drivers

#### Rating Management
- `PUT /api/v1/truck-owners/{id}/rating?rating={rating}` - Update driver rating

### Health Check
- `GET /api/v1/health` - Service health check

## Data Models

### BusinessUser
- Personal information (name, email, phone)
- Company details (name, type, address)
- Location (city, state, pincode)
- Timestamps (created, updated)

### TruckOwner
- Personal information (name, email, phone)
- Driver details (license number, expiry date)
- Vehicle information (registration, type, capacity)
- Rating and performance metrics

## Validation Rules

### Business User Registration
- Email: Valid email format, unique
- Password: Required
- Name: First and last name required
- Phone: 10-digit Indian mobile number
- Company: Company name required
- Pincode: 6-digit Indian pincode

### Truck Owner Registration
- Email: Valid email format, unique
- Password: Required
- Name: First and last name required
- Phone: 10-digit Indian mobile number
- License: Valid driving license format
- Vehicle Registration: Valid Indian vehicle registration format
- Capacity: Positive values for weight and volume

## Error Handling

The service includes comprehensive error handling with:
- Custom exception classes
- Global exception handler
- Standardized error responses
- Validation error details
- Proper HTTP status codes

## Security

- Password encryption using BCrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Database

- PostgreSQL database
- JPA/Hibernate for ORM
- Automatic table creation
- Indexed fields for performance

## Configuration

### Application Properties
```properties
spring.application.name=user-service
spring.datasource.url=jdbc:postgresql://localhost:5432/truckshare_user-service
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

## Running the Service

1. Ensure PostgreSQL is running
2. Create the database: `truckshare_user-service`
3. Update application.properties with your database credentials
4. Run: `mvn spring-boot:run`

## Testing

### Sample Business User Registration
```json
POST /api/v1/business-users/register
{
  "email": "business@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "9876543210",
  "companyName": "ABC Logistics",
  "businessType": "Logistics",
  "businessAddress": "123 Business Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

### Sample Truck Owner Registration
```json
POST /api/v1/truck-owners/register
{
  "email": "driver@example.com",
  "password": "password123",
  "firstName": "Raj",
  "lastName": "Kumar",
  "phoneNumber": "9876543210",
  "drivingLicenseNumber": "DL1234567890123",
  "licenseExpiryDate": "2025-12-31",
  "vehicleRegistrationNumber": "KA01AB1234",
  "vehicleType": "Truck",
  "maxWeightCapacity": 1000.0,
  "maxVolumeCapacity": 50.0
}
```

## Dependencies

- Spring Boot 3.5.5
- Spring Data JPA
- Spring Web
- Spring Validation
- PostgreSQL Driver
- Lombok
- Spring Boot Actuator

## Future Enhancements

- JWT-based authentication
- Role-based access control
- Email verification
- Password reset functionality
- Advanced search and filtering
- Caching for better performance
- API rate limiting
- Comprehensive logging and monitoring

