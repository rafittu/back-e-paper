#!/bin/sh
echo "Executando as migrações no banco de dados..."
npm run migrate

echo "Iniciando o servidor..."
npm run start:prod
