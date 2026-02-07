# MailerList API Documentation
## Overview
The `MailerList` function now uses **optional properties** for group management. Simply **omit** properties you don't want to update, and they'll be preserved from the existing subscriber data.
---
## API Signature
```typescript
export type MailerListType = {
  email: string;                    // Required
  firstName?: string | null;        // Optional
  lastName?: string | null;         // Optional
  notify?: boolean | null;          // Optional
  // Group flags - omit to preserve existing values
  newsletterGroup?: boolean;        // undefined = don't touch
  membershipGroup?: boolean;        // undefined = don't touch
  premiumGroup?: boolean;           // undefined = don't touch
  standardGroup?: boolean;          // undefined = don't touch
  freeGroup?: boolean;              // undefined = don't touch
  // Member type - omit to preserve existing value
  memberType?: 'free' | 'paid' | 'standard' | 'premium' | null;
};
```
---
## Usage Examples
### Example 1: Full Update (Stripe Webhook)
Update all fields including tier groups:
```typescript
await MailerList({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  membershipGroup: true,
  premiumGroup: true,        // Set user to premium tier
  standardGroup: false,
  freeGroup: false,
  memberType: 'premium',
  newsletterGroup: true,
  noti  noti  noti  noti  noti  noti- ✅ Removes all tier groups
- ✅ Adds to MEMBER_PREMIUM_GROUP_ID
- ✅ Sets member_type to 'premium'
- ✅ Adds- ✅ Adds- ✅ Adds- ✅ Adds- ✅ Adds- hip group
- ✅ Adds- ✅ Adds- ✅ Adds- ✅ Adds- ✅ Adds- g)
Only updOnly updOnly updOnly updOnly updOnly updOnly updOnly ```typescrOnly updOnly updOnly updOnly updOnly updOnly updOnly  firstName: 'John',
  lastName: 'Doe',
  newsletterGroup: true,     // Update newsletter preference
  notify: true,
  // Omit tier groups → preserves existing tier
  // Omit memberType   // Omit memberType   // Omit memberType   // Omit membeoup → doesn't mo  // Omit rship
});
```
**Result:**
- ✅ Newsletter group add- ✅ Newsletter group add- ✅ N- ✅ **Tier groups preserved** (not touched)
- ✅ **member_type field preserved** (not touched)
- ✅ **Memb- ✅ **Memb- ✅ *ved** - ✅ **Memb- ---
### Example 3: Unsubscribe from Newslet### Example 3: Unsub newsletter, preserve everything else:
```typescript
await MailerList({
  email: 'user@example.com',
  newsletterGroup: false,    // Remove   newsletterGroup: false, everything e  newsletterGroup: falseher data
});
```
**Result:**
- ✅ Newsletter group removed
- ✅ All other groups and fields preserved
---
### Example 4: Upgrade from Standard to Premium
Change tier without affecting other settings:
```typescript
await MailerList({
  email: 'user@example.com',
  premium  premitrue,        // Upgrade to premium
  standardGroup: false,
  freeGroup: false,
  memberType: 'premium',
  // Omit newsletterGroup → prese  // Omit newsletterGroup → prese  // Omit newsletterGroup → prese  // Omit newsletterGroup → prese- ✅ Removed f  // OmitR_STANDARD_GROUP_ID
- ✅ Added to MEMBER_PREMIUM_GROUP_ID
- ✅ member_type updated to 'premium'
- ✅ Newsletter and membership groups preserved
---
## Behavi## Behavi## Behavi## Behavi#- **If any tier group prope## Behavi## Behavi## Behavi## Behavi#- **If any tier group prope## Behavi## Behavi## Behavimoved
    Only the group with `true` value is added
- **If all tier group properties are undefined**:
  - Existing tier groups are preserved (not modified)
### 2. member_type Fiel##- **If `memberType### 2. member_type Fiel##- ned`### 2. member_type Fiel##- **If `membd to the ne### 2. m- **If `memberType` is `undefined`**:
  - Existing value is preserved for existing subscribers
  - New subscribers get `null`
- **If `memberType` is `null`**:
  - Field is explicitly set to `null`
### 3. Newsletter Group
- **If `newsletterGroup` is `true`**: Add to newsletter group
- **If `newsletterGroup` is `false`**: Remove from newsletter group
- **If `newsletterGroup` is `undefined`**: Don't modify newsletter group
### 4. Membership Group
- **If `membershipGroup` is `true`**: Add to membership group
- **If `membershipGr- **If `membershipGr- **If `membershipGr- **If membership group
---
## Migration Guide
### Before (Required false values)
```typescript
await MailerList({
  email: 'user@example.com',
  newsletterGroup: true,
  mem  mem  mem  mem  mem  mem  mem  mem  mxplicitl  mem  mem  mem  mem  mem  mem  mem  mem  / ❌ Ha  mem  mem  mem  mss false
  standardGroup: false,     // ❌ Had to explicitly pass false
  freeGroup: false,         // ❌ Had to explicitly pass false
  memberType: null,         // ❌ Had to explicitly pass null
});
```
### After (Omit properties)
```typescript
await MailerList({
  email: 'user@example.  email: 'user@example.  email:  // ✅ Just omit properties you don't   email: 'user@e});
```
---
## Implementation Notes
- The function checks `property !== undefined` to determine if a property was explicitly provided
- This allows you to distinguish between:
  - `undefined` = "don't touch this"
  - `false` = "set to false / remove from group"
  - `true` = "set to true / add to group"
- For `memberType`, both `undefined` and `null` are handled:
  - `undefined` = preserve existing
  - `null` = explicitly set to null
