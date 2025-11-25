
### 🔧 Configuração do Google Apps Script

1. **Acesse o Google Apps Script**:
   - Vá para [script.google.com](https://script.google.com)
   - Crie um novo projeto

2. **Cole o código do Apps Script**:
   - Substitua todo o conteúdo pelo código fornecido

3. **Configure o Web App**:
   - Vá em "Publicar" → "Implementar como aplicativo web"
   - **Executar como**: Eu
   - **Quem tem acesso**: Qualquer pessoa
   - Copie a URL gerada

4. **Atualize a URL no arquivo `config.js`**:
   ```javascript
   const CONFIG = {
     webAppUrl: 'SUA_URL_DO_WEB_APP_AQUI',
     // ... resto do código
   };