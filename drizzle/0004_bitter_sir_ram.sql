CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"codeMeli" varchar(10) NOT NULL,
	CONSTRAINT "people_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "people_codeMeli_unique" UNIQUE("codeMeli")
);
