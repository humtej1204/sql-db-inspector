import { IEntityMysqlRepository } from "../../../entity-mysql/domain/entity-mysql-repository";
import { IEntitySqlServerRepository } from "../../../entity-sql-server/domain/entity-sql-server-repository";
import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IStoreService } from "../../../shared/domain/services/store.service";
import {
  IJoinDataFromTablesParams,
  IJoinDataParams,
} from "../../domain/interfaces/join-data-from-tables-params.interface";

export class FindEntityJoined {
  private readonly entityMysqlRepository: IEntityMysqlRepository;
  private readonly entitySqlServerRepository: IEntitySqlServerRepository;
  private readonly storeService: IStoreService;

  constructor(private readonly context: IAppContext) {
    this.entityMysqlRepository =
      this.context.repositories.entityMysqlRepository;
    this.entitySqlServerRepository =
      this.context.repositories.entitySqlServerRepository;
    this.storeService = this.context.services.storeService;
  }

  async joinDataFromTables(data: IJoinDataFromTablesParams): Promise<any> {
    try {
      const mysqlQuery = this.entityMysqlRepository.executeQuery(
        data.mysql?.query
      );
      const sqlQuery = this.entitySqlServerRepository.executeQuery(
        data.sql?.query,
        data.sql?.database
      );

      const mysqlData = await mysqlQuery;
      const sqlData = await sqlQuery;

      if (!mysqlData || !sqlData) {
        return mysqlData.length ? mysqlData : sqlData;
      }

      const joinedData = this.joinData({
        sql: {
          result: sqlData,
          fk: data.sql!.fk,
        },
        mysql: {
          result: mysqlData,
          fk: data.mysql!.fk,
        },
      });

      this.storeService.save("REPORT", joinedData);
      return joinedData;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  joinData({ mysql, sql }: IJoinDataParams) {
    const left = sql?.result ?? [];
    const right = mysql?.result ?? [];
    const leftKey = sql?.fk;
    const rightKey = mysql?.fk;

    const toKey = (v: any): string | null => {
      if (v === null || v === undefined) return null;
      const s = String(v).trim().toLowerCase();
      return s === "" ? null : s;
    };

    const rightMap = new Map<string, number[]>();
    const rightVisited = new Array<boolean>(right.length).fill(false);

    right.forEach((row, i) => {
      const k = toKey(row?.[rightKey]);
      if (k !== null) {
        const arr = rightMap.get(k);
        if (arr) arr.push(i);
        else rightMap.set(k, [i]);
      }
    });

    const full: any[] = [];
    const left_only: any[] = [];
    const right_only: any[] = [];

    for (const a of left) {
      const k = toKey(a?.[leftKey]);

      if (k !== null) {
        const matches = rightMap.get(k);
        if (matches?.length) {
          for (const ri of matches) {
            full.push({
              ...a,
              ...right[ri],
            });
            rightVisited[ri] = true;
          }
        } else left_only.push({ ...a });
      } else left_only.push({ ...a });
    }

    right.forEach((b, i) => {
      if (!rightVisited[i]) right_only.push({ ...b });
    });

    return { full, left_only, right_only };
  }
}
