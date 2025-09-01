import { IRecordSet, NVarChar } from "mssql";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { ISQLServerDB } from "../../../shared/infraestructure/database/sql-server";
import { IEntitySqlServerRepository } from "../../domain/entity-sql-server-repository";

export class EntitySqlServerRepository implements IEntitySqlServerRepository {
  constructor(private readonly db: ISQLServerDB) {}

  async findAllTables(): Promise<any> {
    try {
      const res = await this.db.request().query(`
      SELECT
        s.name  AS schema_name,
        t.name  AS table_name,
        SUM(CASE WHEN p.index_id IN (0,1) THEN p.rows ELSE 0 END) AS row_count
      FROM sys.tables t
      JOIN sys.schemas s   ON s.schema_id = t.schema_id
      JOIN sys.partitions p ON p.object_id = t.object_id
      WHERE t.is_ms_shipped = 0        -- opcional: excluye tablas del sistema
      GROUP BY s.name, t.name
      ORDER BY s.name, t.name;
    `);

      return res.recordset.map((r) => ({
        schema: r.schema_name,
        table: r.table_name,
        name: `${r.schema_name}.${r.table_name}`,
        rows: Number(r.row_count),
      }));
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findBaseTables(): Promise<any> {
    try {
      const query = `
      IF OBJECT_ID('tempdb..#base_tables') IS NOT NULL DROP TABLE #base_tables;
      CREATE TABLE #base_tables (
        object_id   INT        NOT NULL,
        schema_name SYSNAME    NOT NULL,
        table_name  SYSNAME    NOT NULL
      );

      INSERT INTO #base_tables(object_id, schema_name, table_name)
      SELECT t.object_id, s.name, t.name
      FROM sys.tables t
      JOIN sys.schemas s ON s.schema_id = t.schema_id
      WHERE NOT EXISTS (
        SELECT 1
        FROM sys.foreign_keys fk
        WHERE fk.parent_object_id = t.object_id  -- SIN FKs salientes
      );

      -- 1) Columnas de cada tabla base (con tipo formateado)
      SELECT 
        bt.schema_name, 
        bt.table_name, 
        c.name AS column_name,
        CASE 
          WHEN ty.name IN ('varchar','char') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('nvarchar','nchar') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length/2 AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('varbinary','binary') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('decimal','numeric') 
            THEN ty.name + '(' + CAST(c.precision AS VARCHAR(10)) + ',' + CAST(c.scale AS VARCHAR(10)) + ')'
          WHEN ty.name IN ('datetime2','datetimeoffset','time') 
            THEN ty.name + '(' + CAST(c.scale AS VARCHAR(10)) + ')'
          WHEN ty.name = 'float'
            THEN ty.name + CASE WHEN c.precision > 0 THEN '(' + CAST(c.precision AS VARCHAR(10)) + ')' ELSE '' END
          ELSE ty.name
        END AS data_type_formatted
      FROM #base_tables bt
      JOIN sys.columns c ON c.object_id = bt.object_id
      JOIN sys.types   ty ON ty.user_type_id = c.user_type_id
      ORDER BY bt.schema_name, bt.table_name, c.column_id;

      -- 2) Relaciones ENTRANTES: tablas que referencian a la base
      SELECT
        bt.schema_name      AS base_schema,
        bt.table_name       AS base_table,
        rc.name             AS base_column,    -- columna referenciada en la base (PK/UK)
        s2.name             AS ref_schema,
        t2.name             AS ref_table,
        pc.name             AS ref_column,     -- columna FK en la tabla que referencia
        fk.name             AS fk_name
      FROM #base_tables bt
      JOIN sys.foreign_key_columns fkc
        ON fkc.referenced_object_id = bt.object_id
      JOIN sys.columns rc
        ON rc.object_id = fkc.referenced_object_id
      AND rc.column_id  = fkc.referenced_column_id
      JOIN sys.tables t2
        ON t2.object_id = fkc.parent_object_id
      JOIN sys.schemas s2
        ON s2.schema_id = t2.schema_id
      JOIN sys.columns pc
        ON pc.object_id = fkc.parent_object_id
      AND pc.column_id  = fkc.parent_column_id
      JOIN sys.foreign_keys fk
        ON fk.object_id = fkc.constraint_object_id
      ORDER BY base_schema, base_table, ref_schema, ref_table, fk_name;

      -- 3) Conteo de filas por tabla base
      SELECT 
        bt.schema_name, 
        bt.table_name,
        SUM(CASE WHEN p.index_id IN (0,1) THEN p.rows ELSE 0 END) AS row_count
      FROM #base_tables bt
      JOIN sys.partitions p ON p.object_id = bt.object_id
      GROUP BY bt.schema_name, bt.table_name
      ORDER BY bt.schema_name, bt.table_name;
      `;
      const res = await this.db.request().query(query);
      const sets: IRecordSet<any>[] = Array.isArray(res.recordsets)
        ? res.recordsets
        : Object.values(res.recordsets);

      const [cols, rels, counts] = sets;

      const graph: Record<
        string,
        {
          schema: string;
          table: string;
          name: string;
          rows: number;
          fields: Array<{ column: string; type: string }>;
          relations: Array<{ table: string; foreignKey: string; key: string }>;
        }
      > = {};

      // Campos (con tipo)
      cols.forEach((row) => {
        const key = `${row.schema_name}.${row.table_name}`;
        if (!graph[key])
          graph[key] = {
            schema: row.schema_name,
            table: row.table_name,
            name: key,
            rows: 0,
            fields: [],
            relations: [],
          };
        graph[key].fields.push({
          column: row.column_name,
          type: row.data_type_formatted,
        });
      });

      // Relaciones entrantes
      rels.forEach((r) => {
        const baseKey = `${r.base_schema}.${r.base_table}`;
        if (!graph[baseKey])
          graph[baseKey] = {
            schema: r.schema_name,
            table: r.table_name,
            name: baseKey,
            rows: 0,
            fields: [],
            relations: [],
          };
        graph[baseKey].relations.push({
          table: `${r.ref_schema}.${r.ref_table}`,
          foreignKey: r.ref_column, // columna en la tabla que referencia
          key: r.base_column, // columna en la tabla base
        });
      });

      counts.forEach((r) => {
        const key = `${r.schema_name}.${r.table_name}`;
        if (!graph[key])
          graph[key] = {
            schema: r.schema_name,
            table: r.table_name,
            name: key,
            rows: 0,
            fields: [],
            relations: [],
          };
        graph[key].rows = Number(r.row_count ?? 0);
      });

      const data: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(graph).forEach(([_key, value]) => {
        const relationsGrouped = value.relations.reduce((acc: any, c) => {
          if (!acc[c.table]) acc[c.table] = [];
          acc[c.table].push({ key: c.key, foreignKey: c.foreignKey });
          return acc;
        }, {});
        const relations = Object.entries(relationsGrouped).map(
          ([key, value]) => ({
            table: key,
            relations: value,
          })
        );
        data.push({
          ...value,
          relations,
        });
      });

      return data;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findTablesRelations(): Promise<any> {
    try {
      const query = `
      IF OBJECT_ID('tempdb..#target') IS NOT NULL DROP TABLE #target;
      CREATE TABLE #target(
        object_id   INT       NOT NULL,
        schema_name SYSNAME   NOT NULL,
        table_name  SYSNAME   NOT NULL
      );

      -- Todas las tablas de usuario (excluye objetos de sistema)
      INSERT INTO #target(object_id, schema_name, table_name)
      SELECT t.object_id, s.name, t.name
      FROM sys.tables t
      JOIN sys.schemas s ON s.schema_id = t.schema_id
      WHERE t.is_ms_shipped = 0;

      IF NOT EXISTS (SELECT 1 FROM #target)
      BEGIN
        RAISERROR('No user tables found in this database',16,1);
      END

      -- 1) COLUMNAS (todas las tablas de #target)
      SELECT 
        tg.schema_name, 
        tg.table_name, 
        c.name AS column_name,
        CASE 
          WHEN ty.name IN ('varchar','char') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('nvarchar','nchar') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length/2 AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('varbinary','binary') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('decimal','numeric') 
            THEN ty.name + '(' + CAST(c.precision AS VARCHAR(10)) + ',' + CAST(c.scale AS VARCHAR(10)) + ')'
          WHEN ty.name IN ('datetime2','datetimeoffset','time') 
            THEN ty.name + '(' + CAST(c.scale AS VARCHAR(10)) + ')'
          WHEN ty.name = 'float'
            THEN ty.name + CASE WHEN c.precision > 0 THEN '(' + CAST(c.precision AS VARCHAR(10)) + ')' ELSE '' END
          ELSE ty.name
        END AS data_type_formatted
      FROM #target tg
      JOIN sys.columns c ON c.object_id = tg.object_id
      JOIN sys.types   ty ON ty.user_type_id = c.user_type_id
      ORDER BY tg.schema_name, tg.table_name, c.column_id;

      -- 2) ENTRANTES: otras tablas -> esta (FK en otras, PK/UK aquí)
      SELECT
        tg.schema_name AS base_schema,
        tg.table_name  AS base_table,
        rc.name        AS base_column,
        s2.name        AS ref_schema,
        t2.name        AS ref_table,
        pc.name        AS ref_column,
        fk.name        AS fk_name
      FROM #target tg
      JOIN sys.foreign_key_columns fkc
        ON fkc.referenced_object_id = tg.object_id
      JOIN sys.columns rc
        ON rc.object_id = fkc.referenced_object_id
       AND rc.column_id  = fkc.referenced_column_id
      JOIN sys.tables t2
        ON t2.object_id = fkc.parent_object_id
      JOIN sys.schemas s2
        ON s2.schema_id = t2.schema_id
      JOIN sys.columns pc
        ON pc.object_id = fkc.parent_object_id
       AND pc.column_id  = fkc.parent_column_id
      JOIN sys.foreign_keys fk
        ON fk.object_id = fkc.constraint_object_id
      ORDER BY base_schema, base_table, fk_name;

      -- 3) SALIENTES: esta -> otras (FK aquí, PK/UK en otras)
      SELECT
        s1.name AS src_schema,
        t1.name AS src_table,
        pc.name AS src_column,
        s2.name AS ref_schema,
        t2.name AS ref_table,
        rc.name AS ref_column,
        fk.name AS fk_name
      FROM #target tg
      JOIN sys.foreign_key_columns fkc
        ON fkc.parent_object_id = tg.object_id
      JOIN sys.tables t1
        ON t1.object_id = fkc.parent_object_id
      JOIN sys.schemas s1
        ON s1.schema_id = t1.schema_id
      JOIN sys.columns pc
        ON pc.object_id = fkc.parent_object_id
       AND pc.column_id  = fkc.parent_column_id
      JOIN sys.tables t2
        ON t2.object_id = fkc.referenced_object_id
      JOIN sys.schemas s2
        ON s2.schema_id = t2.schema_id
      JOIN sys.columns rc
        ON rc.object_id = fkc.referenced_object_id
       AND rc.column_id = fkc.referenced_column_id
      JOIN sys.foreign_keys fk
        ON fk.object_id = fkc.constraint_object_id
      ORDER BY src_schema, src_table, fk_name;

      -- 4) Conteo de filas por tabla base
      SELECT 
        bt.schema_name, 
        bt.table_name,
        SUM(CASE WHEN p.index_id IN (0,1) THEN p.rows ELSE 0 END) AS row_count
      FROM #target bt
      JOIN sys.partitions p ON p.object_id = bt.object_id
      GROUP BY bt.schema_name, bt.table_name
      ORDER BY bt.schema_name, bt.table_name;
    `;
      const res = await this.db.request().query(query);
      const sets: IRecordSet<any>[] = Array.isArray(res.recordsets)
        ? res.recordsets
        : Object.values(res.recordsets);

      const [cols, incoming, outgoing, counts] = sets;
      const map: Record<
        string,
        {
          schema: string;
          table: string;
          name: string;
          rows: number;
          fields: Array<{ column: string; type: string }>;
          relationsIncoming: Array<{
            table: string;
            foreignKey: string;
            key: string;
            fkName: string; // nombre de la restricción de Foreign Key
          }>;
          relationsOutgoing: Array<{
            table: string;
            foreignKey: string;
            key: string;
            fkName: string; // nombre de la restricción de Foreign Key
          }>;
        }
      > = {};

      // Columnas (incluye tablas sin FKs)
      cols.forEach((c) => {
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

      // ENTRANTES: otras tablas -> esta
      incoming.forEach((r) => {
        const key = `${r.base_schema}.${r.base_table}`;
        const entry = (map[key] ??= {
          schema: r.schema_name,
          table: r.table_name,
          name: key,
          rows: 0,
          fields: [],
          relationsIncoming: [],
          relationsOutgoing: [],
        });
        entry.relationsIncoming.push({
          table: `${r.ref_schema}.${r.ref_table}`,
          foreignKey: r.ref_column, // FK en la otra tabla
          key: r.base_column, // PK/UK en ESTA tabla
          fkName: r.fk_name,
        });
      });

      // SALIENTES: esta -> otras
      outgoing.forEach((r) => {
        const key = `${r.src_schema}.${r.src_table}`;
        const entry = (map[key] ??= {
          schema: r.schema_name,
          table: r.table_name,
          name: key,
          rows: 0,
          fields: [],
          relationsIncoming: [],
          relationsOutgoing: [],
        });
        entry.relationsOutgoing.push({
          table: `${r.ref_schema}.${r.ref_table}`,
          foreignKey: r.src_column, // FK en ESTA tabla
          key: r.ref_column, // PK/UK en la otra
          fkName: r.fk_name,
        });
      });

      // Conteo de filas
      counts.forEach((r) => {
        const key = `${r.schema_name}.${r.table_name}`;
        if (!map[key])
          map[key] = {
            schema: r.schema_name,
            table: r.table_name,
            name: key,
            rows: 0,
            fields: [],
            relationsIncoming: [],
            relationsOutgoing: [],
          };
        map[key].rows = Number(r.row_count ?? 0);
      });

      const data: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(map).forEach(([_key, value]) => {
        const relationsIncomingGrouped = value.relationsIncoming.reduce(
          (acc: any, c) => {
            if (!acc[c.table]) acc[c.table] = [];
            acc[c.table].push({ key: c.key, foreignKey: c.foreignKey });
            return acc;
          },
          {}
        );
        const relationsIncoming = Object.entries(relationsIncomingGrouped).map(
          ([key, value]) => ({
            table: key,
            relations: value,
          })
        );
        const relationsOutgoingGrouped = value.relationsOutgoing.reduce(
          (acc: any, c) => {
            if (!acc[c.table]) acc[c.table] = [];
            acc[c.table].push({ key: c.key, foreignKey: c.foreignKey });
            return acc;
          },
          {}
        );
        const relationsOutgoing = Object.entries(relationsOutgoingGrouped).map(
          ([key, value]) => ({
            table: key,
            relations: value,
          })
        );
        data.push({
          ...value,
          relationsIncoming,
          relationsOutgoing,
        });
      });

      return data;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findTableRelationsByName(
    table: string,
    schema: string = "dbo"
  ): Promise<any> {
    try {
      if (!table) throw new Error("Debes especificar { table }");

      const query = `
      IF OBJECT_ID('tempdb..#target') IS NOT NULL DROP TABLE #target;
      CREATE TABLE #target(
        object_id   INT       NOT NULL,
        schema_name SYSNAME   NOT NULL,
        table_name  SYSNAME   NOT NULL
      );

      INSERT INTO #target(object_id, schema_name, table_name)
      SELECT TOP(1) t.object_id, s.name, t.name
      FROM sys.tables t
      JOIN sys.schemas s ON s.schema_id = t.schema_id
      WHERE t.name = @table AND s.name = @schema;

      IF NOT EXISTS (SELECT 1 FROM #target)
      BEGIN
        RAISERROR('Table %s.%s not found',16,1,@schema,@table);
      END

      -- 1) Columnas de la tabla objetivo (con tipo formateado)
      SELECT 
        tg.schema_name, 
        tg.table_name, 
        c.name AS column_name,
        -- Tipo formateado: varchar(100), nvarchar(max), decimal(18,2), time(7), etc.
        CASE 
          WHEN ty.name IN ('varchar','char') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('nvarchar','nchar') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length/2 AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('varbinary','binary') 
            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length AS VARCHAR(10)) END + ')'
          WHEN ty.name IN ('decimal','numeric') 
            THEN ty.name + '(' + CAST(c.precision AS VARCHAR(10)) + ',' + CAST(c.scale AS VARCHAR(10)) + ')'
          WHEN ty.name IN ('datetime2','datetimeoffset','time') 
            THEN ty.name + '(' + CAST(c.scale AS VARCHAR(10)) + ')'
          WHEN ty.name = 'float'
            THEN ty.name + CASE WHEN c.precision > 0 THEN '(' + CAST(c.precision AS VARCHAR(10)) + ')' ELSE '' END
          ELSE ty.name
        END AS data_type_formatted
      FROM #target tg
      JOIN sys.columns c ON c.object_id = tg.object_id
      JOIN sys.types   ty ON ty.user_type_id = c.user_type_id
      ORDER BY c.column_id;

      -- 2) ENTRANTES: otras tablas -> esta tabla (FK en otras, PK/UK aquí)
      SELECT
        tg.schema_name AS base_schema,
        tg.table_name  AS base_table,
        rc.name        AS base_column,   -- columna referenciada en la tabla objetivo
        s2.name        AS ref_schema,
        t2.name        AS ref_table,
        pc.name        AS ref_column,    -- columna FK en la tabla que referencia
        fk.name        AS fk_name
      FROM #target tg
      JOIN sys.foreign_key_columns fkc
        ON fkc.referenced_object_id = tg.object_id
      JOIN sys.columns rc
        ON rc.object_id = fkc.referenced_object_id
      AND rc.column_id  = fkc.referenced_column_id
      JOIN sys.tables t2
        ON t2.object_id = fkc.parent_object_id
      JOIN sys.schemas s2
        ON s2.schema_id = t2.schema_id
      JOIN sys.columns pc
        ON pc.object_id = fkc.parent_object_id
      AND pc.column_id  = fkc.parent_column_id
      JOIN sys.foreign_keys fk
        ON fk.object_id = fkc.constraint_object_id
      ORDER BY ref_schema, ref_table, fk_name;

      -- 3) SALIENTES: esta tabla -> otras tablas (FK aquí, PK/UK en otras)
      SELECT
        s1.name AS src_schema,
        t1.name AS src_table,
        pc.name AS src_column,    -- columna FK en la tabla objetivo
        s2.name AS ref_schema,
        t2.name AS ref_table,
        rc.name AS ref_column,    -- columna referenciada en la otra tabla
        fk.name AS fk_name
      FROM #target tg
      JOIN sys.foreign_key_columns fkc
        ON fkc.parent_object_id = tg.object_id
      JOIN sys.tables t1
        ON t1.object_id = fkc.parent_object_id
      JOIN sys.schemas s1
        ON s1.schema_id = t1.schema_id
      JOIN sys.columns pc
        ON pc.object_id = fkc.parent_object_id
      AND pc.column_id  = fkc.parent_column_id
      JOIN sys.tables t2
        ON t2.object_id = fkc.referenced_object_id
      JOIN sys.schemas s2
        ON s2.schema_id = t2.schema_id
      JOIN sys.columns rc
        ON rc.object_id = fkc.referenced_object_id
      AND rc.column_id  = fkc.referenced_column_id
      JOIN sys.foreign_keys fk
        ON fk.object_id = fkc.constraint_object_id
      ORDER BY ref_schema, ref_table, fk_name;

      -- 4) Conteo de filas de la tabla objetivo
      SELECT 
        tg.schema_name, 
        tg.table_name,
        SUM(CASE WHEN p.index_id IN (0,1) THEN p.rows ELSE 0 END) AS row_count
      FROM #target tg
      JOIN sys.partitions p ON p.object_id = tg.object_id
      GROUP BY tg.schema_name, tg.table_name;
      `;
      const req = this.db.request();
      req.input("schema", NVarChar, schema);
      req.input("table", NVarChar, table);
      const res = await req.query(query);

      const sets: IRecordSet<any>[] = Array.isArray(res.recordsets)
        ? res.recordsets
        : Object.values(res.recordsets);
      const [cols, incoming, outgoing, counts] = sets;

      const objKey = `${cols?.[0]?.schema_name ?? schema}.${
        cols?.[0]?.table_name ?? table
      }`;
      let data: any = {
        schema: cols?.[0]?.schema_name ?? schema,
        table: cols?.[0]?.table_name ?? table,
        name: objKey,
        rows: Number(counts?.[0]?.row_count ?? 0),
        fields: [],
        relationsIncoming: [],
        relationsOutgoing: [],
      };

      // fields: [{ column, type }]
      cols.forEach((c) => {
        data.fields.push({
          column: c.column_name,
          type: c.data_type_formatted,
        });
      });

      // ENTRANTES: otra tabla (table) tiene FK -> esta (key)
      incoming.forEach((r) => {
        data.relationsIncoming.push({
          table: `${r.ref_schema}.${r.ref_table}`,
          foreignKey: r.ref_column, // columna en la otra tabla
          key: r.base_column, // columna en ESTA tabla
        });
      });

      // SALIENTES: ESTA tabla tiene FK -> otra (key)
      outgoing.forEach((r) => {
        data.relationsOutgoing.push({
          table: `${r.ref_schema}.${r.ref_table}`,
          foreignKey: r.src_column, // columna en ESTA tabla
          key: r.ref_column, // columna en la otra tabla
        });
      });

      const relationsIncomingGrouped = data.relationsIncoming.reduce(
        (acc: any, c: any) => {
          if (!acc[c.table]) acc[c.table] = [];
          acc[c.table].push({ key: c.key, foreignKey: c.foreignKey });
          return acc;
        },
        {}
      );
      const relationsIncoming = Object.entries(relationsIncomingGrouped).map(
        ([key, value]) => ({
          table: key,
          relations: value,
        })
      );
      const relationsOutgoingGrouped = data.relationsOutgoing.reduce(
        (acc: any, c: any) => {
          if (!acc[c.table]) acc[c.table] = [];
          acc[c.table].push({ key: c.key, foreignKey: c.foreignKey });
          return acc;
        },
        {}
      );
      const relationsOutgoing = Object.entries(relationsOutgoingGrouped).map(
        ([key, value]) => ({
          table: key,
          relations: value,
        })
      );
      data = {
        ...data,
        relationsIncoming,
        relationsOutgoing,
      };

      return data;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findValueAnywhere(
    value: string,
    opts: { schema?: string; searchMode?: "contains" | "equals" } = {}
  ): Promise<any> {
    try {
      const { schema, searchMode = "contains" } = opts;

      // 1) Metadatos de columnas buscables
      const metaSql = `
        SELECT s.name  AS schema_name,
              t.name  AS table_name,
              c.name  AS column_name,
              ty.name AS data_type
        FROM sys.tables t
        JOIN sys.schemas s ON s.schema_id = t.schema_id
        JOIN sys.columns c ON c.object_id = t.object_id
        JOIN sys.types ty  ON ty.user_type_id = c.user_type_id AND ty.system_type_id = c.system_type_id
        WHERE t.is_ms_shipped = 0
          AND c.is_computed = 0
          ${schema ? "AND s.name = @schema" : ""}
          AND ty.name NOT IN (
            'timestamp','rowversion','image','sql_variant','xml','geography','geometry','hierarchyid',
            'cursor','table','varbinary','binary'
          )
        ORDER BY s.name, t.name, c.column_id;
      `;

      const metaReq = this.db.request();
      if (schema) metaReq.input("schema", NVarChar, schema);
      const metaRes = await metaReq.query(metaSql);

      // Clasificadores de tipo
      const TEXT = new Set([
        "char",
        "varchar",
        "nchar",
        "nvarchar",
        "text",
        "ntext",
      ]);
      const NUM = new Set([
        "bigint",
        "int",
        "smallint",
        "tinyint",
        "bit",
        "decimal",
        "numeric",
        "money",
        "smallmoney",
        "float",
        "real",
      ]);
      const DATE = new Set([
        "date",
        "datetime",
        "smalldatetime",
        "datetime2",
        "datetimeoffset",
        "time",
      ]);
      const GUID = new Set(["uniqueidentifier"]);

      // 2) Armamos T-SQL dinámico que verifica columna por columna
      const pieces: string[] = [];
      for (const r of metaRes.recordset as Array<{
        schema_name: string;
        table_name: string;
        column_name: string;
        data_type: string;
      }>) {
        const S = `[${r.schema_name}]`;
        const T = `[${r.table_name}]`;
        const C = `[${r.column_name}]`;

        let predicate: string;
        if (TEXT.has(r.data_type)) {
          predicate =
            searchMode === "equals"
              ? `TRY_CONVERT(nvarchar(max), ${C}) = @v`
              : `TRY_CONVERT(nvarchar(max), ${C}) LIKE @like`;
        } else if (NUM.has(r.data_type)) {
          predicate = `TRY_CONVERT(decimal(38,10), ${C}) = TRY_CONVERT(decimal(38,10), @v)`;
        } else if (DATE.has(r.data_type)) {
          predicate = `TRY_CONVERT(datetime2(7), ${C}) = TRY_CONVERT(datetime2(7), @v)`;
        } else if (GUID.has(r.data_type)) {
          predicate = `TRY_CONVERT(uniqueidentifier, ${C}) = TRY_CONVERT(uniqueidentifier, @v)`;
        } else {
          // Fallback: tratar como texto
          predicate = `TRY_CONVERT(nvarchar(max), ${C}) LIKE @like`;
        }

        pieces.push(`
          IF EXISTS (SELECT 1 FROM ${S}.${T} WITH (NOLOCK) WHERE ${predicate})
            INSERT INTO #found(schema_name, table_name, column_name)
            VALUES (N'${r.schema_name}', N'${r.table_name}', N'${r.column_name}');
        `);
      }

      const batch = `
        DECLARE @v    nvarchar(4000) = @p_value;
        DECLARE @like nvarchar(4000) = N'%' + @v + N'%';

        IF OBJECT_ID('tempdb..#found') IS NOT NULL DROP TABLE #found;
        CREATE TABLE #found(
          schema_name sysname,
          table_name  sysname,
          column_name sysname
        );

        ${pieces.join("\n")}

        SELECT schema_name, table_name, column_name
        FROM #found
        ORDER BY schema_name, table_name, column_name;
      `;

      const run = this.db.request();
      run.input("p_value", NVarChar, value);
      const res = await run.query(batch);

      // 3) Resultado agrupado por tabla
      const map: Record<string, any> = {};
      res.recordset.forEach((row) => {
        const key = `${row.schema_name}.${row.table_name}`;

        if (!map[key])
          map[key] = {
            name: `${row.schema_name}.${row.table_name}`,
            schema: row.schema_name,
            table: row.table_name,
            columns: [],
          };
        map[key].columns.push(row.column_name);
      });

      const data: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(map).forEach(([_key, value]) => {
        data.push(value);
      });

      return data;
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
