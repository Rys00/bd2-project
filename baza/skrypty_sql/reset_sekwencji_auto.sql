DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT
            pg_get_serial_sequence(quote_ident(n.nspname) || '.' || quote_ident(c.relname), a.attname) AS seq,
            quote_ident(n.nspname) || '.' || quote_ident(c.relname) AS tbl,
            quote_ident(a.attname) AS col
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        JOIN pg_attribute a ON a.attrelid = c.oid
        WHERE c.relkind = 'r'
          AND a.attnum > 0
          AND NOT a.attisdropped
          AND pg_get_serial_sequence(quote_ident(n.nspname) || '.' || quote_ident(c.relname), a.attname) IS NOT NULL
    LOOP
        EXECUTE format('SELECT setval(%L, COALESCE(MAX(%s), 0) + 1, false) FROM %s;',
                       rec.seq, rec.col, rec.tbl);
    END LOOP;
END$$;