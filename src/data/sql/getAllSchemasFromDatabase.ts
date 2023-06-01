export const getAllSchemasFromDatabaseSQL = 
/* sql */`
SELECT 
    nspname
FROM 
    pg_catalog.pg_namespace;
`;