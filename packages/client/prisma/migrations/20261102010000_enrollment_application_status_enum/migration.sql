DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "EnrollmentApplication"
        WHERE "status" NOT IN ('pending', 'approved', 'rejected')
    ) THEN
        RAISE EXCEPTION 'EnrollmentApplication contains statuses outside pending, approved, rejected';
    END IF;
END $$;

CREATE TYPE "EnrollmentApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

ALTER TABLE "EnrollmentApplication"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "EnrollmentApplicationStatus"
USING ("status"::text::"EnrollmentApplicationStatus"),
ALTER COLUMN "status" SET DEFAULT 'pending';
