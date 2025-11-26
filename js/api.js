// api.js - VERSÃO SIMPLIFICADA COM CLOUD FUNCTIONS
class ApiService {
    constructor() {
        this.isDevelopment = false;
        console.log('🌐 API Service - Modo Cloud Functions');
    }

    async generateDocument(documentType, formData, userEmail) {
        const payload = {
            documentType: documentType,
            formData: formData,
            userEmail: userEmail
        };

        try {
            console.log('🚀 Enviando para Cloud Function...');
            
            const response = await fetch(CONFIG.cloudFunctions.generateDocument, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                return result.data; // ✅ Dados do Apps Script
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('❌ Erro na Cloud Function:', error);
            throw error;
        }
    }

    // ✅ MESMA LÓGICA PARA OUTRAS FUNÇÕES
    async requestAccess(accessData) {
        const response = await fetch(CONFIG.cloudFunctions.requestAccess, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accessData)
        });
        return await response.json();
    }
}
