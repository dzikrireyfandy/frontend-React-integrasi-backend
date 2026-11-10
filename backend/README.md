REST API: CRUD & Database Integration
- **Runtime & Language:** Node.js, TypeScript
- **Framework:** Express.js
- **Database & ORM:** SQL Server (SSMS), Drizzle ORM
- **API Documentation:** Swagger UI (`swagger-autogen`)
- **Security:** Bcrypt (Password Hashing)

## 1. Struktur Folder

```
tugas2-drizzle/
├─ package.json
├─ tsconfig.json
├─ drizzle.config.ts
├─ .env.example
├─ sql/
│  ├─ 00-setup-mixed-mode.sql       
│  ├─ 01-create-database-and-user.sql 
│  ├─ 02-schema.sql                   
│  └─ 03-seed.sql                     
└─ src/
   ├─ index.ts              
   ├─ db/
   │  ├─ schema.ts           
   │  └─ index.ts            
   ├─ docs/
   │  ├─ swagger.ts         
   │  └─ swagger-output.json 
   ├─ dtos/                  
   ├─ repositories/          
   ├─ services/              
   ├─ controllers/          
   └─ routes/                
```
