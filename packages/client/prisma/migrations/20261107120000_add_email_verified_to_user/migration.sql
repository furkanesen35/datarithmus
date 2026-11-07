-- Existing accounts are treated as verified; only new self-registrations start unverified.
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT true;
