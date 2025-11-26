// api.js - VERSÃO SIMPLIFICADA
class ApiService {
    async generateDocument(documentType, formData, userEmail) {
        const payload = {
            documentType: documentType,
            formData: formData,
            userEmail: userEmail
        };

        const response = await fetch(CONFIG.cloudFunctions.generateDocument, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result.data;
    }
}
