-- Voice samples and voice profile for personalized AI generation
ALTER TABLE companies ADD COLUMN IF NOT EXISTS voice_samples text[] NOT NULL DEFAULT '{}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS voice_profile jsonb;
