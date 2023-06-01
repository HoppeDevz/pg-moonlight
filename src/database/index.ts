import { Pool } from "pg";

import moonlightSettings from "../settings/moonlight.settings.json";

import { getAllTablesFromDatabaseSQL } from "../data/sql/getAllTablesFromDatabase";
import { getAllColumnsFromDatabaseTableSQL } from "../data/sql/getAllColumnsFromDatabaseTable";

import type { ColumnInformation, Database } from "../@types";
import { getAllSchemasFromDatabaseSQL } from "../data/sql/getAllSchemasFromDatabase";

const referentialPool = new Pool({
    host: moonlightSettings["referential-db"].host,
    database: moonlightSettings["referential-db"].database,
    user: moonlightSettings["referential-db"].user,
    password: moonlightSettings["referential-db"].password,
});
const targetPool = new Pool({
    host: moonlightSettings["target-db"].host,
    database: moonlightSettings["target-db"].database,
    user: moonlightSettings["target-db"].user,
    password: moonlightSettings["target-db"].password,
});

export const getDatabasePool = (database: Database) => {

    if (database === "referential") return referentialPool;

    return targetPool;
}

export const getAllSchemasFromDatabase = async (database: Database) => {

    const pool = getDatabasePool(database);

    try {

        const {rows} = await pool.query<{ nspname: string }>(getAllSchemasFromDatabaseSQL, []);

        return rows;

    } catch(err) {

        throw err;
    }
}

export const getAllTablesFromDatabase = async (database: Database, schema: string) => {

    const pool = getDatabasePool(database);

    try {

        const {rows} = await pool.query<{ tablename: string }>(getAllTablesFromDatabaseSQL, [schema]);

        return rows;

    } catch(err) {

        throw err;
    }
}

export const getAllColumnsFromDatabaseTable = async (database: Database, schema: string, tableName: string) => {

    const pool = getDatabasePool(database);

    try {

        const {rows} = await pool.query<ColumnInformation>(getAllColumnsFromDatabaseTableSQL, [schema, tableName]);

        return rows;

    } catch(err) {

        throw err;
    }
}

export const runMoonlight = async () => {

    try {

        console.log(`[PG-MOONLIGHT] - Starting...`);

        let totalErrors = 0;
        let totalWarnings = 0;

        const allReferentialSchemas = await getAllSchemasFromDatabase("referential");
        const allTargetSchemas = await getAllSchemasFromDatabase("target");

        for (const {nspname: schemaName} of allReferentialSchemas) {

            const targetHasSchema = allTargetSchemas.find(schema => schema.nspname === schemaName);
            
            if (!targetHasSchema) {

                console.log(`[ERROR] - The target database is missing a schema: ${schemaName}`);
                totalErrors++;
                continue;
            }

            const allReferentialTables = await getAllTablesFromDatabase("referential", schemaName);
            const allTargetTables = await getAllTablesFromDatabase("target", schemaName);

            for (const { tablename } of allReferentialTables) {

                const targetHasTable = allTargetTables.find(table => table.tablename === tablename);

                if (!targetHasTable) {

                    console.log(`[ERROR] - The target database is missing a table: ${schemaName} -> ${tablename}`);
                    totalErrors++;
                    continue;
                }

                const allReferentialColumns = await getAllColumnsFromDatabaseTable("referential", schemaName, tablename);
                const allTargetColumns = await getAllColumnsFromDatabaseTable("target", schemaName, tablename);

                for (const { column_name } of allReferentialColumns) {

                    const targetHasColumn = allTargetColumns.find(column => column.column_name === column_name);

                    if (!targetHasColumn) {

                        console.log(`[ERROR] - The target database is missing a column: ${schemaName} -> ${tablename} -> ${column_name}`);
                        totalErrors++;
                        continue;
                    }
                }
            }
        }

        console.log(`[PG-MOONLIGHT] - Errors: ${totalErrors} | Warnings: ${totalWarnings}`);

    } catch(err) {

        throw err;
    }
} 
