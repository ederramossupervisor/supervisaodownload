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

    async makeRequest(payload) {
    if (this.isDevelopment) {
        console.log('🎯 MODO DESENVOLVIMENTO - Simulando resposta');
        return this.simulateResponse(payload);
    }
    
    console.log('🚀 MODO PRODUÇÃO - Enviando via Proxy GitHub');
    
    return new Promise((resolve, reject) => {
        // URL do proxy no SEU GitHub Pages
        const proxyUrl = 'https://ederramossupervisor.github.io/supervisaodownload/proxy.html' +
            '?url=' + encodeURIComponent('https://script.google.com/macros/s/SUA_URL/exec') +
            '&data=' + encodeURIComponent(JSON.stringify(payload));
        
        // Cria um iframe invisível que carrega o proxy
        const iframe = document.createElement('iframe');
        iframe.src = proxyUrl;
        iframe.style.display = 'none';
        
        // Escuta a resposta do proxy
        const messageHandler = (event) => {
            if (event.data.type === 'PROXY_RESPONSE') {
                // Limpeza
                window.removeEventListener('message', messageHandler);
                document.body.removeChild(iframe);
                
                console.log('✅ Resposta via Proxy:', event.data.result);
                resolve(event.data.result);
                
            } else if (event.data.type === 'PROXY_ERROR') {
                window.removeEventListener('message', messageHandler);
                document.body.removeChild(iframe);
                reject(new Error(event.data.error));
            }
        };
        
        window.addEventListener('message', messageHandler);
        document.body.appendChild(iframe);
        
        // Timeout de segurança
        setTimeout(() => {
            window.removeEventListener('message', messageHandler);
            if (iframe.parentNode) document.body.removeChild(iframe);
            reject(new Error('Timeout no proxy'));
        }, 30000);
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
