# 🕐 Time-Travel-Booking System

> **Preserve your thoughts for the future** - A sophisticated backend system for creating and managing time capsules that deliver messages and memories to your future self.

The Time-Travel-Booking system is a Node.js-based application that allows users to create digital time capsules containing messages and file metadata, scheduled for future delivery. With intelligent priority-based scheduling and automatic conflict resolution, it ensures your future self receives exactly what you intended, when you intended it.

## 🌟 What Makes This Special

**For Personal Use:**
- 📝 Send messages to your future self for motivation, reminders, or reflection
- 🎯 Set specific delivery dates for important milestones
- 📁 Attach file metadata for photos, documents, or other meaningful content

**For Developers:**
- 🏗️ Clean, scalable architecture built with Node.js and Express
- 🗄️ Robust MongoDB integration with intelligent indexing
- 🔄 Automatic conflict resolution and rescheduling algorithms
- ⚡ High-performance priority-based delivery system

**For Organizations:**
- 👥 Multi-user support with user-specific capsule management
- 📊 Priority-based scheduling for important communications
- 🔒 Secure data handling and validation

## ✨ Key Features

### Core Functionality
- 📅 **Flexible Scheduling**: Create time capsules for any future date (up to 1 year ahead)
- 🏆 **Priority System**: 5-level priority system (1-5, with 1 being highest priority)
- 🔄 **Smart Rescheduling**: Automatic rescheduling of conflicting capsules based on priority
- 📦 **One Per Day Rule**: Ensures only one capsule per user is delivered each day
- ⏰ **Nightly Processing**: Automated background processing for timely delivery
- 🗂️ **File Metadata Support**: Store information about files for future implementation

### Data Management
- 🔍 **Efficient Querying**: Optimized database indexes for fast retrieval
- 📊 **Status Tracking**: Monitor capsule lifecycle (scheduled → delivered → expired)
- 🕐 **Automatic Expiration**: Capsules expire 1 year after target delivery date
- 📝 **Comprehensive Logging**: Full audit trail of capsule creation and updates

### API Features
- 🛡️ **Input Validation**: Robust validation using express-validator
- 🌐 **CORS Support**: Ready for cross-origin requests
- 📋 **RESTful Design**: Clean, intuitive API endpoints
- ⚡ **Error Handling**: Comprehensive error responses and logging

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

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed on your system:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| **Node.js** | v14.0.0+ | [nodejs.org](https://nodejs.org/) |
| **MongoDB** | v4.4.0+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **npm** | v6.0.0+ | Included with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/rahul3002/Time-Travel-Booking.git
cd Time-Travel-Booking
```

#### 2. Install Dependencies
```bash
# Install all required packages
npm install

# For development with auto-reload
npm install -g nodemon  # Optional: for development
```

#### 3. Database Setup

**Option A: Local MongoDB Installation**
```bash
# Start MongoDB service (varies by OS)
# Ubuntu/Debian:
sudo systemctl start mongod

# macOS with Homebrew:
brew services start mongodb-community

# Windows:
# Start MongoDB service from Services app or command line
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Use it in your `.env` file (step 4)

#### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/time-capsule

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/time-capsule

# Optional: Add your specific configurations
# LOG_LEVEL=info
# SCHEDULER_INTERVAL=86400000  # 24 hours in milliseconds
```

#### 5. Start the Application

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

You should see:
```
Connected to MongoDB
Server is running on port 3000
Scheduler started - will run nightly at midnight
```

### 🎯 Verify Installation

Test your installation by creating a test capsule:

```bash
curl -X POST http://localhost:3000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "message": "Hello future me!",
    "priority": 1,
    "targetDeliveryDate": "2024-12-31T00:00:00.000Z"
  }'
```

Expected response:
```json
{
  "_id": "...",
  "userId": "test-user-123",
  "message": "Hello future me!",
  "priority": 1,
  "targetDeliveryDate": "2024-12-31T00:00:00.000Z",
  "status": "scheduled",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## 📚 API Documentation

The Time-Travel-Booking system provides a RESTful API for managing time capsules. All endpoints return JSON responses and use standard HTTP status codes.

### Base URL
```
http://localhost:3000/api
```

### Authentication
> **Note**: Currently, the system uses a simple `userId` parameter for user identification. In production, implement proper authentication middleware.

---

### 📝 Create a Time Capsule

**Endpoint:** `POST /api/capsules`

Create a new time capsule with a message and optional file metadata.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "userId": "string (required)",
  "message": "string (required)",
  "priority": "number (1-5, required)",
  "targetDeliveryDate": "ISO 8601 date string (required)",
  "fileMetadata": {
    "filename": "string (optional)",
    "size": "number (optional)",
    "mimetype": "string (optional)"
  }
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": "Remember to call mom on my birthday!",
    "priority": 2,
    "targetDeliveryDate": "2024-12-25T09:00:00.000Z",
    "fileMetadata": {
      "filename": "birthday-photo.jpg",
      "size": 2048576,
      "mimetype": "image/jpeg"
    }
  }'
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "user123",
  "message": "Remember to call mom on my birthday!",
  "priority": 2,
  "targetDeliveryDate": "2024-12-25T09:00:00.000Z",
  "actualDeliveryDate": null,
  "status": "scheduled",
  "fileMetadata": {
    "filename": "birthday-photo.jpg",
    "size": 2048576,
    "mimetype": "image/jpeg"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses
```json
// Validation Error (400)
{
  "errors": [
    {
      "msg": "Priority must be between 1 and 5",
      "param": "priority"
    }
  ]
}

// Business Logic Error (400)
{
  "message": "Delivery date cannot be beyond 1 year from now"
}
```

---

### 👤 Get User's Capsules

**Endpoint:** `GET /api/capsules/user/:userId`

Retrieve all capsules for a specific user, sorted by target delivery date.

#### Parameters
- `userId` (path parameter): The unique identifier for the user

#### Example Request
```bash
curl http://localhost:3000/api/capsules/user/user123
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "message": "Remember to call mom on my birthday!",
    "priority": 2,
    "targetDeliveryDate": "2024-12-25T09:00:00.000Z",
    "status": "scheduled",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "user123",
    "message": "Review this year's goals",
    "priority": 1,
    "targetDeliveryDate": "2024-12-31T23:59:00.000Z",
    "status": "scheduled",
    "createdAt": "2024-01-20T14:45:00.000Z"
  }
]
```

---

### 📦 Get Specific Capsule

**Endpoint:** `GET /api/capsules/:id`

Retrieve a specific capsule by its unique identifier.

#### Parameters
- `id` (path parameter): The MongoDB ObjectId of the capsule

#### Example Request
```bash
curl http://localhost:3000/api/capsules/507f1f77bcf86cd799439011
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "user123",
  "message": "Remember to call mom on my birthday!",
  "priority": 2,
  "targetDeliveryDate": "2024-12-25T09:00:00.000Z",
  "actualDeliveryDate": null,
  "status": "scheduled",
  "fileMetadata": {
    "filename": "birthday-photo.jpg",
    "size": 2048576,
    "mimetype": "image/jpeg"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "Capsule not found"
}
```

---

### 🔄 Priority-Based Rescheduling

When creating a capsule, if another capsule already exists for the same user on the same day, the system automatically handles conflicts:

1. **Higher Priority Wins**: New capsule with higher priority keeps the target date
2. **Lower Priority Reschedules**: Existing capsule gets moved to the next available day
3. **Equal Priority**: Newer capsule gets rescheduled to the next available day

#### Example Scenario
```bash
# Day 1: Create first capsule (priority 3) for 2024-12-25
POST /api/capsules
{
  "userId": "user123",
  "message": "First message",
  "priority": 3,
  "targetDeliveryDate": "2024-12-25T00:00:00.000Z"
}

# Day 2: Create second capsule (priority 1) for same date
POST /api/capsules
{
  "userId": "user123",
  "message": "Important message",
  "priority": 1,
  "targetDeliveryDate": "2024-12-25T00:00:00.000Z"
}

# Result: 
# - Priority 1 capsule keeps 2024-12-25
# - Priority 3 capsule automatically rescheduled to 2024-12-26
```

### 📊 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, business rule violations |
| 404 | Not Found | Capsule not found |
| 500 | Internal Server Error | Unexpected server errors |

## 🧪 Testing & Development

### Current Testing Status
> **Note**: This project currently doesn't have automated tests implemented. This is a known area for improvement.

#### Recommended Testing Strategy
When implementing tests, consider this testing pyramid:

```
        🔺 E2E Tests (Few)
       🔺🔺 Integration Tests (Some)  
    🔺🔺🔺🔺 Unit Tests (Many)
```

**Suggested Testing Stack:**
- **Unit Tests**: Jest or Mocha + Chai
- **Integration Tests**: Supertest for API testing
- **Database Tests**: MongoDB Memory Server
- **E2E Tests**: Postman Newman or REST Client

### Manual Testing Guide

#### 1. **API Testing with cURL**

Test capsule creation:
```bash
# Test successful creation
curl -X POST http://localhost:3000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "message": "Test message",
    "priority": 1,
    "targetDeliveryDate": "2024-12-31T00:00:00.000Z"
  }'

# Test validation errors
curl -X POST http://localhost:3000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "message": "",
    "priority": 6,
    "targetDeliveryDate": "invalid-date"
  }'
```

Test user capsule retrieval:
```bash
curl http://localhost:3000/api/capsules/user/test-user
```

#### 2. **Priority System Testing**
```bash
# Create first capsule (priority 3) for specific date
curl -X POST http://localhost:3000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "priority-test",
    "message": "Lower priority message",
    "priority": 3,
    "targetDeliveryDate": "2024-12-25T00:00:00.000Z"
  }'

# Create second capsule (priority 1) for same date
curl -X POST http://localhost:3000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "priority-test",
    "message": "Higher priority message",
    "priority": 1,
    "targetDeliveryDate": "2024-12-25T00:00:00.000Z"
  }'

# Verify rescheduling worked
curl http://localhost:3000/api/capsules/user/priority-test
```

#### 3. **Testing with Postman**

Import this collection for comprehensive testing:

```json
{
  "info": {
    "name": "Time-Travel-Booking API",
    "description": "Complete API testing collection"
  },
  "item": [
    {
      "name": "Create Capsule",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/capsules",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"message\": \"Hello future me!\",\n  \"priority\": 1,\n  \"targetDeliveryDate\": \"2024-12-31T00:00:00.000Z\"\n}"
        }
      }
    }
  ],
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:3000"},
    {"key": "userId", "value": "test-user-123"}
  ]
}
```

### Development Workflow

#### 🔧 **Development Mode**
```bash
# Start with auto-reload
npm run dev

# Monitor MongoDB queries (optional)
# Add to app.js: mongoose.set('debug', true);
```

#### 🏗️ **Code Style Guidelines**
```javascript
// Use async/await for asynchronous operations
async function createCapsule(data) {
  try {
    const capsule = await capsuleService.createCapsule(data);
    return capsule;
  } catch (error) {
    throw new Error(`Failed to create capsule: ${error.message}`);
  }
}

// Use destructuring for cleaner code
const { userId, message, priority } = req.body;

// Use meaningful variable names
const existingCapsule = await findConflictingCapsule(userId, targetDate);
```

#### 🐛 **Debugging**

Enable debug logging:
```javascript
// In app.js, add:
mongoose.set('debug', true);  // See MongoDB queries
app.use(morgan('combined'));   // HTTP request logging
```

Common debugging scenarios:
```bash
# Check MongoDB connection
# Look for: "Connected to MongoDB" in console

# Verify environment variables
node -e "console.log(process.env)"

# Test database queries directly
mongo time-capsule --eval "db.capsules.find().pretty()"
```

### Performance Considerations

#### Database Optimization
- **Indexes**: Compound index on `userId + targetDeliveryDate`
- **Query Patterns**: Optimized for user-specific date range queries
- **Connection Pooling**: Mongoose handles connection pooling automatically

#### API Performance
- **Validation**: Early request validation prevents unnecessary processing
- **Error Handling**: Proper error responses prevent client retries
- **Status Codes**: Correct HTTP status codes for client optimization

#### Scalability Considerations
```javascript
// Current limitations for high-scale deployment:
// 1. Single instance scheduler (use cluster or queue for scale)
// 2. No caching layer (consider Redis for frequently accessed data)
// 3. No rate limiting (add express-rate-limit for production)
// 4. No authentication (implement JWT or session-based auth)
```

## 🏗️ Project Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js v14+ | JavaScript runtime environment |
| **Framework** | Express.js | Web application framework |
| **Database** | MongoDB v4.4+ | Document-based database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Validation** | express-validator | Request validation middleware |
| **Environment** | dotenv | Environment variable management |
| **CORS** | cors | Cross-origin resource sharing |

### Project Structure

```
Time-Travel-Booking/
├── 📁 src/                     # Source code directory
│   ├── 📄 app.js              # Application entry point & server setup
│   ├── 📁 models/             # Database schemas and models
│   │   └── 📄 capsule.model.js    # Time capsule MongoDB schema
│   ├── 📁 routes/             # API route definitions
│   │   └── 📄 capsule.routes.js   # Capsule CRUD operations
│   └── 📁 services/           # Business logic layer
│       ├── 📄 capsule.service.js  # Capsule business logic
│       └── 📄 scheduler.service.js # Background job scheduler
├── 📄 package.json            # Project dependencies & scripts
├── 📄 package-lock.json       # Dependency lock file
├── 📄 .env                    # Environment configuration (create this)
├── 📄 .gitignore             # Git ignore patterns
├── 📄 LICENSE                # MIT license
└── 📄 README.md              # Project documentation
```

### Component Responsibilities

#### 🚀 **app.js** - Application Bootstrap
- Express server configuration
- Middleware setup (CORS, JSON parsing)
- Database connection management
- Route registration
- Error handling middleware
- Scheduler service initialization

#### 📊 **capsule.model.js** - Data Layer
- MongoDB schema definition
- Data validation rules
- Database indexes for performance
- Instance methods (e.g., `isExpired()`)
- Timestamps and status management

#### 🛣️ **capsule.routes.js** - API Layer
- HTTP endpoint definitions
- Request validation middleware
- Route-specific error handling
- Request/response transformation

#### 🏢 **capsule.service.js** - Business Logic
- Core capsule creation logic
- Conflict detection and resolution
- Priority-based rescheduling algorithms
- Date validation (1-year limit)
- CRUD operations with business rules

#### ⏰ **scheduler.service.js** - Background Processing
- Nightly job execution (midnight processing)
- Capsule delivery logic
- Status updates (scheduled → delivered)
- Expiration handling
- Error handling and logging

### Data Flow Architecture

```mermaid
graph TD
    A[Client Request] --> B[Express Routes]
    B --> C[Validation Middleware]
    C --> D[Business Service Layer]
    D --> E[MongoDB via Mongoose]
    E --> F[Database Response]
    F --> D
    D --> G[Response Transformation]
    G --> H[Client Response]
    
    I[Scheduler Service] --> J[Nightly Job]
    J --> D
    D --> K[Status Updates]
    K --> E
```

### Database Design

#### Capsule Collection Schema
```javascript
{
  _id: ObjectId,                    // Unique identifier
  userId: String,                   // User identifier (indexed)
  message: String,                  // Capsule message content
  fileMetadata: {                   // Optional file information
    filename: String,
    size: Number,
    mimetype: String
  },
  priority: Number,                 // Priority level (1-5)
  targetDeliveryDate: Date,         // Intended delivery date (indexed)
  actualDeliveryDate: Date,         // Actual delivery date
  status: String,                   // 'scheduled' | 'delivered' | 'expired'
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date                   // Auto-generated timestamp
}
```

#### Database Indexes
```javascript
// Compound index for efficient user + date queries
{ userId: 1, targetDeliveryDate: 1 }

// Individual indexes for performance
{ userId: 1 }
{ targetDeliveryDate: 1 }
{ status: 1 }
```

### Key Design Patterns

#### 🎯 **Service Layer Pattern**
- Separation of business logic from HTTP concerns
- Reusable business logic across different interfaces
- Easier testing and maintenance

#### 🔄 **Repository Pattern (via Mongoose)**
- Data access abstraction
- Consistent database interaction patterns
- Easy to mock for testing

#### ⚡ **Middleware Pattern**
- Request validation
- Error handling
- Cross-cutting concerns

#### 🕐 **Background Job Pattern**
- Scheduled task execution
- Asynchronous processing
- System reliability

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub, then:
   git clone https://github.com/YOUR-USERNAME/Time-Travel-Booking.git
   cd Time-Travel-Booking
   ```

2. **Set Up Development Environment**
   ```bash
   npm install
   cp .env.example .env  # Configure your environment
   npm run dev
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

### Development Guidelines

#### 🎯 **Code Standards**
- Use **async/await** instead of callbacks
- Follow **RESTful API** conventions
- Add **input validation** for all endpoints
- Include **error handling** for all async operations
- Use **meaningful variable names** and comments

#### 📝 **Commit Message Format**
```
type(scope): description

feat(api): add capsule update endpoint
fix(scheduler): resolve duplicate delivery issue  
docs(readme): update installation instructions
test(api): add validation error tests
refactor(service): optimize conflict detection
```

#### 🔍 **Code Review Checklist**
- [ ] Code follows existing patterns and style
- [ ] All new functions have proper error handling
- [ ] API endpoints include input validation
- [ ] Changes are tested manually
- [ ] Documentation is updated if needed
- [ ] No sensitive data in commits

### Contribution Areas

#### 🚀 **High Priority**
- [ ] **Add automated testing** (Jest + Supertest)
- [ ] **Implement user authentication** (JWT or sessions)
- [ ] **Add rate limiting** for API endpoints
- [ ] **Create admin dashboard** for capsule management
- [ ] **Implement actual file storage** (AWS S3, GridFS)

#### 🎨 **Medium Priority**
- [ ] **Add email notifications** for delivered capsules
- [ ] **Create web interface** for capsule management
- [ ] **Add capsule categories/tags**
- [ ] **Implement capsule sharing** features
- [ ] **Add bulk operations** API

#### 🔧 **Good First Issues**
- [ ] **Add input sanitization** for message content
- [ ] **Improve error messages** with more context
- [ ] **Add environment validation** on startup
- [ ] **Create Docker containerization**
- [ ] **Add API response caching**

### Pull Request Process

1. **Before Submitting**
   ```bash
   # Ensure your code works
   npm start
   
   # Test your changes manually
   curl -X POST http://localhost:3000/api/capsules \
     -H "Content-Type: application/json" \
     -d '{"userId":"test","message":"test","priority":1,"targetDeliveryDate":"2024-12-31T00:00:00.000Z"}'
   
   # Update documentation if needed
   ```

2. **Submit Pull Request**
   - Use descriptive title and description
   - Reference related issues (`Fixes #123`)
   - Include screenshots for UI changes
   - Add breaking change notes if applicable

3. **After Submission**
   - Respond to review feedback promptly
   - Keep your branch updated with main
   - Be open to suggestions and improvements

### Development Tips

#### 🛠️ **Local Development**
```bash
# Watch mode for development
npm run dev

# Debug mode with extra logging
DEBUG=* npm run dev

# Test with different MongoDB
MONGODB_URI=mongodb://localhost:27017/time-capsule-test npm start
```

#### 🧪 **Testing Changes**
```bash
# Test basic functionality
curl http://localhost:3000/api/capsules/user/test-user

# Test error handling
curl -X POST http://localhost:3000/api/capsules \
  -H "Content-Type: application/json" \
  -d '{"invalid":"data"}'

# Test priority system
# (Create multiple capsules for same user/date with different priorities)
```

### Questions or Need Help?

- 📫 **Open an Issue**: For bugs, feature requests, or questions
- 💬 **Discussion**: Use GitHub Discussions for general questions
- 📧 **Security Issues**: Email security vulnerabilities privately

### Recognition

All contributors will be recognized in our [Contributors](./CONTRIBUTORS.md) file. We appreciate every contribution, no matter how small!

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 🔌 **Database Connection Issues**

**Problem**: `MongoNetworkError` or "Cannot connect to MongoDB"

**Solutions**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Verify connection string
node -e "console.log(process.env.MONGODB_URI)"

# Test connection manually
mongo mongodb://localhost:27017/time-capsule
```

**MongoDB Atlas Issues**:
```bash
# Ensure IP whitelist includes your IP
# Check username/password in connection string
# Verify database name in URI
```

---

#### ⚠️ **Application Startup Errors**

**Problem**: "Port already in use" (EADDRINUSE)
```bash
# Find and kill process using port 3000
lsof -ti :3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

**Problem**: "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

---

#### 📝 **API Request Issues**

**Problem**: 400 Bad Request - Validation Errors
```json
// Check request format
{
  "userId": "string-required",
  "message": "string-required", 
  "priority": 1-5,  // number between 1 and 5
  "targetDeliveryDate": "2024-12-31T00:00:00.000Z"  // ISO 8601 format
}
```

**Problem**: Capsules not being rescheduled properly
```bash
# Check for existing capsules
curl http://localhost:3000/api/capsules/user/YOUR_USER_ID

# Verify priority system is working
# Lower priority capsules should be moved to next available day
```

---

#### 🕐 **Scheduler Issues**

**Problem**: Scheduler not running
```bash
# Check console output for:
# "Scheduler started - will run nightly at midnight"

# Verify in logs:
grep -i scheduler logs/app.log  # if logging to file
```

**Problem**: Capsules not being delivered
```bash
# Check capsule status
mongo time-capsule --eval "db.capsules.find({status: 'scheduled'}).pretty()"

# Manually trigger scheduler (for testing)
# Add to scheduler.service.js: processScheduledCapsules()
```

---

#### 🔍 **Performance Issues**

**Problem**: Slow API responses
```bash
# Enable MongoDB query logging
# Add to app.js: mongoose.set('debug', true);

# Check database indexes
mongo time-capsule --eval "db.capsules.getIndexes()"

# Monitor system resources
top -p $(pgrep node)
```

### Debug Mode

Enable detailed logging:
```bash
# Add to your .env file
NODE_ENV=development
DEBUG=*

# Or start with debug flags
DEBUG=* npm start
```

### Health Check

Verify system health:
```bash
# Check server status
curl http://localhost:3000/api/health  # if health endpoint exists

# Check database connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/time-capsule')
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.log('❌ Database error:', err.message));
"
```

### Getting Help

If you're still experiencing issues:

1. **Check the logs** for detailed error messages
2. **Search existing issues** on GitHub
3. **Create a new issue** with:
   - Your environment details (Node.js version, OS, MongoDB version)
   - Complete error messages
   - Steps to reproduce the problem
   - What you've already tried

---

## ❓ Frequently Asked Questions

### General Questions

**Q: What is the maximum time I can schedule a capsule for?**
A: Capsules can be scheduled up to 1 year in the future. Beyond that, they will automatically expire.

**Q: Can I have multiple capsules for the same day?**
A: No, the system enforces a "one capsule per user per day" rule. If you try to schedule multiple capsules for the same day, the system will automatically reschedule them based on priority.

**Q: How does the priority system work?**
A: Priority ranges from 1 (highest) to 5 (lowest). When there's a conflict:
- Higher priority capsules keep their scheduled date
- Lower priority capsules are moved to the next available day
- Equal priority uses creation time (newer gets rescheduled)

**Q: What happens to expired capsules?**
A: Capsules that haven't been delivered within 1 year of their target date are marked as "expired" and won't be delivered.

### Technical Questions

**Q: Can I modify a capsule after creating it?**
A: Currently, the API doesn't support updating capsules. This is a planned feature for future versions.

**Q: Does the system actually store files?**
A: No, currently only file metadata (filename, size, mimetype) is stored. Actual file storage is planned for future implementation.

**Q: How does the nightly scheduler work?**
A: The scheduler runs automatically at midnight every day, processing all capsules due for delivery and updating their status accordingly.

**Q: Is there user authentication?**
A: Currently, the system uses simple user IDs. Proper authentication (JWT, sessions) is not implemented but is planned for production use.

### Development Questions

**Q: How can I contribute to the project?**
A: See our [Contributing](#-contributing) section for detailed guidelines on how to get started.

**Q: Are there any automated tests?**
A: Not currently, but this is a high-priority item for contributions. See the testing section for manual testing procedures.

**Q: Can I use this in production?**
A: The current version is suitable for development and small-scale use. For production, consider adding:
- User authentication
- Rate limiting
- Proper error monitoring
- Database connection pooling
- Caching layer

**Q: How scalable is the current architecture?**
A: The current single-instance design works well for moderate loads. For high-scale deployment, consider:
- Horizontal scaling with load balancers
- Database sharding
- Queue-based job processing
- Redis caching

### API Questions

**Q: What's the rate limit for API calls?**
A: Currently, there's no rate limiting implemented. This should be added for production use.

**Q: Can I get all capsules across all users?**
A: No, the current API only supports user-specific capsule retrieval for privacy and performance reasons.

**Q: What date format should I use?**
A: Use ISO 8601 format: `2024-12-31T23:59:59.000Z`

### Deployment Questions

**Q: Can I deploy this to cloud platforms?**
A: Yes! The application works well on:
- **Heroku**: Add MongoDB Atlas for database
- **AWS**: Use EC2 + DocumentDB or RDS
- **DigitalOcean**: App Platform + Managed MongoDB
- **Vercel**: For API routes (requires serverless adaptation)

**Q: Do I need MongoDB Atlas or can I use local MongoDB?**
A: Both work fine. Local MongoDB is great for development, while Atlas is recommended for production deployments.

**Q: What environment variables do I need for deployment?**
A: Essential variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=production
```

## 📄 License

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:
- ✅ **Commercial Use**: You can use this software commercially
- ✅ **Modification**: You can modify the source code
- ✅ **Distribution**: You can distribute the original or modified software
- ✅ **Private Use**: You can use this software privately
- ⚠️ **Liability**: Authors are not liable for damages
- ⚠️ **Warranty**: No warranty is provided

---

## 🙏 Acknowledgments

### Built With Love Using:
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM library

### Contributors
- **Rahul** - Initial development and architecture

### Special Thanks
- MongoDB team for excellent documentation
- Express.js community for robust middleware ecosystem
- Node.js contributors for the amazing runtime

---

## 📞 Support & Contact

### 🐛 **Found a Bug?**
- [Open an Issue](https://github.com/rahul3002/Time-Travel-Booking/issues/new?template=bug_report.md)
- Include steps to reproduce
- Mention your environment details

### 💡 **Have a Feature Request?**
- [Request a Feature](https://github.com/rahul3002/Time-Travel-Booking/issues/new?template=feature_request.md)
- Describe the problem it solves
- Explain your proposed solution

### 💬 **Questions or Discussions?**
- [GitHub Discussions](https://github.com/rahul3002/Time-Travel-Booking/discussions)
- Perfect for general questions, ideas, or showcasing your projects

### 🔒 **Security Issues?**
- Please report security vulnerabilities privately
- Email: [security@your-domain.com] (replace with actual contact)
- We'll respond within 48 hours

---

## 🚀 What's Next?

### Upcoming Features
- [ ] **User Authentication System** (JWT-based)
- [ ] **Web Dashboard** for capsule management
- [ ] **Email Notifications** for delivered capsules
- [ ] **File Upload Support** (AWS S3/GridFS integration)
- [ ] **Capsule Categories** and tagging system
- [ ] **Admin Panel** for system management
- [ ] **API Rate Limiting** and security enhancements
- [ ] **Comprehensive Test Suite** (Unit + Integration)

### Long-term Vision
- **Mobile App**: React Native or Flutter application
- **Social Features**: Share capsules with friends/family
- **Analytics Dashboard**: Delivery statistics and insights
- **Multi-tenant Support**: White-label solution for organizations
- **AI Integration**: Smart content suggestions and scheduling

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/rahul3002/Time-Travel-Booking)
![GitHub forks](https://img.shields.io/github/forks/rahul3002/Time-Travel-Booking)
![GitHub issues](https://img.shields.io/github/issues/rahul3002/Time-Travel-Booking)
![GitHub pull requests](https://img.shields.io/github/issues-pr/rahul3002/Time-Travel-Booking)
![License](https://img.shields.io/github/license/rahul3002/Time-Travel-Booking)

---

<div align="center">

**Made with ❤️ by [Rahul](https://github.com/rahul3002)**

*"Preserving today's thoughts for tomorrow's wisdom"*

---

⭐ **If this project helped you, consider giving it a star!** ⭐

</div>
