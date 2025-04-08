# Time Capsule Booking System

A backend system for managing time capsule bookings where users can schedule messages and files to be delivered to their future selves. The system ensures only one capsule per user per day is delivered, with automatic rescheduling based on priority.

## Features

- Create time capsules with messages and optional file metadata
- Priority-based delivery system (1-5, with 1 being highest)
- Automatic rescheduling of conflicting capsules
- One capsule per user per day rule
- Expiration after 1 year from target date
- Nightly processing of scheduled capsules

## Design Decisions & Assumptions

### Technology Stack
- **Node.js & Express**: Chosen for its non-blocking I/O and excellent package ecosystem
- **MongoDB**: Selected for its flexibility with document-based storage and efficient date-based queries
- **Mongoose**: Used for MongoDB object modeling and schema validation

### Key Design Decisions

1. **Database Schema**
   - Used MongoDB for flexible document storage
   - Implemented indexes for efficient querying of user and delivery date combinations
   - Added timestamps for tracking creation and updates

2. **Priority System**
   - Implemented priority levels 1-5 (1 being highest)
   - Secondary sorting by creation time for equal priority capsules
   - Automatic rescheduling of lower priority capsules

3. **Scheduling System**
   - Implemented a nightly job for processing scheduled capsules
   - Used setInterval for scheduling, with proper error handling
   - Added isProcessing flag to prevent concurrent processing

4. **File Handling**
   - Implemented file metadata storage instead of actual file storage
   - Stored filename, size, and mimetype for future implementation

### Assumptions

1. User authentication is handled by a separate service
2. File storage will be implemented separately
3. The system runs in a single instance (for simplicity)
4. MongoDB is available and properly configured
5. System time is synchronized and accurate

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/time-capsule-booking.git
cd time-capsule-booking
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/time-capsule
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Create a Capsule
```http
POST /api/capsules
Content-Type: application/json

{
  "userId": "user123",
  "message": "Hello future me!",
  "priority": 1,
  "targetDeliveryDate": "2024-12-31T00:00:00.000Z",
  "fileMetadata": {
    "filename": "memory.jpg",
    "size": 1024,
    "mimetype": "image/jpeg"
  }
}
```

### Get User's Capsules
```http
GET /api/capsules/user/:userId
```

### Get Specific Capsule
```http
GET /api/capsules/:id
```

## Testing

1. Manual Testing:
   - Use Postman or similar tool to test API endpoints
   - Create multiple capsules for the same user on the same day
   - Verify priority-based delivery
   - Check rescheduling behavior

2. Automated Testing (TODO):
   - Add unit tests for services
   - Add integration tests for API endpoints
   - Add end-to-end tests for complete workflows

## Project Structure

```
src/
├── app.js              # Application entry point
├── models/
│   └── capsule.model.js    # MongoDB schema
├── routes/
│   └── capsule.routes.js   # API routes
└── services/
    ├── capsule.service.js  # Business logic
    └── scheduler.service.js # Scheduling logic
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
