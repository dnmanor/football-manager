import {faker} from "@faker-js/faker";
import {Position} from "@prisma/client";
import prisma from "../client";
import {RabbitMQService} from "./queue.service";

const DEFAULT_CONFIG = {
  goalkeepers: 3,
  defenders: 6,
  midfielders: 6,
  forwards: 5,
};

const PRICE_RANGES = {
  GOALKEEPER: {min: 100000, max: 500000},
  DEFENDER: {min: 100000, max: 800000},
  MIDFIELDER: {min: 200000, max: 1000000},
  FORWARD: {min: 300000, max: 1500000},
};

const ARTIFICIAL_FIVE_SECONDS_DELAY = 5000;

export async function generatePlayersForUser(userId: string) {
  const players = [];
  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_FIVE_SECONDS_DELAY));

  for (let i = 0; i < DEFAULT_CONFIG.goalkeepers; i++) {
    players.push(createPlayer("GOALKEEPER"));
  }

  for (let i = 0; i < DEFAULT_CONFIG.defenders; i++) {
    players.push(createPlayer("DEFENDER"));
  }

  for (let i = 0; i < DEFAULT_CONFIG.midfielders; i++) {
    players.push(createPlayer("MIDFIELDER"));
  }

  for (let i = 0; i < DEFAULT_CONFIG.forwards; i++) {
    players.push(createPlayer("FORWARD"));
  }

  const team = await prisma.team.create({
    data: {
      name: `${faker.company.name()} FC`,
      userId: userId,
    },
  });

  await prisma.player.createMany({
    data: players.map((player) => ({
      ...player,
      teamId: team.id,
      available_for_transfer: false,
    })),
  });

  return team;
}

export async function startPlayerGenerationService() {
  const rabbitMQ = RabbitMQService.getInstance();
  await rabbitMQ.connect();

  await rabbitMQ.consumeUserCreated(async (userId: string) => {
    console.log(`Generating players for user: ${userId}`);
    await generatePlayersForUser(userId);
    console.log(`Players generated for user: ${userId}`);
  });
}

function createPlayer(position: Position) {
  const priceRange = PRICE_RANGES[position];

  return {
    name: faker.person.fullName(),
    position,
    price: faker.number.int({min: priceRange.min, max: priceRange.max}),
  };
}
