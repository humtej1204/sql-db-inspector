import { errorHandler } from "../../../shared/domain/error/error-handler";
import {
  IMySQLDB,
  MySQL,
} from "../../../shared/infraestructure/database/mysql";
import { IEntityMysqlRepository } from "../../domain/entity-mysql-repository";
import { IFindSchemasOptionsParams } from "../../domain/interfaces/repository/find-schemas-options-params.interface";

export class EntityMysqlRepository implements IEntityMysqlRepository {
  private db: IMySQLDB;
  private systemSchemas: string[] = [
    "information_schema",
    "mysql",
    "performance_schema",
    "sys",
  ];

  constructor(private readonly database: MySQL) {
    this.db = this.database.db!;
  }

  get Entity() {
    this.db = this.database.db!;
    return this.db;
  }

  async executeQuery(query?: string): Promise<any> {
    try {
      if (!query) return null;
      const [res] = await this.Entity.query(query);

      return res;
    } catch (error) {
      throw errorHandler(error, { callback: () => this.executeQuery(query) });
    }
  }

  async findSchemas(options?: IFindSchemasOptionsParams): Promise<any> {
    try {
      const includeSystem = Boolean(options?.includeSystem);
      const includeViews = Boolean(options?.includeViews);
      const useGiven =
        Array.isArray(options?.schemas) && options.schemas.length > 0;

      const placeholders = (n: number) =>
        Array.from({ length: n }, () => "?").join(",");

      let schemaWhere = "";
      let schemaParams: string[] = [];
      if (useGiven) {
        schemaWhere = `SCHEMA_NAME IN (${placeholders(
          options.schemas!.length
        )})`;
        schemaParams = options.schemas!;
      } else if (!includeSystem) {
        schemaWhere = `SCHEMA_NAME NOT IN (${placeholders(
          this.systemSchemas.length
        )})`;
        schemaParams = this.systemSchemas;
      } else {
        schemaWhere = "1=1";
      }

      const [schemaRows] = await this.Entity.query(
        `SELECT SCHEMA_NAME AS schema_name
       FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE ${schemaWhere}
       ORDER BY SCHEMA_NAME`,
        schemaParams
      );
      const schemas: string[] = (schemaRows as any[]).map((r) => r.schema_name);
      if (schemas.length === 0) return [];

      const tableTypes = includeViews ? ["BASE TABLE", "VIEW"] : ["BASE TABLE"];
      const tableWhere = `t.TABLE_SCHEMA IN (${placeholders(
        schemas.length
      )}) AND t.TABLE_TYPE IN (${placeholders(tableTypes.length)})`;
      const tableParams = [...schemas, ...tableTypes];

      const [tableRows] = await this.Entity.query(
        `SELECT
          t.TABLE_SCHEMA AS schema_name,
          t.TABLE_NAME   AS table_name,
          t.TABLE_TYPE   AS table_type,
          t.TABLE_ROWS   AS table_rows  -- aprox en InnoDB
       FROM INFORMATION_SCHEMA.TABLES t
       WHERE ${tableWhere}
       ORDER BY t.TABLE_SCHEMA, t.table_name`,
        tableParams
      );

      const [colRows] = await this.Entity.query(
        `SELECT
          c.TABLE_SCHEMA AS schema_name,
          c.TABLE_NAME   AS table_name,
          c.COLUMN_NAME  AS column_name,
          CASE
            WHEN c.DATA_TYPE IN ('varchar','char','varbinary','binary') AND c.CHARACTER_MAXIMUM_LENGTH IS NOT NULL
              THEN CONCAT(c.DATA_TYPE,'(',c.CHARACTER_MAXIMUM_LENGTH,')')
            WHEN c.DATA_TYPE IN ('decimal','numeric')
              THEN CONCAT(c.DATA_TYPE,'(',c.NUMERIC_PRECISION,',',c.NUMERIC_SCALE,')')
            WHEN c.DATA_TYPE IN ('datetime','timestamp','time') AND c.DATETIME_PRECISION IS NOT NULL
              THEN CONCAT(c.DATA_TYPE,'(',c.DATETIME_PRECISION,')')
            WHEN c.DATA_TYPE IN ('float','double') AND c.NUMERIC_PRECISION IS NOT NULL
              THEN CONCAT(c.DATA_TYPE,'(',c.NUMERIC_PRECISION,')')
            ELSE c.DATA_TYPE
          END AS data_type_formatted,
          c.ORDINAL_POSITION
       FROM INFORMATION_SCHEMA.COLUMNS c
       JOIN INFORMATION_SCHEMA.TABLES t
         ON t.TABLE_SCHEMA = c.TABLE_SCHEMA
        AND t.TABLE_NAME   = c.TABLE_NAME
       WHERE ${tableWhere}
       ORDER BY c.TABLE_SCHEMA, c.TABLE_NAME, c.ORDINAL_POSITION`,
        tableParams
      );

      const bySchema = new Map<string, any>();

      for (const s of schemas) bySchema.set(s, { schema: s, tables: [] });

      const tableIndex = new Map<string, any>();

      (tableRows as any[]).forEach((t) => {
        const entry = {
          name: `${t.schema_name}.${t.table_name}`,
          table: t.table_name,
          type: t.table_type as "BASE TABLE" | "VIEW",
          rows: Number(t.table_rows ?? 0),
          fields: [] as Array<{ column: string; type: string }>,
        };
        const bucket = bySchema.get(t.schema_name)!;
        bucket.tables.push(entry);
        tableIndex.set(`${t.schema_name}.${t.table_name}`, entry);
      });

      (colRows as any[]).forEach((c) => {
        const key = `${c.schema_name}.${c.table_name}`;
        const tbl = tableIndex.get(key);
        if (tbl) {
          tbl.fields.push({
            column: c.column_name,
            type: c.data_type_formatted,
          });
        }
      });

      return Array.from(bySchema.values());
    } catch (error) {
      throw errorHandler(error, { callback: () => this.findSchemas(options) });
    }
  }

  async findTablesRelationsBySchemas(schemas?: string[]): Promise<any> {
    try {
      const useGiven = Array.isArray(schemas) && schemas.length > 0;

      const placeholders = (n: number) =>
        Array.from({ length: n }, () => "?").join(",");
      const filterClause = useGiven
        ? `AND t.TABLE_SCHEMA IN (${placeholders(schemas!.length)})`
        : `AND t.TABLE_SCHEMA NOT IN (${placeholders(
            this.systemSchemas.length
          )})`;
      const filterParams = useGiven ? schemas! : this.systemSchemas;

      const targetSubquery = `
      SELECT t.TABLE_SCHEMA, t.TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES t
      WHERE t.TABLE_TYPE = 'BASE TABLE'
        ${filterClause}
      GROUP BY t.TABLE_SCHEMA, t.TABLE_NAME
    `;

      // 1) COLUMNAS (tipo formateado)
      const columnsQuery = `
      SELECT 
        c.TABLE_SCHEMA AS schema_name,
        c.TABLE_NAME   AS table_name,
        c.COLUMN_NAME  AS column_name,
        CASE
          WHEN c.DATA_TYPE IN ('varchar','char','varbinary','binary') AND c.CHARACTER_MAXIMUM_LENGTH IS NOT NULL
            THEN CONCAT(c.DATA_TYPE,'(',c.CHARACTER_MAXIMUM_LENGTH,')')
          WHEN c.DATA_TYPE IN ('decimal','numeric')
            THEN CONCAT(c.DATA_TYPE,'(',c.NUMERIC_PRECISION,',',c.NUMERIC_SCALE,')')
          WHEN c.DATA_TYPE IN ('datetime','timestamp','time') AND c.DATETIME_PRECISION IS NOT NULL
            THEN CONCAT(c.DATA_TYPE,'(',c.DATETIME_PRECISION,')')
          WHEN c.DATA_TYPE IN ('float','double') AND c.NUMERIC_PRECISION IS NOT NULL
            THEN CONCAT(c.DATA_TYPE,'(',c.NUMERIC_PRECISION,')')
          ELSE c.DATA_TYPE
        END AS data_type_formatted,
        c.ORDINAL_POSITION
      FROM INFORMATION_SCHEMA.COLUMNS c
      JOIN (${targetSubquery}) tg
        ON tg.TABLE_SCHEMA = c.TABLE_SCHEMA
       AND tg.TABLE_NAME   = c.TABLE_NAME
      ORDER BY c.TABLE_SCHEMA, c.TABLE_NAME, c.ORDINAL_POSITION
    `;

      // 2) ENTRANTES: otras tablas -> esta (FK en otras, PK/UK aquí)
      const incomingQuery = `
      SELECT
        tg.TABLE_SCHEMA AS base_schema,
        tg.TABLE_NAME   AS base_table,
        k.REFERENCED_COLUMN_NAME AS base_column,  -- PK/UK en la base
        k.TABLE_SCHEMA AS ref_schema,
        k.TABLE_NAME   AS ref_table,
        k.COLUMN_NAME  AS ref_column,             -- FK en la tabla que referencia
        k.CONSTRAINT_NAME AS fk_name
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
      JOIN (${targetSubquery}) tg
        ON k.REFERENCED_TABLE_SCHEMA = tg.TABLE_SCHEMA
       AND k.REFERENCED_TABLE_NAME   = tg.TABLE_NAME
      WHERE k.REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY base_schema, base_table, fk_name, ref_schema, ref_table
    `;

      // 3) SALIENTES: esta -> otras (FK aquí, PK/UK en otras)
      const outgoingQuery = `
      SELECT
        tg.TABLE_SCHEMA AS src_schema,
        tg.TABLE_NAME   AS src_table,
        k.COLUMN_NAME   AS src_column,            -- FK en ESTA tabla
        k.REFERENCED_TABLE_SCHEMA AS ref_schema,
        k.REFERENCED_TABLE_NAME   AS ref_table,
        k.REFERENCED_COLUMN_NAME  AS ref_column,  -- PK/UK en la otra
        k.CONSTRAINT_NAME AS fk_name
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
      JOIN (${targetSubquery}) tg
        ON k.TABLE_SCHEMA = tg.TABLE_SCHEMA
       AND k.TABLE_NAME   = tg.TABLE_NAME
      WHERE k.REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY src_schema, src_table, fk_name, ref_schema, ref_table
    `;

      // 4) Conteo de filas por tabla (aprox en InnoDB)
      const countsQuery = `
      SELECT 
        tg.TABLE_SCHEMA AS schema_name, 
        tg.TABLE_NAME   AS table_name,
        t.TABLE_ROWS    AS row_count
      FROM (${targetSubquery}) tg
      JOIN INFORMATION_SCHEMA.TABLES t
        ON t.TABLE_SCHEMA = tg.TABLE_SCHEMA
       AND t.TABLE_NAME   = tg.TABLE_NAME
      ORDER BY tg.TABLE_SCHEMA, tg.TABLE_NAME
    `;

      const [cols] = await this.Entity.query(columnsQuery, filterParams);
      const [incoming] = await this.Entity.query(incomingQuery, filterParams);
      const [outgoing] = await this.Entity.query(outgoingQuery, filterParams);
      const [counts] = await this.Entity.query(countsQuery, filterParams);

      const map: Record<string, any> = {};

      (cols as any[]).forEach((c) => {
        const key = `${c.schema_name}.${c.table_name}`;
        const entry = (map[key] ??= {
          schema: c.schema_name,
          table: c.table_name,
          name: key,
          rows: 0,
          fields: [],
          relationsIncoming: [],
          relationsOutgoing: [],
        });
        entry.fields.push({
          column: c.column_name,
          type: c.data_type_formatted,
        });
      });

      (incoming as any[]).forEach((r) => {
        const key = `${r.base_schema}.${r.base_table}`;
        const entry = (map[key] ??= {
          schema: r.base_schema,
          table: r.base_table,
          name: key,
          rows: 0,
          fields: [],
          relationsIncoming: [],
          relationsOutgoing: [],
        });
        entry.relationsIncoming.push({
          table: `${r.ref_schema}.${r.ref_table}`,
          foreignKey: r.ref_column, // FK en la otra tabla
          key: r.base_column, // PK/UK aquí
          fkName: r.fk_name,
        });
      });

      (outgoing as any[]).forEach((r) => {
        const key = `${r.src_schema}.${r.src_table}`;
        const entry = (map[key] ??= {
          schema: r.src_schema,
          table: r.src_table,
          name: key,
          rows: 0,
          fields: [],
          relationsIncoming: [],
          relationsOutgoing: [],
        });
        entry.relationsOutgoing.push({
          table: `${r.ref_schema}.${r.ref_table}`,
          foreignKey: r.src_column, // FK aquí
          key: r.ref_column, // PK/UK en la otra
          fkName: r.fk_name,
        });
      });

      (counts as any[]).forEach((r) => {
        const key = `${r.schema_name}.${r.table_name}`;
        const entry = (map[key] ??= {
          schema: r.schema_name,
          table: r.table_name,
          name: key,
          rows: 0,
          fields: [],
          relationsIncoming: [],
          relationsOutgoing: [],
        });
        entry.rows = Number(r.row_count ?? 0);
      });

      const data: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(map).forEach(([_, value]) => {
        const group = (arr: any[]) =>
          Object.entries(
            arr.reduce((acc: any, c: any) => {
              (acc[c.table] ||= []).push({
                key: c.key,
                foreignKey: c.foreignKey,
              });
              return acc;
            }, {})
          ).map(([table, relations]) => ({ table, relations }));

        const relationsIncoming = group(value.relationsIncoming);
        const relationsOutgoing = group(value.relationsOutgoing);

        data.push({ ...value, relationsIncoming, relationsOutgoing });
      });

      return data;
    } catch (error) {
      throw errorHandler(error, {
        callback: () => this.findTablesRelationsBySchemas(schemas),
      });
    }
  }

  async findValueAnywhere(
    value: string,
    opts: {
      schema?: string;
      searchMode?: "contains" | "equals";
      chunkSize?: number;
    } = {}
  ): Promise<any> {
    try {
      const { schema, searchMode = "contains", chunkSize = 200 } = opts;

      // Helpers
      const systemSchemas = [
        "information_schema",
        "mysql",
        "performance_schema",
        "sys",
      ];
      const placeholders = (n: number) =>
        Array.from({ length: n }, () => "?").join(",");
      const escId = (s: string) => this.db.escapeId(s); // usa el escape nativo del driver

      // 1) Metadatos: columnas "buscables"
      const skipTypes = [
        "tinyblob",
        "blob",
        "mediumblob",
        "longblob",
        "binary",
        "varbinary",
        "bit",
        "geometry",
        "point",
        "linestring",
        "polygon",
        "multipoint",
        "multilinestring",
        "multipolygon",
        "geometrycollection",
        "json", // si quieres buscar en JSON, lo tratamos aparte (JSON_SEARCH)
      ];

      const metaWhere = schema
        ? `c.TABLE_SCHEMA = ?`
        : `c.TABLE_SCHEMA NOT IN (${placeholders(systemSchemas.length)})`;

      const metaSql = `
    SELECT
      c.TABLE_SCHEMA AS schema_name,
      c.TABLE_NAME   AS table_name,
      c.COLUMN_NAME  AS column_name,
      LOWER(c.DATA_TYPE) AS data_type
    FROM INFORMATION_SCHEMA.COLUMNS c
    JOIN INFORMATION_SCHEMA.TABLES t
      ON t.TABLE_SCHEMA = c.TABLE_SCHEMA
     AND t.TABLE_NAME   = c.TABLE_NAME
    WHERE t.TABLE_TYPE = 'BASE TABLE'
      AND ${metaWhere}
      AND (c.GENERATION_EXPRESSION IS NULL OR c.GENERATION_EXPRESSION = '')
      AND LOWER(c.DATA_TYPE) NOT IN (${placeholders(skipTypes.length)})
    ORDER BY c.TABLE_SCHEMA, c.TABLE_NAME, c.ORDINAL_POSITION
  `;
      const metaParams = schema
        ? [schema, ...skipTypes]
        : [...systemSchemas, ...skipTypes];
      const [metaRows] = await this.Entity.query(metaSql, metaParams);

      // Clasificadores MySQL
      const TEXT = new Set([
        "char",
        "varchar",
        "tinytext",
        "text",
        "mediumtext",
        "longtext",
        "enum",
        "set",
      ]);
      const NUM = new Set([
        "bigint",
        "int",
        "integer",
        "smallint",
        "mediumint",
        "tinyint",
        "decimal",
        "numeric",
        "float",
        "double",
        "double precision",
        "real",
      ]);
      const DATE = new Set(["date", "datetime", "timestamp", "time", "year"]);

      // 2) Ejecutar en CHUNKS para no reventar el paquete/timeout
      const hits: any[] = [];
      const rows = metaRows as Array<{
        schema_name: string;
        table_name: string;
        column_name: string;
        data_type: string;
      }>;

      for (let i = 0; i < rows.length; i += chunkSize) {
        const batch = rows.slice(i, i + chunkSize);
        const selects: string[] = [];
        const params: any[] = [];

        for (const r of batch) {
          const S = escId(r.schema_name);
          const T = escId(r.table_name);
          const C = escId(r.column_name);

          let predicate = "";
          const predParams: any[] = [];

          if (TEXT.has(r.data_type)) {
            if (searchMode === "equals") {
              predicate = `${C} = ?`;
              predParams.push(value);
            } else {
              predicate = `${C} LIKE ?`;
              predParams.push(`%${value}%`);
            }
          } else if (NUM.has(r.data_type)) {
            if (searchMode === "equals") {
              predicate = `CAST(${C} AS DECIMAL(65,30)) = CAST(? AS DECIMAL(65,30))`;
              predParams.push(value);
            } else {
              predicate = `CAST(${C} AS CHAR) LIKE ?`;
              predParams.push(`%${value}%`);
            }
          } else if (DATE.has(r.data_type)) {
            if (searchMode === "equals") {
              if (r.data_type === "date") {
                predicate = `${C} = CAST(? AS DATE)`;
              } else if (r.data_type === "time") {
                predicate = `${C} = CAST(? AS TIME)`;
              } else if (r.data_type === "year") {
                predicate = `${C} = CAST(? AS UNSIGNED)`;
              } else {
                predicate = `${C} = CAST(? AS DATETIME)`;
              }
              predParams.push(value);
            } else {
              predicate = `CAST(${C} AS CHAR) LIKE ?`;
              predParams.push(`%${value}%`);
            }
          } else {
            if (searchMode === "equals") {
              predicate = `CAST(${C} AS CHAR) = ?`;
              predParams.push(value);
            } else {
              predicate = `CAST(${C} AS CHAR) LIKE ?`;
              predParams.push(`%${value}%`);
            }
          }

          selects.push(
            `SELECT ? AS schema_name, ? AS table_name, ? AS column_name
         FROM DUAL
         WHERE EXISTS (
           SELECT 1 FROM ${S}.${T}
           WHERE ${predicate}
           LIMIT 1
         )`
          );
          params.push(
            r.schema_name,
            r.table_name,
            r.column_name,
            ...predParams
          );
        }

        const sql = selects.join("\nUNION ALL\n");

        const [batchHits] = await this.Entity.query(sql, params);
        hits.push(...(batchHits as any[]));
      }

      // 3) Agrupar por tabla (mismo shape que MSSQL)
      const map: Record<
        string,
        { name: string; schema: string; table: string; columns: string[] }
      > = {};
      for (const row of hits) {
        const key = `${row.schema_name}.${row.table_name}`;
        if (!map[key]) {
          map[key] = {
            name: key,
            schema: row.schema_name,
            table: row.table_name,
            columns: [],
          };
        }
        map[key].columns.push(row.column_name);
      }

      return Object.values(map);
    } catch (error) {
      throw errorHandler(error, {
        callback: () => this.findValueAnywhere(value, opts),
      });
    }
  }
}
