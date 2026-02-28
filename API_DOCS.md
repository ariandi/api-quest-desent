# API Quest — Documentation

Base URL (local): `http://localhost:3000`

---

## Quick Start

```bash
# Install dependencies
npm install

# Development (hot reload)
npm run dev

# Production
npm run build && npm start
```

---

## Level 1 — Ping

Verifikasi server berjalan.

### `GET /ping`

**Request**
```bash
curl -s http://localhost:3000/ping
```

**Response `200`**
```json
{
  "message": "pong"
}
```

---

## Level 2 — Echo

Server mengembalikan request body apa adanya.

### `POST /echo`

**Request**
```bash
curl -s -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{
    "message": "hello world",
    "number": 42,
    "nested": { "key": "value" }
  }'
```

**Response `200`**
```json
{
  "message": "hello world",
  "number": 42,
  "nested": { "key": "value" }
}
```

---

## Level 3 — CRUD: Create & Read

### `POST /books`

Membuat buku baru. Field `title` dan `author` wajib diisi.

**Request**
```bash
curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Go Programming Language",
    "author": "Alan Donovan"
  }'
```

**Response `201`**
```json
{
  "id": 1,
  "title": "The Go Programming Language",
  "author": "Alan Donovan"
}
```

---

### `GET /books` _(requires auth — lihat Level 5)_

Menampilkan semua buku. Endpoint ini membutuhkan Bearer token.

**Request**
```bash
curl -s http://localhost:3000/books \
  -H "Authorization: Bearer <token>"
```

**Response `200`**
```json
[
  {
    "id": 1,
    "title": "The Go Programming Language",
    "author": "Alan Donovan"
  },
  {
    "id": 2,
    "title": "Clean Code",
    "author": "Robert Martin"
  }
]
```

---

### `GET /books/:id`

Menampilkan satu buku berdasarkan ID.

**Request**
```bash
curl -s http://localhost:3000/books/1
```

**Response `200`**
```json
{
  "id": 1,
  "title": "The Go Programming Language",
  "author": "Alan Donovan"
}
```

**Response `404` — ID tidak ditemukan**
```json
{
  "error": "AppError",
  "message": "Book with id 1 not found"
}
```

---

## Level 4 — CRUD: Update & Delete

### `PUT /books/:id`

Mengupdate data buku. Minimal satu field (`title` atau `author`) harus dikirim.

**Request**
```bash
curl -s -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Go Programming Language (2nd Ed)",
    "author": "Alan Donovan & Brian Kernighan"
  }'
```

**Update sebagian (partial update)**
```bash
curl -s -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{ "title": "New Title Only" }'
```

**Response `200`**
```json
{
  "id": 1,
  "title": "The Go Programming Language (2nd Ed)",
  "author": "Alan Donovan & Brian Kernighan"
}
```

**Response `404` — ID tidak ditemukan**
```json
{
  "error": "AppError",
  "message": "Book with id 1 not found"
}
```

---

### `DELETE /books/:id`

Menghapus buku berdasarkan ID.

**Request**
```bash
curl -s -X DELETE http://localhost:3000/books/1
```

**Response `200`**
```json
{
  "message": "Book with id 1 successfully deleted"
}
```

**Response `404` — ID tidak ditemukan**
```json
{
  "error": "AppError",
  "message": "Book with id 1 not found"
}
```

---

## Level 5 — Auth Guard

Dapatkan token lalu gunakan sebagai Bearer token untuk mengakses endpoint yang protected.

### `POST /auth/token`

Menghasilkan token autentikasi baru.

**Request**
```bash
curl -s -X POST http://localhost:3000/auth/token
```

**Response `200`**
```json
{
  "token": "MTc3MjI0NjI4OTEzNS00a3U4ZTFnaGQzNw"
}
```

---

### Menggunakan token

Simpan token dan gunakan di header `Authorization`.

**Bash — simpan token ke variable**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/token | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"
```

**Akses endpoint protected**
```bash
curl -s http://localhost:3000/books \
  -H "Authorization: Bearer $TOKEN"
```

**Response `401` — tanpa token**
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header"
}
```

**Response `401` — token tidak valid**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

## Level 6 — Search & Paginate

### `GET /books?author=<query>` _(requires auth)_

Filter buku berdasarkan nama author (case-insensitive, partial match).

**Request**
```bash
curl -s "http://localhost:3000/books?author=Robert" \
  -H "Authorization: Bearer $TOKEN"
```

**Response `200`**
```json
[
  {
    "id": 2,
    "title": "Clean Code",
    "author": "Robert Martin"
  }
]
```

---

### `GET /books?page=<n>&limit=<n>` _(requires auth)_

Paginate hasil buku.

| Query Param | Tipe | Keterangan |
|-------------|------|------------|
| `page` | integer ≥ 1 | Halaman ke- (default: 1) |
| `limit` | integer ≥ 1 | Jumlah item per halaman (default: 10) |

**Request**
```bash
curl -s "http://localhost:3000/books?page=1&limit=2" \
  -H "Authorization: Bearer $TOKEN"
```

**Response `200`**
```json
{
  "data": [
    { "id": 1, "title": "The Go Programming Language", "author": "Alan Donovan" },
    { "id": 2, "title": "Clean Code", "author": "Robert Martin" }
  ],
  "total": 5,
  "page": 1,
  "limit": 2,
  "totalPages": 3
}
```

---

### Kombinasi Search + Paginate _(requires auth)_

```bash
curl -s "http://localhost:3000/books?author=Robert&page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Level 7 — Error Handling

### `POST /books` — validasi field kosong

**Request tanpa `title`**
```bash
curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{ "author": "Unknown" }'
```

**Response `400`**
```json
{
  "error": "AppError",
  "message": "Field 'title' is required and must be a non-empty string"
}
```

**Request tanpa `author`**
```bash
curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{ "title": "Some Book" }'
```

**Response `400`**
```json
{
  "error": "AppError",
  "message": "Field 'author' is required and must be a non-empty string"
}
```

**Request body kosong**
```bash
curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response `400`**
```json
{
  "error": "AppError",
  "message": "Field 'title' is required and must be a non-empty string"
}
```

---

### `GET /books/:id` — ID tidak ditemukan

```bash
curl -s http://localhost:3000/books/9999
```

**Response `404`**
```json
{
  "error": "AppError",
  "message": "Book with id 9999 not found"
}
```

---

## Level 8 — Boss: Speed Run

Semua endpoint digunakan sekaligus. Contoh full flow:

```bash
# 1. Ping
curl -s http://localhost:3000/ping

# 2. Echo
curl -s -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"hello": "world"}'

# 3. Create books
curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code", "author": "Robert Martin"}'

curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Pragmatic Programmer", "author": "David Thomas"}'

curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Design Patterns", "author": "Gang of Four"}'

# 4. Get token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/token | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 5. Get all books (protected)
curl -s http://localhost:3000/books \
  -H "Authorization: Bearer $TOKEN"

# 6. Get book by ID
curl -s http://localhost:3000/books/1

# 7. Update book
curl -s -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code (Revised)"}'

# 8. Search by author
curl -s "http://localhost:3000/books?author=Robert" \
  -H "Authorization: Bearer $TOKEN"

# 9. Paginate
curl -s "http://localhost:3000/books?page=1&limit=2" \
  -H "Authorization: Bearer $TOKEN"

# 10. Delete book
curl -s -X DELETE http://localhost:3000/books/3

# 11. Error: not found
curl -s http://localhost:3000/books/9999

# 12. Error: invalid body
curl -s -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"author": "No Title"}'
```

---

## HTTP Status Code Summary

| Status | Keterangan |
|--------|------------|
| `200` | OK — request berhasil |
| `201` | Created — resource berhasil dibuat |
| `400` | Bad Request — validasi gagal / input tidak valid |
| `401` | Unauthorized — token tidak ada atau tidak valid |
| `404` | Not Found — resource atau route tidak ditemukan |
| `500` | Internal Server Error — error tidak terduga |

---

## Error Response Format

Semua error menggunakan format yang konsisten:

```json
{
  "error": "string",
  "message": "string"
}
```
