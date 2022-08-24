import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const result = await this.repository
      .createQueryBuilder("game")
      .where("game.title ILIKE :param", { param: `%${param}%` })
      .getMany();
    return result;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const result = await this.repository.query(`
      SELECT COUNT(*) AS count FROM GAMES
    `);
    return result;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.repository
      .createQueryBuilder("game")
      .where("game.id = :id", { id })
      .leftJoinAndSelect("game.users", "users")
      .getOne();
    const users = result!.users;
    return users;
  }
}
