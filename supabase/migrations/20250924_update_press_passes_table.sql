-- Add download_type column to press_passes table
ALTER TABLE press_passes
ADD COLUMN IF NOT EXISTS download_type VARCHAR(20) DEFAULT 'download';

-- Add contact_email column to press_passes table
ALTER TABLE press_passes
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255) DEFAULT 'press@freepresspass.com';

-- Add comment to explain the download_type column
COMMENT ON COLUMN press_passes.download_type IS 'Type of download: download, open, camera_roll';

-- Add comment to explain the contact_email column
COMMENT ON COLUMN press_passes.contact_email IS 'Contact email for the press pass service';