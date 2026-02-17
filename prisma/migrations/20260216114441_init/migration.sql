-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "careerHR" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
