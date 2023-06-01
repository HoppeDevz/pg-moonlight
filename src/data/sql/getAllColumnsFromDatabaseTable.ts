export const getAllColumnsFromDatabaseTableSQL = 
/* sql */`
SELECT 
    *
FROM 
    information_schema.columns
WHERE 
    table_schema = $1
    AND table_name = $2;
`