# Database Migration Instructions

## Overview
This migration updates the organization role structure to merge the 'president' role into 'organization' and adds proper role management within organizations.

## Changes Made

### 1. Users Table
- **Removed**: 'president' from role enum
- **Updated**: role enum now includes: 'admin', 'monitoring staff', 'organization', 'couple'
- **Migration**: Existing users with 'president' role are converted to 'organization'

### 2. Organizations Table
- **Updated**: `president_id` is now NOT NULL (organizations cannot exist without a president)
- **Removed**: UNIQUE constraint on president_id (one user can be president of multiple organizations)

### 3. User_Organizations Table
- **Added**: `org_role` enum ('president', 'member') with default 'member'
- **Updated**: `status` enum now includes 'removed'
- **Added**: `removed_at`, `removed_by`, `removal_remarks` for audit trail
- **Migration**: Existing organization presidents are marked as 'president' in org_role

### 4. Notifications Table
- **Removed**: 'president' from role_target enum
- **Updated**: role_target now includes: 'admin', 'staff', 'organization', 'couple'

## Running the Migration

### Option 1: Using Laravel Artisan
```bash
cd backend
php artisan migrate
```

### Option 2: Manual Execution (if artisan doesn't work)
1. Backup your database
2. Run the migration SQL manually
3. Verify data integrity

## Data Migration Logic

The migration automatically:
1. Converts existing 'president' role users to 'organization' role
2. Sets org_role = 'president' for users who are presidents of organizations
3. Sets org_role = 'member' for all other organization users
4. Updates status to 'accepted' for existing president relationships

## Post-Migration Verification

After running the migration, verify:

1. **Users Table**: No users should have 'president' role
2. **Organizations Table**: All organizations should have a president_id
3. **User_Organizations Table**: 
   - Each organization should have exactly one president record
   - All other members should have org_role = 'member'
4. **Application Logic**: Test organization creation, join requests, and president functions

## Application Updates Required

The following files have been updated to work with the new structure:
- ✅ User.php model
- ✅ Organization.php model  
- ✅ UserOrganization.php model
- ✅ Notification.php model
- ✅ AuthController.php
- ✅ OrganizationController.php
- ✅ Mobile app auth-context.ts

## Rollback Plan

If issues occur, you can rollback:
```bash
php artisan migrate:rollback
```

Note: Due to enum changes, some databases may have difficulty with rollbacks. Always backup before migrating.

## Testing Checklist

- [ ] Organization creation works with president assignment
- [ ] President can approve/reject join requests
- [ ] Members can join organizations with pending status
- [ ] President can remove members
- [ ] Notifications work correctly for all role targets
- [ ] Mobile app handles new role structure
- [ ] Admin dashboard displays organizations correctly
