# UserProfile Entity

User profile entity for Firestore document storage.

---

## Strategy

**Purpose**: Represents user profile data stored in Firestore. Contains display information, metadata, and profile settings.

**When to Use**:
- Storing user profile data
- Displaying user information
- Profile management operations
- User metadata tracking

**Location**: `src/domain/entities/UserProfile.ts`

---

## Type Definition

### UserProfile Interface

**PROPERTIES**:
- `uid: string` - User ID
- `email: string | null` - Email address
- `displayName: string | null` - Display name
- `photoURL: string | null` - Profile photo URL
- `isAnonymous: boolean` - Anonymous flag
- `createdAt: Date | null` - Account creation date
- `lastLoginAt: Date | null` - Last login timestamp

### UpdateProfileParams

**PROPERTIES**:
- `displayName?: string` - New display name
- `photoURL?: string` - New photo URL

**Rules**:
- MUST provide at least one field
- MUST validate updates before saving
- MUST handle partial updates

**Constraints**:
- Optional fields
- Only provided fields updated
- Validation applies

---

## Profile States

### Complete Profile

**CHARACTERISTICS**:
- Has displayName
- Has email
- Has photoURL
- Not anonymous

**Rules**:
- SHOULD encourage completion
- MAY require for features
- MUST validate updates

---

### Minimal Profile

**CHARACTERISTICS**:
- May have null displayName
- Has email
- May not have photoURL
- Not anonymous

**Rules**:
- MUST have email
- CAN be incomplete
- SHOULD encourage completion

---

### Anonymous Profile

**CHARACTERISTICS**:
- isAnonymous = true
- Null email
- Null displayName
- Null photoURL

**Rules**:
- MUST treat as temporary
- SHOULD encourage upgrade
- MUST offer registration

---

## Profile Operations

### Creation

**RULES**:
- MUST create on user registration
- MUST include uid
- MUST set initial timestamps
- MUST NOT delete existing profiles

**CONSTRAINTS**:
- One profile per uid
- Created in Firestore
- Auto-generated timestamps

---

### Updates

**RULES**:
- MUST validate input data
- MUST update updatedAt timestamp
- MUST preserve existing data
- MUST handle concurrent updates

**CONSTRAINTS**:
- Partial updates supported
- Fields not provided unchanged
- Validation required

---

### Deletion

**RULES**:
- MUST mark as deleted (not actual delete)
- MAY retain data for grace period
- MUST handle cleanup properly
- MUST be reversible (initially)

**CONSTRAINTS**:
- Soft delete recommended
- May have retention period
- Permanent delete after period

---

## Validation

### Display Name Validation

**RULES**:
- MUST be 2-50 characters if provided
- MUST not contain only spaces
- SHOULD trim whitespace
- MAY allow special characters

**CONSTRAINTS**:
- Minimum length: 2 characters
- Maximum length: 100 characters
- Cannot be only whitespace

---

### Photo URL Validation

**RULES**:
- MUST be valid URL if provided
- MUST use HTTP or HTTPS
- SHOULD point to image file
- MUST be accessible

**CONSTRAINTS**:
- Valid URL format required
- HTTP or HTTPS protocol
- Image file extension preferred

---

## Profile Completeness

### Completeness Calculation

**FACTORS**:
- displayName presence
- email presence
- photoURL presence

**RULES**:
- SHOULD track completeness percentage
- MAY require for features
- MUST show user what's missing

**CONSTRAINTS**:
- 3 core fields checked
- Percentage calculation
- Missing fields list

---

## Firestore Integration

### Collection Structure

**COLLECTION**: `users`

**DOCUMENT ID**: User uid

**INDEXES**:
- displayName (ASCENDING)
- createdAt (DESCENDING)
- Composite indexes as needed

**Rules**:
- MUST use users collection by default
- MAY configure custom collection
- MUST create required indexes

---

### Timestamps

**SERVER TIMESTAMPS**:
- `createdAt` - Document creation
- `updatedAt` - Last update
- `lastLoginAt` - Last login

**Rules**:
- MUST use serverTimestamp() for creation
- MUST update on modification
- MUST track login time

---

## Privacy & Security

### Data Access

**RULES**:
- MUST NOT expose sensitive data
- MUST validate read permissions
- MUST log profile access
- MUST respect privacy settings

**MUST NOT**:
- Show internal IDs publicly
- Expose email without permission
- Log full profile data

---

### Anonymous Profiles

**RULES**:
- MUST indicate anonymous status
- MUST NOT show as authenticated
- SHOULD encourage upgrade
- MUST preserve during upgrade

**CONSTRAINTS**:
- Temporary state
- Limited data
- Upgrade path available

---

## Related Entities

- **AuthUser** (`./AuthUser.md`) - Authentication user entity
- **UpdateProfileParams** (see above) - Update parameters

## Related Infrastructure

- **UserDocumentService** (`../../infrastructure/services/UserDocumentService.ts`) - Document management
- **Firestore** - Database storage
