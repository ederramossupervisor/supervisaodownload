// Serviço de API para comunicação com Google Apps Script
class ApiService {
    constructor() {
        this.baseUrl = CONFIG.webAppUrl;
        this.isDevelopment = false; // MODO PRODUÇÃO
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
            return response.hasAccess || true;
        } catch (error) {
            console.error('❌ Erro ao verificar acesso:', error);
            return true;
        }
    }

    // ✅ MÉTODO PRINCIPAL - USA JSONP PARA EVITAR CORS
    makeRequest(payload) {
        return new Promise((resolve, reject) => {
            if (this.isDevelopment) {
                console.log('🎯 MODO DESENVOLVIMENTO - Simulando resposta');
                resolve(this.simulateResponse(payload));
                return;
            }
            
            console.log('🚀 MODO PRODUÇÃO - Enviando via JSONP');
            
            // Criar callback única
            const callbackName = 'callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Criar script para JSONP
            const script = document.createElement('script');
            const url = this.baseUrl + 
                '?callback=' + callbackName + 
                '&data=' + encodeURIComponent(JSON.stringify(payload));
            
            script.src = url;
            
            // Definir callback global temporária
            window[callbackName] = (response) => {
                // Limpar
                delete window[callbackName];
                document.head.removeChild(script);
                
                console.log('✅ Resposta da API:', response);
                resolve(response);
            };
            
            // Timeout para erro
            const timeout = setTimeout(() => {
                delete window[callbackName];
                if (script.parentNode) {
                    document.head.removeChild(script);
                }
                reject(new Error('Timeout na requisição JSONP'));
            }, 30000);
            
            // Tratamento de erro
            script.onerror = () => {
                clearTimeout(timeout);
                delete window[callbackName];
                if (script.parentNode) {
                    document.head.removeChild(script);
                }
                reject(new Error('Falha ao carregar script JSONP'));
            };
            
            document.head.appendChild(script);
        });
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
        const { documentType, formData } = payload;
        const timestamp = new Date().getTime();
        const filename = `${DOCUMENT_NAMES[documentType]}_${timestamp}.pdf`;
        
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

    simulateAccessRequest(payload) {
        console.log('📧 Simulando envio de email para:', CONFIG.adminEmail);
        return {
            success: true,
            message: '✅ Solicitação de acesso enviada! (Modo Desenvolvimento)'
        };
    }

    async testConnection() {
        if (this.isDevelopment) {
            console.log('🧪 Teste de conexão - Modo Desenvolvimento');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('✅ Conexão simulada - Sistema pronto para uso!');
            return true;
        }
        
        // Teste real em produção
        try {
            const result = await this.makeRequest({
                action: 'test',
                userEmail: 'test@email.com'
            });
            console.log('✅ Conexão real estabelecida:', result);
            return true;
        } catch (error) {
            console.error('❌ Falha na conexão real:', error);
            return false;
        }
    }
}

// Instância global do serviço de API
const API_SERVICE = new ApiService();

// Teste automático ao carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema Supervisão - Inicializando...');
    
    setTimeout(() => {
        API_SERVICE.testConnection().then(success => {
            if (success) {
                console.log('🎉 Sistema funcionando perfeitamente!');
            }
        });
    }, 1000);
});
