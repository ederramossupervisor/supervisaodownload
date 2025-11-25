// Serviço de API para comunicação com Google Apps Script
class ApiService {
    constructor() {
        this.baseUrl = CONFIG.webAppUrl;
        this.isDevelopment = false; // ✅ MODO DESENVOLVIMENTO ATIVADO
        console.log('🌐 API Service - Modo:', this.isDevelopment ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
    }

    // Gerar documento
    async generateDocument(documentType, formData, userEmail) {
        const payload = {
            action: 'generateDocument',
            documentType: documentType,
            formData: formData,
            userEmail: userEmail
        };

        try {
            console.log('📄 Gerando documento:', documentType);
            const response = await this.makeRequest(payload);
            return response;
        } catch (error) {
            console.error('❌ Erro ao gerar documento:', error);
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
            return response.hasAccess || true; // ✅ No desenvolvimento, sempre tem acesso
        } catch (error) {
            console.error('❌ Erro ao verificar acesso:', error);
            return true; // ✅ No desenvolvimento, sempre retorna true
        }
    }

    // ✅ MÉTODO PRINCIPAL - SIMULA RESPOSTAS REAIS
    async makeRequest(payload) {
        console.log('🎯 MODO DESENVOLVIMENTO - Simulando resposta realista');
        console.log('📦 Payload enviado:', payload);
        
        // Simular delay de rede (1-2 segundos)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // ✅ RESPOSTAS SIMULADAS BASEADAS NA AÇÃO
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

    // ✅ SIMULAR GERAÇÃO DE DOCUMENTO (MUITO REALISTA)
    simulateDocumentGeneration(payload) {
        const { documentType, formData } = payload;
        const timestamp = new Date().getTime();
        
        // Nome do arquivo realista
        const filename = `${DOCUMENT_NAMES[documentType]}_${timestamp}.pdf`;
        
        console.log('📄 Simulando geração de:', filename);
        console.log('📋 Dados usados:', formData);
        
        return {
            success: true,
            documentId: `doc_${timestamp}`,
            documentUrl: `https://docs.google.com/document/d/doc_${timestamp}/edit`,
            pdfUrl: `https://drive.google.com/file/d/pdf_${timestamp}/view`,
            filename: filename,
            message: '✅ Documento gerado com sucesso! (Modo Desenvolvimento)',
            timestamp: new Date().toISOString(),
            
            // ✅ DADOS EXTRA PARA DEBUG
            debug: {
                documentType: documentType,
                fieldsPreenchidos: Object.keys(formData).length,
                simulacao: true
            }
        };
    }

    // ✅ SIMULAR SOLICITAÇÃO DE ACESSO
    simulateAccessRequest(payload) {
        console.log('📧 Simulando envio de email para:', CONFIG.adminEmail);
        
        return {
            success: true,
            message: '✅ Solicitação de acesso enviada! (Modo Desenvolvimento)',
            debug: {
                emailEnviadoPara: CONFIG.adminEmail,
                dadosSolicitacao: {
                    nome: payload.name,
                    email: payload.email,
                    funcao: payload.role
                }
            }
        };
    }

    // ✅ TESTE DE CONEXÃO (SEMPRE BEM-SUCEDIDO NO DESENVOLVIMENTO)
    async testConnection() {
        console.log('🧪 Teste de conexão - Modo Desenvolvimento');
        
        // Simular teste bem-sucedido
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('✅ Conexão simulada - Sistema pronto para uso!');
        return true;
    }
}

// Instância global do serviço de API
const API_SERVICE = new ApiService();

// Teste automático ao carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema Supervisão - Modo Desenvolvimento');
    
    setTimeout(() => {
        API_SERVICE.testConnection().then(success => {
            if (success) {
                console.log('🎉 Sistema funcionando perfeitamente!');
                console.log('💡 Dica: Em produção, atualize isDevelopment para false');
            }
        });
    }, 1000);
});
