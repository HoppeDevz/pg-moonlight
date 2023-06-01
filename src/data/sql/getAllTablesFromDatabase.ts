export const getAllTablesFromDatabaseSQL = 
/* sql */`
SELECT 
    tablename
FROM 
    pg_catalog.pg_tables
WHERE 
    schemaname = $1;
`;