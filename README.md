# Test - ERP.Aero

#### Test task for [ERP.AERO](https://erp.aero/).

# Installation.

```
npm install
```

#### Create .env file with : 

```javascript
PORT='5000'
ACCESS_SECRET='SECRET'
REFRESH_SECRET='SECRET'
DATABASE_URL="mysql://user:pass@localhost:3306/db_name"
```

#### Run db migrations : 
```bash
npx prisma migrate dev
npx prisma generate
```

## Start

### To start :

```bash
npm run start
```

### To start in dev mode :
```bash
npm run dev
```

# Usage
Use thunder client or postman.

In root directory you can find "erp.aero_test.json" with all requests. (For thunder client)

# Authentication
## Sign Up
### Method: Post
### Route: 
```
http://localhost:5000/signup
```

### Body: 
```javascript
{
  "id": "email@mail.com",
  "password": "password"
}
```

### Response: 
```javascript
{
  accessToken: 'token',
  refreshToken: 'token'
}
```

## Sign In
### Method: Post
### Route: 
```
http://localhost:5000/signin
```

### Body: 
```javascript
{
  "id": "email@mail.com",
  "password": "password"
}
```

### Response: 
```javascript
{
  token: 'token'
}
```
Should create cookies with access and refresh token.

## Refresh tokens
### Method: Post
### Route: 
```
http://localhost:5000/signin/new_token
```

### Response: 
```javascript
{
  token: 'token'
}
```
Should update cookies with access and refresh token.

## Info
### Method: Get
### Route: 
```
http://localhost:5000/info
```

### Response: 
```javascript
{
  id: 'id'
}
```
## Log out
### Method: Get
### Route: 
```
http://localhost:5000/logout
```
Should clear cookies.


# Files
## Upload file
### Method: Post
### Route: 
```
http://localhost:5000/file/upload
```

### Body: 
```javascript
{
  "file": Add file,
}
```

## Download file
### Method: Get
### Route: 
```
http://localhost:5000/file/download/:id
```

### Response: 
Download link.

## Get all files
### Method: Get
### Route: 
```
http://localhost:5000/file?list_size&page 
```

### Response: 
```javascript
[
 {
  'name': 'name',
  'extension': '.jpg',
  'MIME': 'image/jpeg',
   'size': 42,
   'uploadedAt': '2024-04-14 12:23:00'
 }
]
```
## Get one file
### Method: Get
### Route: 
```
http://localhost:5000/file/:id
```

### Response: 
```javascript
 {
  'name': 'name',
  'extension': '.jpg',
  'MIME': 'image/jpeg',
   'size': 42,
   'uploadedAt': '2024-04-14 12:23:00'
 }
```

## Update file
### Method: Put
### Route: 
```
http://localhost:5000/file/update/:id
```

### Body: 
```javascript
{
  "file": Add file,
}
```

## Delete file
### Method: Delete
### Route: 
```
http://localhost:5000/file/update/:id
```