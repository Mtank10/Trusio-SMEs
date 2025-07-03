# Supply Chain Transparency Backend API

A comprehensive backend API for the Sustainable Supply Chain Transparency platform, built with Node.js, Express.js, Prisma ORM, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations for products and supply chain mapping
- **Survey System**: Dynamic survey creation and response collection
- **Document Management**: Secure file upload with cryptographic verification
- **Report Generation**: PDF report generation with verification links
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **File Storage**: Google Cloud Storage integration for document storage
- **Security**: Comprehensive security middleware and validation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Google Cloud Storage
- **Authentication**: JWT tokens
- **Validation**: Joi schema validation
- **PDF Generation**: pdf-lib and puppeteer
- **Email**: Nodemailer for supplier invitations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud Storage bucket
- SMTP email service (Gmail, etc.)

### Installation

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db"
   JWT_SECRET="your-super-secret-jwt-key"
   GOOGLE_CLOUD_PROJECT_ID="your-project-id"
   GOOGLE_CLOUD_STORAGE_BUCKET="your-bucket-name"
   GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
   SMTP_HOST="smtp.gmail.com"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ```

3. **Database Setup**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register SME admin
- `POST /api/auth/login` - Login user
- `POST /api/auth/invite-supplier` - Send supplier invitation

### Products
- `GET /api/products` - List user's products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/suppliers` - Add supplier to product
- `GET /api/products/:id/supply-chain` - Get supply chain map

### Surveys
- `POST /api/surveys` - Create survey
- `GET /api/surveys` - List surveys
- `GET /api/surveys/:id` - Get survey (public with token)
- `POST /api/surveys/:id/response` - Submit survey response
- `GET /api/surveys/:id/responses` - Get survey responses

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Download document
- `POST /api/documents/:id/verify` - Verify document integrity
- `GET /api/documents/:id/metadata` - Get document metadata

### Reports
- `POST /api/reports/generate` - Generate supply chain report
- `GET /api/reports` - List reports
- `GET /api/reports/:id` - Download report PDF
- `GET /api/reports/:id/verify` - Public report verification

## Database Schema

The database uses PostgreSQL with the following main tables:

- **users**: SME administrators and suppliers
- **products**: Products/materials being tracked
- **suppliers**: Supply chain partners with hierarchical relationships
- **surveys**: Dynamic survey templates
- **survey_responses**: Supplier responses with tokenized access
- **documents**: Uploaded files with cryptographic hashes
- **reports**: Generated transparency reports

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: SME admin vs supplier permissions
- **File Validation**: Type and size restrictions on uploads
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Joi schema validation on all inputs
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers and protections

## Document Verification

Documents are cryptographically secured using:

1. **SHA-256 Hashing**: Each file generates a unique hash
2. **Timestamp Recording**: Upload time is permanently recorded
3. **Integrity Verification**: Files can be re-verified against stored hashes
4. **Blockchain Anchoring**: (Future) Hash anchoring to blockchain

## Development

### Database Operations

```bash
# View database in Prisma Studio
npm run db:studio

# Create and apply migration
npm run db:migrate

# Reset database and reseed
npm run db:push && npm run db:seed
```

### Building for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Sample Data

The seed script creates:
- SME admin user: `admin@ecotech.com` / `password123`
- Sample products: "Sustainable Smartphone", "Green Laptop"
- Sample suppliers with different tiers and statuses
- Sample survey with environmental and social questions

## Error Handling

The API includes comprehensive error handling:
- Validation errors with detailed messages
- Authentication and authorization errors
- File upload errors with size/type restrictions
- Database constraint violations
- Storage service errors

## Monitoring

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error logging to console
- Database query logging in development

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling for new endpoints
3. Include input validation with Joi schemas
4. Add database migrations for schema changes
5. Update API documentation for new endpoints