SELECT 
    TABLE_NAME AS 'Table Name', TABLE_ROWS AS 'Number of Rows'
FROM
    information_schema.TABLES
WHERE
    TABLE_SCHEMA = 'newssps';