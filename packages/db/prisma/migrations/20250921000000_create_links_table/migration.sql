-- CreateTable
CREATE TABLE "public"."Link" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Link_title_idx" ON "public"."Link"("title");

-- CreateIndex
CREATE INDEX "Link_tags_idx" ON "public"."Link" USING GIN ("tags");

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for Link table
CREATE TRIGGER update_links_updated_at
BEFORE UPDATE ON "public"."Link"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();