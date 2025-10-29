CREATE POLICY "Insert para Anonimos"
ON "PlanoDeAula"
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Insert para Autenticados"
ON "PlanoDeAula"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Insert para Publico"
ON "PlanoDeAula"
FOR INSERT
TO public
WITH CHECK (true);