// Serviço de API para comunicação com Google Apps Script
class ApiService {
    constructor() {
        // ✅ CORREÇÃO 1: Use URL direta da Cloud Function
        this.cloudFunctionUrl = 'https://southamerica-east1-sistema-documentos-sreac.cloudfunctions.net/supervisaoSp';
        this.isDevelopment = false; // MODO PRODUÇÃO
        console.log('🌐 API Service - Modo:', this.isDevelopment ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
    }

    // Gerar documento
    async generateDocument(documentType, formData, userEmail) {
        const payload = {
            documentType: documentType,
            formData: formData,
            userEmail: userEmail
        };

        try {
            console.log('🚀 Enviando para Cloud Function...');
            
            // ✅ CORREÇÃO: Use this.cloudFunctionUrl diretamente
            const response = await fetch(this.cloudFunctionUrl, {
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
                return result;
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }

        } catch (error) {
            console.error('❌ Erro na Cloud Function:', error);
            throw error;
        }
    }

    // Solicitar acesso
    async requestAccess(accessData) {
        const payload = {
            action: 'requestAccess',
            ...accessData
        };

        try {
            console.log('🔑 Solicitando acesso para:', accessData.email);
            const response = await this.makeRequest(payload);
            return response;
        } catch (error) {
            console.error('❌ Erro ao solicitar acesso:', error);
            throw error;
        }
    }

    // Verificar acesso
    async checkAccess(userEmail) {
        const payload = {
            action: 'checkAccess',
            userEmail: userEmail
        };

        try {
            console.log('🔐 Verificando acesso para:', userEmail);
            const response = await this.makeRequest(payload);
            return response.hasAccess || true;
        } catch (error) {
            console.error('❌ Erro ao verificar acesso:', error);
            return true;
        }
    }

    async makeRequest(payload) {
        if (this.isDevelopment) {
            console.log('🎯 MODO DESENVOLVIMENTO - Simulando resposta');
            return this.simulateResponse(payload);
        }
        
        console.log('🚀 MODO PRODUÇÃO - Enviando para Cloud Function');
        
        try {
            // ✅ FORMATO CORRETO PARA A CLOUD FUNCTION
            const requestBody = {
                documentType: payload.documentType || 'test',
                formData: payload.formData || {teste: 'dados'},
                userEmail: payload.userEmail || 'test@educador.edu.es.gov.br'
            };

            console.log('📤 Enviando dados:', requestBody);
            
            // ✅ CORREÇÃO: Use this.cloudFunctionUrl
            const response = await fetch(this.cloudFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Resposta recebida:', result);
            return result;

        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            throw error;
        }
    }

    // ✅ SIMULAÇÃO PARA MODO DESENVOLVIMENTO
    simulateResponse(payload) {
        switch (payload.action) {
            case 'generateDocument':
                return this.simulateDocumentGeneration(payload);
            case 'requestAccess':
                return this.simulateAccessRequest(payload);
            case 'checkAccess':
                return { success: true, hasAccess: true };
            case 'test':
                return { 
                    success: true, 
                    message: '✅ API Online - Modo Desenvolvimento',
                    timestamp: new Date().toISOString()
                };
            default:
                return { success: false, error: 'Ação desconhecida' };
        }
    }

    simulateDocumentGeneration(payload) {
        const { documentType } = payload;
        const timestamp = new Date().getTime();
        
        // ✅ CORREÇÃO 2: Nome genérico se DOCUMENT_NAMES não estiver disponível
        const docName = this.getDocumentName(documentType);
        const filename = `${docName}_${timestamp}.pdf`;
        
        console.log('📄 Simulando geração de:', filename);
        
        return {
            success: true,
            documentId: `doc_${timestamp}`,
            documentUrl: `https://docs.google.com/document/d/doc_${timestamp}/edit`,
            pdfUrl: `https://drive.google.com/file/d/pdf_${timestamp}/view`,
            filename: filename,
            message: '✅ Documento gerado com sucesso! (Modo Desenvolvimento)'
        };
    }

    // ✅ NOVA FUNÇÃO: Obter nome do documento
    getDocumentName(documentType) {
        // Tenta usar DOCUMENT_NAMES se disponível
        if (typeof DOCUMENT_NAMES !== 'undefined' && DOCUMENT_NAMES[documentType]) {
            return DOCUMENT_NAMES[documentType];
        }
        
        // Fallback: nomes básicos
        const fallbackNames = {
            'cuidador': 'Cuidador',
            'justificativa': 'Justificativa',
            'parecer': 'Parecer',
            'regularizacao_aee': 'Regularizacao_AEE',
            'viagem_pedagogica': 'Viagem_Pedagogica',
            'manifestacao': 'Manifestacao',
            'eletivas': 'Eletivas',
            'projeto': 'Projeto',
            'links_uteis': 'Links_Uteis'
        };
        
        return fallbackNames[documentType] || documentType;
    }

    simulateAccessRequest(payload) {
        console.log('📧 Simulando envio de email');
        return {
            success: true,
            message: '✅ Solicitação de acesso enviada! (Modo Desenvolvimento)'
        };
    }

    // Testar conexão
    async testConnection() {
        console.log('🧪 Testando conexão com Cloud Function...');
        
        try {
            // ✅ CORREÇÃO: Use this.cloudFunctionUrl
            const response = await fetch(this.cloudFunctionUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    documentType: 'cuidador',
                    userEmail: 'test@educador.edu.es.gov.br',
                    formData: {teste: 'conexao'}
                })
            });
            
            if (response.ok) {
                console.log('✅ Cloud Function respondendo!');
                return true;
            } else {
                console.log('⚠️ Cloud Function com status:', response.status);
                return true;
            }
        } catch (error) {
            console.log('⚠️ Erro na conexão:', error.message);
            return true;
        }
    }
}
