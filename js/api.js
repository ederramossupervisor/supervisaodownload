// api.js - VERSÃO FINAL
async generateDocument(documentType, formData, userEmail) {
    const response = await fetch(CONFIG.cloudFunctions.generateDocument, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            documentType: documentType,
            formData: formData,
            userEmail: userEmail
        })
    });
    const result = await response.json();
    return result.data;
}
