# Injibara SE Community App — Architecture

This document is the single source of truth for database schema and API design.
Every model file in `server/src/models/` and every route file in `server/src/routes/`
must match what is defined here. If something needs to change, update this file first.

---

## 1. Database Schema

### `users` (students)

| Field                     | Type                                                                     | Notes                                   |
| ------------------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| `_id`                     | ObjectId                                                                 | Auto                                    |
| `studentId`               | String, unique, required                                                 | Login identifier, e.g. `INU1500510`     |
| `passwordHash`            | String, required                                                         | bcrypt hashed                           |
| `fullName`                | `{ first, middle, last }`                                                | From roster upload                      |
| `role`                    | Enum: `student`                                                          | Fixed for this collection               |
| `batch`                   | String, required                                                         | e.g. `"3rd Year"` — explicit, admin-set |
| `enrollmentType`          | Enum: `direct`, `transfer`                                               | Admin-set at creation                   |
| `joinedAt`                | Date                                                                     | Actual join date                        |
| `status`                  | Enum: `pending`, `active`, `suspended`, `alumni`                         | Account lifecycle                       |
| `profile`                 | `{ photoUrl, bio, skills[], github, linkedin, portfolio, email, phone }` | Optional, user-editable                 |
| `createdAt` / `updatedAt` | Date                                                                     | Timestamps                              |

**Indexes:** `studentId` (unique), `batch`

---

### `teachers`

| Field                     | Type                                                 | Notes                        |
| ------------------------- | ---------------------------------------------------- | ---------------------------- |
| `_id`                     | ObjectId                                             | Auto                         |
| `teacherId`               | String, unique, required                             | e.g. `SE-T-014`              |
| `passwordHash`            | String, required                                     |                              |
| `fullName`                | `{ first, middle, last }`                            |                              |
| `email`                   | String, required                                     |                              |
| `status`                  | Enum: `pending_approval`, `active`, `suspended`      |                              |
| `assignedCourses`         | Array of `{ courseId (ref Course), batch, section }` | Multi-batch access mechanism |
| `createdAt` / `updatedAt` | Date                                                 |                              |

**Indexes:** `teacherId` (unique), `assignedCourses.courseId`

---

### `courses`

| Field                     | Type                            | Notes                                |
| ------------------------- | ------------------------------- | ------------------------------------ |
| `_id`                     | ObjectId                        |                                      |
| `name`                    | String, required                | e.g. "Data Structures"               |
| `code`                    | String                          | e.g. "SE-2201"                       |
| `batch`                   | String, required                | Which batch this offering belongs to |
| `teacherIds`              | Array of ObjectId (ref Teacher) |                                      |
| `semester`                | String                          | e.g. "Semester 1"                    |
| `createdAt` / `updatedAt` | Date                            |                                      |

**Indexes:** `batch`, `teacherIds`

---

### `chats`

| Field                     | Type                                                       | Notes                                                 |
| ------------------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| `_id`                     | ObjectId                                                   |                                                       |
| `type`                    | Enum: `batch`, `course`, `department`, `private`, `custom` | Determines access rule used                           |
| `batchScope`              | String, nullable                                           | Used when `type` is `batch`/`course` — the ABAC field |
| `courseId`                | ObjectId, nullable                                         | Used when `type` is `course`                          |
| `memberIds`               | Array of ObjectId, nullable                                | Used only for `private`/`custom` types                |
| `name`                    | String                                                     | Display name                                          |
| `isArchived`              | Boolean, default `false`                                   | Set true on batch promotion                           |
| `createdAt` / `updatedAt` | Date                                                       |                                                       |

**Indexes:** `batchScope`, `memberIds`, `type`

---

### `messages`

| Field                | Type                                                    | Notes                             |
| -------------------- | ------------------------------------------------------- | --------------------------------- |
| `_id`                | ObjectId                                                |                                   |
| `chatId`             | ObjectId (ref Chat), required                           |                                   |
| `senderId`           | ObjectId, required                                      | Ref User or Teacher               |
| `senderRole`         | Enum: `student`, `teacher`                              | Sender could be either collection |
| `content`            | String                                                  | Text content                      |
| `type`               | Enum: `text`, `image`, `video`, `audio`, `file`, `code` |                                   |
| `attachmentUrl`      | String, nullable                                        | Cloudinary URL if media           |
| `replyTo`            | ObjectId, nullable                                      | Thread replies                    |
| `reactions`          | Array of `{ userId, emoji }`                            |                                   |
| `editedAt`           | Date, nullable                                          |                                   |
| `deletedForEveryone` | Boolean, default `false`                                |                                   |
| `pinnedAt`           | Date, nullable                                          |                                   |
| `readBy`             | Array of ObjectId                                       | Read receipts                     |
| `createdAt`          | Date                                                    |                                   |

**Indexes:** `chatId` + `createdAt` (compound — critical for fast message list loading)

---

### `files`

| Field                | Type                       | Notes                   |
| -------------------- | -------------------------- | ----------------------- |
| `_id`                | ObjectId                   |                         |
| `uploaderId`         | ObjectId, required         |                         |
| `uploaderRole`       | Enum: `student`, `teacher` |                         |
| `chatId`             | ObjectId, nullable         | If shared in a chat     |
| `courseId`           | ObjectId, nullable         | If it's course material |
| `batchScope`         | String, nullable           | ABAC field              |
| `fileName`           | String                     |                         |
| `fileType`           | String                     | MIME type               |
| `fileSizeBytes`      | Number                     |                         |
| `cloudinaryUrl`      | String, required           |                         |
| `cloudinaryPublicId` | String                     | Needed for deletion     |
| `createdAt`          | Date                       |                         |

**Indexes:** `batchScope`, `courseId`

---

### `announcements`

| Field        | Type                                  | Notes            |
| ------------ | ------------------------------------- | ---------------- |
| `_id`        | ObjectId                              |                  |
| `authorId`   | ObjectId, required                    | Teacher or Admin |
| `scope`      | Enum: `batch`, `course`, `department` |                  |
| `batchScope` | String, nullable                      |                  |
| `courseId`   | ObjectId, nullable                    |                  |
| `title`      | String                                |                  |
| `content`    | String                                |                  |
| `pinned`     | Boolean, default `false`              |                  |
| `createdAt`  | Date                                  |                  |

---

### `notifications`

| Field         | Type                                                      | Notes                                         |
| ------------- | --------------------------------------------------------- | --------------------------------------------- |
| `_id`         | ObjectId                                                  |                                               |
| `recipientId` | ObjectId, required                                        |                                               |
| `type`        | Enum: `mention`, `reaction`, `announcement`, `assignment` |                                               |
| `sourceId`    | ObjectId                                                  | Ref to message/announcement that triggered it |
| `read`        | Boolean, default `false`                                  |                                               |
| `createdAt`   | Date                                                      |                                               |

**Indexes:** `recipientId` + `read`

---

### `auditLogs`

| Field        | Type               | Notes                                                        |
| ------------ | ------------------ | ------------------------------------------------------------ |
| `_id`        | ObjectId           |                                                              |
| `actorId`    | ObjectId, required | Admin who performed the action                               |
| `action`     | String             | e.g. `"promote_batch"`, `"delete_user"`, `"approve_teacher"` |
| `targetType` | String             | e.g. `"User"`, `"Course"`                                    |
| `targetId`   | ObjectId           |                                                              |
| `metadata`   | Mixed              | Extra context                                                |
| `createdAt`  | Date               |                                                              |

---

### `reports`

| Field        | Type                                     | Notes |
| ------------ | ---------------------------------------- | ----- |
| `_id`        | ObjectId                                 |       |
| `reporterId` | ObjectId, required                       |       |
| `targetType` | Enum: `message`, `user`                  |       |
| `targetId`   | ObjectId                                 |       |
| `reason`     | String                                   |       |
| `status`     | Enum: `pending`, `reviewed`, `dismissed` |       |
| `reviewedBy` | ObjectId, nullable                       |       |
| `createdAt`  | Date                                     |       |

---

## 2. API Endpoint Plan

### Auth — `/api/auth`

---

## 3. UI Planning

### Page Inventory

| Page                      | Route                      | Access        | Phase              |
| ------------------------- | -------------------------- | ------------- | ------------------ |
| Landing                   | `/`                        | Public        | 6                  |
| Login                     | `/login`                   | Public        | 6                  |
| Set Password (activation) | `/activate`                | Public        | 6                  |
| Dashboard                 | `/dashboard`               | Authenticated | 6                  |
| Profile                   | `/profile`                 | Authenticated | 6                  |
| 404                       | `*`                        | Public        | 6                  |
| Chats                     | `/chats`, `/chats/:chatId` | Authenticated | 7                  |
| Groups                    | `/groups`                  | Authenticated | 8                  |
| Files                     | `/files`                   | Authenticated | 9                  |
| Courses                   | `/courses`, `/courses/:id` | Authenticated | 10                 |
| Notifications             | `/notifications`           | Authenticated | 11                 |
| Admin Dashboard           | `/admin/*`                 | Admin only    | 12                 |
| Search                    | `/search`                  | Authenticated | Later              |
| Settings                  | `/settings`                | Authenticated | Later              |
| About                     | `/about`                   | Public        | Needs real content |
| Help Center               | `/help`                    | Public        | Later              |
| Privacy Policy            | `/privacy`                 | Public        | Before deployment  |
| Terms                     | `/terms`                   | Public        | Before deployment  |

### Layout Structure

### Design System

| Element                                                 | Decision                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Font                                                    | Inter (Google Fonts)                                                           |
| Theme                                                   | Dark mode default, light mode toggle                                           |
| Heavy visual effects (glassmorphism, gradients, aurora) | Landing, Login, Dashboard chrome only — never chat message lists (performance) |
| Icons                                                   | Lucide React                                                                   |
| Spacing                                                 | Tailwind defaults, mobile-first breakpoints                                    |

### State Management

| Concern         | Tool                                                                |
| --------------- | ------------------------------------------------------------------- |
| Server data     | TanStack Query                                                      |
| Client UI state | Redux Toolkit                                                       |
| Real-time       | Socket.IO client -> feeds TanStack Query cache                      |
| Forms           | React Hook Form + Zod (reuses `shared/validation` schemas directly) |
