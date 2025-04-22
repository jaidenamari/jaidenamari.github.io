---
title: Setting Up Dockerized PostgreSQL with Multi-Tenant Support and Automated Migrations
date: 2025-04-21
draft: false
tags:
  - "#database"
  - db
  - postgres
  - mikro-orm
  - docker
  - typescript
categories:
  - blog
coverImage: /images/blog-covers/cyberpunk-moon.jpg
---

# Building Multi-Tenant Applications with MikroORM and PostgreSQL: A Practical Guide

Imagine creating a single application that serves dozens, hundreds, or even thousands of different clients, each with their own private data that remains completely isolated from others. That's the magic of multi-tenancy - a powerful architectural pattern that's the backbone of most modern SaaS platforms.

In this hands-on guide, I'll walk you through creating a robust multi-tenant application using Node.js, Express, MikroORM, and PostgreSQL. We'll build a farm management system where each farm organization (tenant) gets its own isolated database, ensuring complete data separation while sharing a single codebase. Will it be perfect, probably not. Will it do the thing with some basic adherence to best practices. I sure hope so!?

### **Multi-tenancy is like running a shared office building.**

Tenants each get their own:

- **Private keycard access** (authentication)
- **Locked offices & meeting rooms** (data isolation)
- **Guaranteed desk space** (resource quotas)

…but they all share:

- **The same HVAC, elevators, and internet** (infrastructure)
- **A single maintenance crew** (your ops team)
- **One security system** (global monitoring)

No one’s building a whole new skyscraper just because another company moves in.

**TL;DR:** One building, many tenants—no construction required.

## Real-World Multi-Tenant Applications

Before diving in, let's consider some real-world applications of multi-tenancy:

- **Expense Tracking Apps**: Services like **[Wave Accounting](https://www.waveapps.com)** serve hundreds of businesses, each company seeing only their own expense reports and data
- **Customer Relationship Management (CRM)**: Platforms like **[HubSpot CRM](https://www.hubspot.com/products/crm)** allow each business to manage their customers without seeing data from other companies
- **Content Management Systems (CMS)**: Services like **[Carrd](https://carrd.co/)** host thousands of sites where each owner manages only their content
- **E-commerce Platforms**: **[Big Cartel](https://www.bigcartel.com)** hosts many independent stores on the same infrastructure


For this example I'm going to use a simple farm management system. I was building an app to help my friend manage their Community Supported Agriculture business. This seemed like a good opportunity to build a SaaS product that other farmers could use. This would require a sort of white labeling effort, and converting the system to handle multi tenancy.

I simplified all of this to demo the functionality. Our farm management system will follow the same principles - allowing different farm organizations to manage their crops, harvests, and users without seeing each other's data.

## What You'll Learn

- Creating a multi-tenant architecture with database-per-tenant isolation
- Implementing dynamic tenant routing in Express
- Managing tenant-specific database connections with MikroORM
- Handling tenant-specific migrations
- Establishing database schema with agricultural-themed entities
- Testing your multi-tenant setup to ensure all tenant databases work correctly

## Project Setup

Let's start by setting up the project:

```bash
mkdir farm-management && cd farm-management
npm init -y
npm install @mikro-orm/core @mikro-orm/postgresql @mikro-orm/migrations @mikro-orm/cli pg express dotenv uuid
npm install -D typescript @types/node @types/express @types/uuid ts-node nodemon
npx tsc --init
```

Update `tsconfig.json` with appropriate settings for TypeScript. If you want to explore more working configs for different runtime environments. I've found this repo [tsconfig / bases](https://github.com/tsconfig/bases) to be extremely helpful:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "es2022",
    "moduleResolution": "Node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

Let's create a logical directory structure that will help us organize our multi-tenant application:

```
src/
  entities/     # Our database models that define the application's data structure
  migrations/   # Database migration files for evolving our schema
  config/       # Configuration files for environment variables and ORM settings
  services/     # Business logic services, including our TenantManager
  middleware/   # Express middleware, especially for tenant context handling
  routes/       # API routes for both tenant-specific and global endpoints
```

This structure keeps our concerns nicely separated and makes it easier to navigate the codebase as it grows. There are a lot of different approaches to organizing a project, feel free to structure this in a way that works for your flow.

## Database Entity Models

For our farm management system, we'll create the following entities:

### Base Entity

First, let's define a base entity that all other entities will extend:

```typescript
// src/entities/BaseEntity.ts
import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
```

### Organization Entity (Tenant)

The Organization entity represents a farm tenant, this usually contains stuff like branding, and any site context specific stuff that the organization would need:

```typescript
// src/entities/Organization.ts
import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Organization extends BaseEntity {
  @Property()
  @Unique()
  name!: string;

  @Property()
  logoUrl?: string;

  @Property()
  farmType!: 'vegetable' | 'dairy' | 'orchard' | 'mixed';
}
```

### User Entity

Each farm has users that can access the system:

```typescript
// src/entities/User.ts
import { Entity, Property, ManyToOne, Unique } from "@mikro-orm/core";
import { Organization } from "./Organization";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  @Unique()
  email!: string;

  @ManyToOne(() => Organization)
  organization!: Organization;
}
```

### Farm-Specific Entities

Now let's create entities specific to farm operations:

```typescript
// src/entities/Crop.ts
import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { Organization } from "./Organization";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Crop extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  plantingDate!: Date;

  @ManyToOne(() => Organization)
  organization!: Organization;
}
```

```typescript
// src/entities/Harvest.ts
import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { Crop } from "./Crop";
import { Organization } from "./Organization";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Harvest extends BaseEntity {
  @Property()
  quantity!: number;

  @Property()
  unit!: 'kg' | 'bushel' | 'crate';

  @ManyToOne(() => Crop)
  crop!: Crop;

  @ManyToOne(() => Organization)
  organization!: Organization;
}
```

### Entity Index

Create an index file to export all entities. I usually use [barrelsby](https://www.npmjs.com/package/barrelsby) as a way to manage generating indexes quickly. Overall the goal is to make imports less messy:

```typescript
// src/entities/index.ts
export * from './BaseEntity.js';
export * from './Organization.js';
export * from './User.js';
export * from './Crop.js';
export * from './Harvest.js';
```

## MikroORM Configuration

Now we'll set up MikroORM to handle both the base database and tenant-specific databases:

### Environment Configuration

First, create an environment configuration file, this step is optional. You can always just directly reference the env variables you need in a file by using `process.env.VARIABLE` in a definition, which works nicely:

```typescript
// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || 'farm_tenants',
  DB_USER: process.env.DB_USER || 'farmadmin',
  DB_PASSWORD: process.env.DB_PASSWORD || 'harvest2025',
  PORT: Number(process.env.PORT) || 3000,
};
```

### Base MikroORM Configuration

Now, define the base MikroORM configuration. If you have a long list of entities, this is where, something like barrelsy and having index files can come in handy. Especially for long lists of entities. This could change the import to something like `import * as Entities from '../entities/index.js`. Then in the entities assignment in the config we could have `entities: Object.values(Entities)`

```typescript
// src/config/mikro-orm.config.ts
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { env } from './env.js';
import { Organization, User, Crop, Harvest } from '../entities/index.js';

const options: Options<PostgreSqlDriver> = {
  entities: [Organization, User, Crop, Harvest],
  dbName: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  driver: PostgreSqlDriver,
  debug: env.NODE_ENV === 'development',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
};

export default options;
```

## Tenant Management

The heart of our multi-tenant system is the `TenantManager` class, which dynamically creates and manages connections to tenant databases. This is perhaps the most crucial piece of our multi-tenant architecture:

```typescript
// src/services/TenantManager.ts
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import baseOptions from '../config/mikro-orm.config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TenantManager {
  private tenantOrmInstances = new Map<string, MikroORM>();
  private baseOrm: MikroORM | null = null;

  async getBaseORM(): Promise<MikroORM> {
    if (!this.baseOrm) {
      this.baseOrm = await MikroORM.init(baseOptions);
    }
    return this.baseOrm;
  }

  async getTenantORM(tenantId: string): Promise<MikroORM> {
    if (!this.tenantOrmInstances.has(tenantId)) {
      // Create a new database for this tenant if it doesn't exist
      const baseOrm = await this.getBaseORM();
      const connection = baseOrm.em.getConnection();
      
      try {
        // Check if the tenant database exists
        const result = await connection.execute(
          `SELECT 1 FROM pg_database WHERE datname = $1`,
          [`tenant_${tenantId}`]
        );

        // If the database doesn't exist, create it
        if (result.length === 0) {
          await connection.execute(`CREATE DATABASE tenant_${tenantId}`);
          console.log(`Created new database for tenant: tenant_${tenantId}`);
        }
      } catch (error: any) {
        console.error(`Error checking/creating tenant database: ${error.message}`);
      }

      // Initialize tenant ORM
      const tenantOptions = {
        ...baseOptions,
        dbName: `tenant_${tenantId}`,
        migrations: {
          tableName: 'mikro_orm_migrations_tenant',
          path: './dist/migrations/tenant',
          pathTs: './src/migrations/tenant',
        }
      };

      const orm = await MikroORM.init(tenantOptions);
      
      // Run migrations to ensure the schema is up to date
      try {
        const migrator = orm.getMigrator();
        await migrator.up();
        console.log(`Migrations applied for tenant ${tenantId}`);
      } catch (error: any) {
        console.log(`Migrations not applied for tenant ${tenantId}: ${error.message}`);
        console.log(`Creating schema manually for tenant ${tenantId}...`);
        
        // Initialize the schema manually for tenant
        try {
          console.log('Creating tenant schema manually...');
          const schemaPath = path.resolve(__dirname, '..', '..', 'src', 'schema.sql');
          const schema = fs.readFileSync(schemaPath, 'utf8');
          
          // Split into individual statements and execute them
          const statements = schema.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);
          
          const tenantConnection = orm.em.getConnection();
          
          for (const statement of statements) {
            try {
              await tenantConnection.execute(statement);
            } catch (err: any) {
              console.warn(`Warning executing statement for tenant: ${err.message}`);
            }
          }
          
          console.log(`Schema created successfully for tenant ${tenantId}`);
        } catch (schemaError: any) {
          console.error(`Error creating schema for tenant ${tenantId}:`, schemaError.message);
        }
      }

      this.tenantOrmInstances.set(tenantId, orm);
    }
    
    return this.tenantOrmInstances.get(tenantId)!;
  }

  // Utility method to run operations in the context of a tenant
  async runInTenantContext<T>(tenantId: string, callback: (em: any) => Promise<T>): Promise<T> {
    const orm = await this.getTenantORM(tenantId);
    const em = orm.em.fork();
    
    return RequestContext.create(em, () => callback(em));
  }

  // Clean up resources when shutting down
  async closeConnections(): Promise<void> {
    if (this.baseOrm) {
      await this.baseOrm.close();
    }
    
    for (const [_, orm] of this.tenantOrmInstances.entries()) {
      await orm.close();
    }
  }
}
```

### How the TenantManager Works

Let's break down what makes this `TenantManager` so powerful:

1. **Connection Pool Management**: The `TenantManager` maintains a map of MikroORM instances, one for each tenant. This prevents us from creating unnecessary database connections and ensures we reuse existing connections when possible.

2. **Lazy Initialization**: Tenant databases are only created and connected when they're first requested, not upfront. This means our application can scale to thousands of tenants without wasting resources on idle connections.

3. **Automatic Database Creation**: When a tenant is requested for the first time, the manager checks if their database exists and creates it if needed. This simplifies tenant onboarding tremendously.

4. **Migration Handling**: Each tenant database gets automatically migrated to the latest schema version on first access. This ensures database consistency across all tenants.

5. **Fallback Mechanism**: If migrations fail (perhaps because the database is brand new), the manager can initialize the schema manually from SQL statements.

6. **Resource Cleanup**: When the application shuts down, all database connections are properly closed to prevent resource leaks.

The `runInTenantContext` method is particularly useful when you need to perform operations for a specific tenant outside of the standard request flow. It ensures that database operations are executed within the correct tenant's context.

#### Some Things We Don't Address:

- proper caching using something like [LRU caching](https://www.geeksforgeeks.org/lru-cache-implementation/)Which will ensure that the cache doesn't get stale and cannot grow indefinitely. 
- connection pooling issues that may arise when have many tenants trying to connect to a postgres database.

[Check out MikroORM's documentation](https://mikro-orm.io/docs/usage-with-sql) for more details on working with PostgreSQL and managing database connections.

## Express Middleware for Tenant Context

For a multi-tenant system to work properly, each incoming request needs to be associated with the correct tenant. Our Express middleware accomplishes this by extracting the tenant ID from either a custom HTTP header or from the subdomain, then setting up the appropriate database context for the request:

```typescript
// src/middleware/tenantMiddleware.ts
import { RequestHandler } from 'express';
import { TenantManager } from '../services/TenantManager.js';

export const tenantMiddleware = (tenantManager: TenantManager): RequestHandler => {
  return async (req, res, next) => {
    // Extract tenant ID from custom header or from the subdomain
    const tenantId = req.headers['x-tenant-id'] || req.hostname.split('.')[0];
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant identification required' });
    }

    try {
      // Get the ORM instance for this tenant
      const tenantORM = await tenantManager.getTenantORM(tenantId as string);
      
      // Attach the tenant's ORM to the request object for use in route handlers
      (req as any).tenantORM = tenantORM;
      
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error initializing tenant context' });
    }
  };
};
```

### How Tenant Context Works

This middleware accomplishes several important tasks:

1. **Tenant Identification**: It determines which tenant is making the request by looking for the `x-tenant-id` header or extracting it from the subdomain (e.g., `tenant-name.example.com`).

2. **Request Enrichment**: It attaches the tenant's MikroORM instance to the request object, making it available to all downstream route handlers.

3. **Lazy Initialization**: If this is the first request from a tenant, the middleware triggers the database creation and migration process via the `TenantManager`.

4. **Error Handling**: If something goes wrong while setting up the tenant context, it returns an appropriate error response.

This approach has several advantages in a multi-tenant system:

- **Clean Route Handlers**: Your route handlers don't need to worry about tenant identification or database selection - they just use `req.tenantORM`.
- **Flexible Tenant Identification**: You can easily change how tenants are identified (headers, subdomains, path parameters) by modifying just this middleware.
- **Request Isolation**: Each request is processed in isolation with its own tenant context, preventing data leakage between tenants.

In our application, we apply this middleware selectively to routes that need tenant context, while leaving other routes (like tenant management endpoints) available without tenant context:

```typescript
// Apply tenant middleware only to tenant-specific API routes
app.use('/api', tenantMiddleware(tenantManager));
app.use('/api/crops', createCropRoutes());

// Routes NOT requiring tenant context
app.use('/organizations', createOrganizationRoutes(tenantManager));
```

This way, a request to `/api/crops` would require tenant identification and would operate on the tenant's database, while a request to `/organizations` would operate on the global database without tenant context.

[Learn more about middleware in Express.js](https://expressjs.com/en/guide/using-middleware.html) to understand how middleware chains work.

## API Routes

Now let's create routes for our application:

### Organization Routes (non-tenant specific)

```typescript
// src/routes/organizationRoutes.ts
import { Router } from 'express';
import { TenantManager } from '../services/TenantManager.js';
import { Organization } from '../entities/index.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrganizationRoutes = (tenantManager: TenantManager) => {
  const router = Router();

  // Get all organizations
  router.get('/', async (req, res) => {
    try {
      const baseOrm = await tenantManager.getBaseORM();
      const organizations = await baseOrm.em.find(Organization, {});
      res.json(organizations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new organization (and tenant database)
  router.post('/', async (req, res) => {
    try {
      const { name, logoUrl, farmType } = req.body;
      
      // Validate required fields
      if (!name || !farmType) {
        return res.status(400).json({ message: 'Name and farm type are required' });
      }
      
      // Create the organization in the base database
      const baseOrm = await tenantManager.getBaseORM();
      
      const organization = new Organization();
      organization.id = uuidv4();
      organization.name = name;
      organization.logoUrl = logoUrl;
      organization.farmType = farmType;
      
      await baseOrm.em.persistAndFlush(organization);
      
      // Generate tenant ID from the organization name
      const tenantId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Initialize the tenant database
      await tenantManager.getTenantORM(tenantId);
      
      res.status(201).json({
        ...organization,
        tenantId
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
```

### Tenant-Specific Routes

```typescript
// src/routes/cropRoutes.ts
import { Router } from 'express';
import { Crop } from '../entities/index.js';
import { v4 as uuidv4 } from 'uuid';

export const createCropRoutes = () => {
  const router = Router();

  // Get all crops for the current tenant
  router.get('/', async (req: any, res) => {
    try {
      const tenantOrm = req.tenantORM;
      const crops = await tenantOrm.em.find(Crop, {});
      res.json(crops);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new crop
  router.post('/', async (req: any, res) => {
    try {
      const { name, plantingDate, organizationId } = req.body;
      
      if (!name || !plantingDate || !organizationId) {
        return res.status(400).json({ message: 'Name, planting date, and organization ID are required' });
      }
      
      const tenantOrm = req.tenantORM;
      
      const crop = new Crop();
      crop.id = uuidv4();
      crop.name = name;
      crop.plantingDate = new Date(plantingDate);
      crop.organization = organizationId;
      
      await tenantOrm.em.persistAndFlush(crop);
      
      res.status(201).json(crop);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
```

## How Migrations Work in Our Multi-Tenant System

1. **Creating Migrations**:
   - For tenant-specific migrations, we have an npm script: `migrate:tenant:create` which runs `mikro-orm migration:create --path ./src/migrations/tenant`
   - This creates a migration file in `src/migrations/tenant/` following MikroORM's naming pattern (like `Migration20230621001_TestTenantMigration.ts`)

2. **Migration Application**:
   - The system handles migrations in two places:
   
   a) **TenantManager.getTenantORM()**: When a tenant's ORM is initialized, it automatically runs migrations:
   ```typescript
   try {
     const migrator = orm.getMigrator();
     await migrator.up();
     console.log(`Migrations applied for tenant ${tenantId}`);
   } catch (error) { ... }
   ```
   
   b) **index.ts**: The main application also runs migrations for the base database:
   ```typescript
   try {
     const migrator = orm.getMigrator();
     await migrator.up();
     console.log('Migrations applied successfully');
   } catch (error) { ... }
   ```

3. **Creating a Real Migration**:
   To create a migration we can run the following:

   ```bash
   npm run migrate:tenant:create -- --name AddFieldToTable
   ```

   This will create a migration file like `Migration20231025001_AddFieldToTable.ts` in `src/migrations/tenant/`

   Then write your migration:
   ```typescript
   import { Migration } from '@mikro-orm/migrations';

   export class Migration20231025001_AddFieldToTable extends Migration {
     async up(): Promise<void> {
       this.addSql('ALTER TABLE your_table ADD COLUMN new_field VARCHAR(255)');
     }

     async down(): Promise<void> {
       this.addSql('ALTER TABLE your_table DROP COLUMN new_field');
     }
   }
   ```

4. **Applying to All Tenant DBs**:
   - The `test-migrations.ts` script isn't strictly necessary for normal migration operations, it's more of a validation tool
   - Migrations are automatically applied to each tenant DB when:
     - A new request comes in and the tenant's ORM is initialized for the first time
     - The application starts and creates new tenants
     - You manually run migrations using MikroORM CLI

5. **For Consistent Application Across All Tenants**:
   You have two options:
   - Let the system handle it naturally (migrations will apply when each tenant's ORM is initialized)
   - For immediate application across all tenants, you could run a script similar to `test-migrations.ts` but focused on just applying migrations

The beauty of this system is that migrations are handled automatically as part of the tenant ORM initialization. When you create a new tenant-specific migration, it will get applied the next time each tenant's ORM is initialized.

## Test Migration Scenario

Multi-tenant applications require careful handling of migrations to ensure schema changes are applied to all tenant databases. We'll create a structure for both base and tenant-specific migrations:

```typescript
// src/migrations/tenant/Migration20230621001_TestTenantMigration.ts
import { Migration } from '@mikro-orm/migrations';

export class Migration20230621001_TestTenantMigration extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE TABLE IF NOT EXISTS "migration_test" (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), test_name VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT now())');
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "migration_test"');
  }
}
```

We'll also create a utility to test that migrations work correctly across all tenant databases:

```typescript
// src/test-migrations.ts
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import baseOptions from './config/mikro-orm.config.js';
import { TenantManager } from './services/TenantManager.js';

async function testTenantMigrations() {
  console.log('Testing migrations for all tenant databases...');
  
  // Initialize base ORM
  const baseOrm = await MikroORM.init(baseOptions);
  const connection = baseOrm.em.getConnection();
  
  try {
    // Get a list of all tenant databases
    console.log('Retrieving list of tenant databases...');
    const results = await connection.execute(
      `SELECT datname FROM pg_database WHERE datname LIKE 'tenant_%'`
    );
    
    const tenantDbs = results.map((row: any) => row.datname);
    console.log(`Found ${tenantDbs.length} tenant databases: ${tenantDbs.join(', ')}`);
    
    if (tenantDbs.length === 0) {
      console.log('No tenant databases found. Creating a test tenant...');
      const tenantId = 'test_tenant';
      
      // Create a test tenant
      await connection.execute(`CREATE DATABASE tenant_${tenantId}`);
      console.log(`Created test tenant database: tenant_${tenantId}`);
      
      // Add to the list of tenants to test
      tenantDbs.push(`tenant_${tenantId}`);
    }
    
    // Initialize TenantManager
    const tenantManager = new TenantManager();
    
    // Run migrations for each tenant
    for (const tenantDb of tenantDbs) {
      const tenantId = tenantDb.replace('tenant_', '');
      console.log(`Testing migrations for tenant: ${tenantId}`);
      
      try {
        // Get tenant ORM and run migrations
        const tenantOrm = await tenantManager.getTenantORM(tenantId);
        const migrator = tenantOrm.getMigrator();
        
        // Run the migrations
        const executedMigrations = await migrator.up();
        console.log(`Executed ${executedMigrations.length} migrations for tenant ${tenantId}`);
        
        // Verify migration by checking if the test table exists
        const connection = tenantOrm.em.getConnection();
        const tableExists = await connection.execute(
          `SELECT to_regclass('migration_test') IS NOT NULL as exists`
        );
        
        if (tableExists[0].exists) {
          console.log(`✅ Verification successful: 'migration_test' table exists for tenant ${tenantId}`);
          
          // Insert a test record
          await connection.execute(
            `INSERT INTO migration_test (test_name) VALUES ($1)`,
            [`Test for ${tenantId} at ${new Date().toISOString()}`]
          );
          
          // Check if record was inserted
          const records = await connection.execute(`SELECT * FROM migration_test`);
          console.log(`✅ Inserted test record: `, records[0]);
        } else {
          console.log(`❌ Verification failed: 'migration_test' table does not exist for tenant ${tenantId}`);
        }
      } catch (error: any) {
        console.error(`❌ Error testing migrations for tenant ${tenantId}:`, error.message);
      }
    }
  } catch (error: any) {
    console.error('Error testing tenant migrations:', error.message);
  } finally {
    // Clean up connections
    await baseOrm.close();
  }
}

// Run the test
testTenantMigrations().catch(error => {
  console.error('Unhandled error in migration test:', error);
  process.exit(1);
}).then(() => {
  console.log('Migration test completed.');
  process.exit(0);
});
```

## Main Application Setup

Now let's tie everything together in our main application file:

```typescript
// src/index.ts
import express from 'express';
import { TenantManager } from './services/TenantManager.js';
import { tenantMiddleware } from './middleware/tenantMiddleware.js';
import { createOrganizationRoutes } from './routes/organizationRoutes.js';
import { createCropRoutes } from './routes/cropRoutes.js';
import { env } from './config/env.js';

async function main() {
  const app = express();
  app.use(express.json());
  
  // Initialize tenant manager
  const tenantManager = new TenantManager();
  
  // Base database must exist
  await tenantManager.getBaseORM();
  
  // Routes not requiring tenant context
  app.use('/organizations', createOrganizationRoutes(tenantManager));
  
  // Tenant-specific routes
  app.use('/api', tenantMiddleware(tenantManager));
  app.use('/api/crops', createCropRoutes());
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  // Start the server
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await tenantManager.closeConnections();
    process.exit(0);
  });
}

main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
```

## Docker Setup

For easier deployment and development, let's set up Docker:

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: farmadmin
      POSTGRES_PASSWORD: harvest2025
      POSTGRES_DB: farm_tenants
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U farmadmin -d farm_tenants"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: farm_tenants
      DB_USER: farmadmin
      DB_PASSWORD: harvest2025
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pgdata:
```

## Using the Multi-Tenant Farm Management System

Let's see how to use our multi-tenant system:

### Create a New Farm Organization

To create a new farm organization and its corresponding tenant database:

```bash
curl -X POST http://localhost:3000/organizations \
  -H "Content-Type: application/json" \
  -d '{"name": "Green Valley Co-op", "farmType": "mixed", "logoUrl": "https://example.com/logo.png"}'
```

This will:
1. Create an organization record in the base database
2. Create a new tenant database named `tenant_green-valley-co-op`
3. Apply all tenant-specific migrations to the new database
4. Return the organization details with its tenant ID

### Add Farm-Specific Data

To add data specific to a tenant (e.g., crops), include the tenant ID in the request:

```bash
curl -X POST http://localhost:3000/api/crops \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: green-valley-co-op" \
  -d '{"name": "Heirloom Tomatoes", "plantingDate": "2023-04-15", "organizationId": "the-org-uuid"}'
```

The tenant middleware identifies the tenant from the `X-Tenant-ID` header and routes the request to the appropriate tenant database.

## Testing Your Multi-Tenant Setup

To ensure your multi-tenant system is working correctly, run the migration test:

```bash
npm run test:migrations
```

This will:
1. Discover all existing tenant databases
2. Apply any pending migrations to each tenant
3. Verify that migrations executed successfully
4. Create a test tenant if none exist

## Comparing Multi-Tenant Approaches

While we've implemented the database-per-tenant model in this tutorial, it's worth understanding all three common approaches to multi-tenancy, as each has its own advantages:

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Database-per-Tenant** | Each tenant gets their own dedicated database | • Maximum isolation<br>• Simplest compliance story<br>• Easy backup/restore per tenant<br>• Custom schema per tenant | • More databases to manage<br>• Higher infrastructure costs<br>• Connection pooling challenges |
| **Schema-per-Tenant** | Each tenant gets their own schema within a shared database | • Better isolation than row-level<br>• Easier compliance than row-level<br>• Lower infra cost than database-per-tenant<br>• Custom schema per tenant | • DB-level resource contention<br>• More complex backup/restore<br>• Limited by DB schema count |
| **Row-Level Tenancy** | All tenants share tables, rows filtered by tenant ID | • Simplest to implement<br>• Lowest infrastructure cost<br>• Efficient resource sharing<br>• Easiest scaling | • Weakest isolation<br>• Risk of data leaks<br>• Difficult compliance story<br>• Limited customization |

Choosing the right model depends on your specific requirements:

- **Database-per-tenant** (as shown in this tutorial) works best when data isolation and regulatory compliance are top priorities, and when tenants might need custom schemas.
- **Schema-per-tenant** is a good middle ground that provides decent isolation at lower costs, but may not meet the strictest compliance requirements.
- **Row-level tenancy** is ideal for applications with very large numbers of small tenants where cost-efficiency is the primary concern and data isolation requirements are minimal.

You can also implement a hybrid approach, where some data uses row-level tenancy (for shared, non-sensitive data) while sensitive data is stored in tenant-specific schemas or databases.

## Conclusion

Building multi-tenant applications presents unique challenges, but with the right architecture, you can create scalable, secure, and maintainable SaaS platforms. In this guide, we've built a robust multi-tenant farm management system using MikroORM and PostgreSQL that provides:

- **Complete data isolation** through the database-per-tenant model
- **Dynamic tenant routing** via Express middleware
- **Efficient connection management** with our TenantManager service
- **Automated tenant onboarding** with database creation and migrations
- **Flexible API design** that separates tenant-specific and global endpoints

This architecture gives you a solid foundation to build upon as your application grows. As you add more features, remember to keep tenant isolation as a core principle - every database query should be tenant-aware, either explicitly or implicitly through the middleware context. 

Future improvements to this setup could be to add authentication and session management.

For production deployments, you'll want to consider:

- **Implementing tenant caching** to reduce database lookups
- **Adding monitoring and observability** specific to multi-tenant metrics
- **Creating tenant-aware rate limiting** to prevent noisy neighbors
- **Establishing tenant lifecycle management** for suspensions, archiving, and deletions
- **Setting up tenant-specific backups** for disaster recovery

### Further Resources

- [MikroORM Documentation](https://mikro-orm.io/docs) - Official documentation for MikroORM
- [MikroORM PostgreSQL Integration](https://mikro-orm.io/docs/usage-with-sql) - Specific guide for PostgreSQL
- [Express.js Documentation](https://expressjs.com/) - For more on Express and middleware
- [SaaS Tenant Management Best Practices](https://aws.amazon.com/blogs/apn/multi-tenant-storage-with-amazon-dynamodb/) - AWS guide on multi-tenant data storage
- [Microservices in a Multi-Tenant Architecture](https://docs.microsoft.com/en-us/azure/architecture/microservices/multi-tenant) - Microsoft's guide on microservices and multi-tenancy

Multi-tenancy enables your application to serve multiple customers efficiently while keeping their data secure and isolated. Whether you're building a small SaaS startup or an enterprise platform, these principles will help you create scalable, maintainable software that can grow with your business.

---

*This tutorial demonstrates one approach to multi-tenancy with MikroORM. For different requirements, you might consider alternate approaches or technologies, but the core principles of tenant isolation and efficient resource management remain the same across implementations.*


