// 🐛 DEPURAÇÃO - Verificar se a classe está carregando

// Aplicação principal - Controle de fluxo e eventos
class SupervisaoApp {
    constructor() {
        this.initializeApp();
        this.bindEvents();
        this.checkSavedConfig();
    }

    // Inicialização da aplicação
    initializeApp() {
        console.log(`${CONFIG.appName} v${CONFIG.version} inicializando...`);
        this.populateSchoolsList();
        this.createDocumentCards();
    }

    // Vincular eventos
    bindEvents() {
        // Navegação principal
        document.getElementById('enter-btn').addEventListener('click', () => this.showConfigScreen());
        document.getElementById('back-to-welcome').addEventListener('click', () => this.showWelcomeScreen());
        document.getElementById('config-btn').addEventListener('click', () => this.showConfigScreen());
        document.getElementById('back-to-main').addEventListener('click', () => this.showMainScreen());

        // Configuração
        document.getElementById('save-config').addEventListener('click', () => this.saveConfiguration());
        document.getElementById('request-access-btn').addEventListener('click', () => this.showAccessModal());

        // Seleção de escolas
        document.getElementById('schools-select').addEventListener('click', () => this.toggleSchoolsDropdown());
        
        // Formulário de documentos
        document.getElementById('generate-document').addEventListener('click', () => this.generateDocument());

        // Modais
        document.getElementById('download-pdf').addEventListener('click', () => this.downloadPDF());
        document.getElementById('download-docx').addEventListener('click', () => this.downloadDOCX());
        document.getElementById('access-form').addEventListener('submit', (e) => this.handleAccessRequest(e));

        // Fechar modais
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Fechar modais ao clicar fora
        window.addEventListener('click', (e) => {
    if (typeof this.handleOutsideClick === 'function') {
        this.handleOutsideClick(e);
    }
});

        // Prevenir fechamento do dropdown ao clicar dentro
        document.getElementById('schools-list').addEventListener('click', (e) => e.stopPropagation());
    }

    // Verificar se há configuração salva
    checkSavedConfig() {
        if (UTILS.loadConfig() && APP_STATE.configCompleted) {
            this.showMainScreen();
            UTILS.showNotification('Configuração carregada com sucesso!', 'success');
        }
    }

    // Popular lista de escolas
    populateSchoolsList() {
        const schoolsList = document.getElementById('schools-list');
        schoolsList.innerHTML = '';

        SCHOOLS_DATA.forEach(school => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = school.name;
            item.addEventListener('click', () => this.toggleSchoolSelection(school.name));
            schoolsList.appendChild(item);
        });
    }

    // Criar cards de documentos
    createDocumentCards() {
        const container = document.querySelector('.document-types');
        container.innerHTML = '';

        Object.keys(DOCUMENT_FIELDS).forEach(docType => {
            const card = document.createElement('div');
            card.className = 'document-type';
            card.setAttribute('data-type', docType);
            card.innerHTML = `
                <i class="${DOCUMENT_ICONS[docType]}"></i>
                <h3>${DOCUMENT_NAMES[docType]}</h3>
            `;
            card.addEventListener('click', () => this.selectDocumentType(docType));
            container.appendChild(card);
        });
    }

    // Navegação entre telas
    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcome-screen').classList.remove('hidden');
    }

    showConfigScreen() {
        this.hideAllScreens();
        document.getElementById('config-screen').classList.remove('hidden');
        this.loadConfigIntoForm();
    }

    showMainScreen() {
        // Verificar se a configuração está completa
        if (!APP_STATE.configCompleted) {
            UTILS.showNotification('Complete a configuração primeiro!', 'error');
            this.showConfigScreen();
            return;
        }

        this.hideAllScreens();
        document.getElementById('main-screen').classList.remove('hidden');
    }

    showFormScreen() {
        this.hideAllScreens();
        document.getElementById('form-screen').classList.remove('hidden');
    }

    hideAllScreens() {
        document.querySelectorAll('.container .card, #main-screen').forEach(screen => {
            screen.classList.add('hidden');
        });
    }

    // Configuração do usuário
    loadConfigIntoForm() {
        document.getElementById('supervisor-name').value = APP_STATE.supervisorName;
        this.updateSelectedSchoolsDisplay();
    }

    // ✅ CORRIGIDO: Método saveConfiguration completo
    saveConfiguration() {
        const supervisorName = document.getElementById('supervisor-name').value.trim();
        
        // Validações
        if (!supervisorName) {
            UTILS.showNotification('Por favor, informe seu nome completo.', 'error');
            document.getElementById('supervisor-name').focus();
            return;
        }

        if (APP_STATE.selectedSchools.length === 0) {
            UTILS.showNotification('Selecione pelo menos uma escola.', 'error');
            document.getElementById('schools-select').focus();
            return;
        }

        // ✅ CORRIGIDO: Salvar configuração
        APP_STATE.supervisorName = supervisorName;
        APP_STATE.configCompleted = true;
        
        // ✅ FORÇAR SALVAMENTO E VERIFICAR
        const saved = UTILS.saveConfig();
        
        if (saved) {
            UTILS.showNotification('Configuração salva com sucesso!', 'success');
            this.showMainScreen();
        } else {
            UTILS.showNotification('Erro ao salvar configuração. Tente novamente.', 'error');
        }
    }

    // Seleção de escolas
    toggleSchoolsDropdown() {
        const dropdown = document.getElementById('schools-list');
        dropdown.classList.toggle('show');
    }

    toggleSchoolSelection(schoolName) {
        const index = APP_STATE.selectedSchools.indexOf(schoolName);
        
        if (index > -1) {
            // Remover escola
            APP_STATE.selectedSchools.splice(index, 1);
        } else {
            // Adicionar escola
            APP_STATE.selectedSchools.push(schoolName);
        }
        
        this.updateSelectedSchoolsDisplay();
        this.highlightSelectedSchools();
    }

    updateSelectedSchoolsDisplay() {
        const container = document.getElementById('selected-schools');
        container.innerHTML = '';

        APP_STATE.selectedSchools.forEach(schoolName => {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.innerHTML = `
                ${schoolName}
                <i class="fas fa-times" data-school="${schoolName}"></i>
            `;
            
            item.querySelector('i').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSchool(schoolName);
            });
            
            container.appendChild(item);
        });
    }

    highlightSelectedSchools() {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            if (APP_STATE.selectedSchools.includes(item.textContent)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    removeSchool(schoolName) {
        APP_STATE.selectedSchools = APP_STATE.selectedSchools.filter(name => name !== schoolName);
        this.updateSelectedSchoolsDisplay();
        this.highlightSelectedSchools();
    }

    // Documentos
    selectDocumentType(documentType) {
        // Verificar acesso aos templates
        if (!UTILS.checkTemplateAccess()) {
            UTILS.showNotification('Acesso aos templates não concedido. Solicite acesso nas configurações.', 'error');
            this.showConfigScreen();
            return;
        }

        APP_STATE.currentDocumentType = documentType;
        this.populateDocumentForm(documentType);
        this.showFormScreen();
    }

    populateDocumentForm(documentType) {
        const form = document.getElementById('document-form');
        const title = document.getElementById('form-title');
        
        // Atualizar título
        title.innerHTML = `<i class="fas fa-edit"></i> ${DOCUMENT_NAMES[documentType]} - Preencha os Dados`;
        
        // Limpar formulário
        form.innerHTML = '';
        
        // Adicionar campos
        const fields = DOCUMENT_FIELDS[documentType];
        fields.forEach(field => {
            const fieldHTML = DOCUMENT_HANDLERS.createFieldHTML(field);
            form.innerHTML += fieldHTML;
        });

        // Configurar campos dinamicamente
        this.setupFormFields(documentType);
    }

    setupFormFields(documentType) {
        const fields = DOCUMENT_FIELDS[documentType];
        
        fields.forEach(field => {
            const input = document.querySelector(`[name="${field.name}"]`);
            if (!input) return;

            // Configurar dropdowns
            if (field.type === 'dropdown') {
                DOCUMENT_HANDLERS.populateDropdown(input, field.name);
            }

            // Configurar auto-preenchimento
            DOCUMENT_HANDLERS.setupAutoFill(field, input);

            // Configurar geração automática
            DOCUMENT_HANDLERS.setupAutoGenerate(field, input);

            // Configurar eventos de change para campos que afetam outros
            if (field.name === "Nome da Escola") {
                input.addEventListener('change', () => this.handleSchoolChange());
            }
        });
    }

    handleSchoolChange() {
        const schoolField = document.querySelector('[name="Nome da Escola"]');
        const selectedSchool = UTILS.getSchoolData(schoolField.value);
        
        if (selectedSchool) {
            // Preencher campos relacionados automaticamente
            const municipalityField = document.querySelector('[name="Nome do Município"]');
            if (municipalityField) {
                municipalityField.value = selectedSchool.city;
            }

            const directorField = document.querySelector('[name="Nome do Diretor"]');
            if (directorField) {
                directorField.value = selectedSchool.director;
            }
        }
    }

    async generateDocument() {
    const validation = DOCUMENT_HANDLERS.validateForm(APP_STATE.currentDocumentType);
    
    if (!validation.isValid) {
        UTILS.showNotification('Preencha todos os campos obrigatórios!', 'error');
        validation.errors.forEach(error => {
            console.error('Erro de validação:', error);
        });
        return;
    }

    // Coletar dados
    APP_STATE.formData = DOCUMENT_HANDLERS.collectFormData(APP_STATE.currentDocumentType);

    try {
        console.log('🔧 === INICIANDO GERAÇÃO DE DOCUMENTO ===');
        console.log('📄 Tipo:', APP_STATE.currentDocumentType);
        console.log('📋 Dados:', APP_STATE.formData);
        
        // Mostrar loading
        const generateBtn = document.getElementById('generate-document');
        const originalText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Documento...';
        generateBtn.disabled = true;

        // Usar seu email real
        const userEmail = 'eder.ramos@educador.edu.es.gov.br';
        console.log('📧 Email usado:', userEmail);
        console.log('🌐 Chamando API...');
        
        // Gerar documento real usando a API
        const result = await DOCUMENT_HANDLERS.createPDF(
            APP_STATE.currentDocumentType, 
            APP_STATE.formData,
            userEmail
        );

        console.log('📤 Resultado da API:', result);

        if (result.success) {
            APP_STATE.generatedDocument = result;
            console.log('🎯 Documento gerado com sucesso!');
            console.log('🔗 URL do PDF:', result.url);
            console.log('🔗 URL do DOCX:', result.documentUrl);
            
            // ✅ SOLUÇÃO DIRETA - Mostrar modal manualmente
console.log('🎯 Mostrando modal de download manualmente...');
const modal = document.getElementById('download-modal');
if (modal) {
    modal.classList.remove('hidden');
    console.log('✅ Modal mostrado com sucesso!');
    
    // Configurar botão de fechar
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.add('hidden');
            DOCUMENT_HANDLERS.clearForm();
            this.showMainScreen();
        };
    }
} else {
    console.error('❌ Modal não encontrado!');
    // Fallback: mostrar mensagem
    UTILS.showNotification('Documento gerado! (Modal não disponível)', 'success');
}
            UTILS.showNotification('Documento gerado com sucesso!', 'success');
        } else {
            throw new Error('Falha na geração do documento: ' + (result.error || 'Erro desconhecido'));
        }

    } catch (error) {
        console.error('💥 ERRO COMPLETO:', error);
        UTILS.showNotification(error.message || 'Erro ao gerar documento. Tente novamente.', 'error');
    } finally {
        // Restaurar botão
        const generateBtn = document.getElementById('generate-document');
        generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Gerar Documento';
        generateBtn.disabled = false;
    }
}

    // Download de documentos
    async downloadPDF() {
        if (!APP_STATE.generatedDocument) {
            UTILS.showNotification('Nenhum documento gerado para download.', 'error');
            return;
        }

        try {
            // Mostrar loading no botão de download
            const pdfBtn = document.getElementById('download-pdf');
            const originalText = pdfBtn.innerHTML;
            pdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Baixando...';
            pdfBtn.disabled = true;

            // Fazer download do PDF
            DOCUMENT_HANDLERS.downloadFile(
                APP_STATE.generatedDocument.filename,
                APP_STATE.generatedDocument.url
            );

            // Fechar modal e limpar após um breve delay
            setTimeout(() => {
                this.closeModal(document.getElementById('download-modal'));
                DOCUMENT_HANDLERS.clearForm();
                this.showMainScreen();
                UTILS.showNotification('PDF baixado com sucesso!', 'success');
            }, 1000);

        } catch (error) {
            console.error('Erro ao baixar PDF:', error);
            UTILS.showNotification('Erro ao baixar PDF. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            const pdfBtn = document.getElementById('download-pdf');
            pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Baixar PDF';
            pdfBtn.disabled = false;
        }
    }

    async downloadDOCX() {
        if (!APP_STATE.generatedDocument) {
            UTILS.showNotification('Nenhum documento gerado para download.', 'error');
            return;
        }

        try {
            // Mostrar loading no botão de download
            const docxBtn = document.getElementById('download-docx');
            const originalText = docxBtn.innerHTML;
            docxBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Baixando...';
            docxBtn.disabled = true;

            // Para DOCX, usamos a URL do documento editável do Google Docs
            const docxFilename = APP_STATE.generatedDocument.filename.replace('.pdf', '.docx');
            
            // Abrir o documento editável em nova aba
            window.open(APP_STATE.generatedDocument.documentUrl, '_blank');

            // Fechar modal e limpar após um breve delay
            setTimeout(() => {
                this.closeModal(document.getElementById('download-modal'));
                DOCUMENT_HANDLERS.clearForm();
                this.showMainScreen();
                UTILS.showNotification('Documento editável aberto em nova aba!', 'success');
            }, 1000);

        } catch (error) {
            console.error('Erro ao abrir DOCX:', error);
            UTILS.showNotification('Erro ao abrir documento editável. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            const docxBtn = document.getElementById('download-docx');
            docxBtn.innerHTML = '<i class="fas fa-file-word"></i> Baixar DOCX';
            docxBtn.disabled = false;
        }
    }

    // Solicitação de acesso
    async handleAccessRequest(e) {
        e.preventDefault();

        const name = document.getElementById('requester-name').value.trim();
        const email = document.getElementById('requester-email').value.trim();
        const role = document.getElementById('requester-role').value.trim();

        // Validações
        if (!name || !email || !role) {
            UTILS.showNotification('Preencha todos os campos!', 'error');
            return;
        }

        if (!UTILS.validateInstitutionalEmail(email)) {
            UTILS.showNotification('Use um e-mail institucional válido (@educador.edu.es.gov.br ou @edu.es.gov.br)', 'error');
            return;
        }

        try {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            const requestData = {
                name: name,
                email: email,
                role: role,
                supervisorName: APP_STATE.supervisorName,
                schools: APP_STATE.selectedSchools,
                requestedAt: new Date().toISOString()
            };

            // Enviar solicitação via API
            const result = await API_SERVICE.requestAccess(requestData);

            if (result.success) {
                UTILS.showNotification('Solicitação enviada com sucesso! O administrador será notificado.', 'success');
                this.closeModal(document.getElementById('access-modal'));
                document.getElementById('access-form').reset();
                
                // Marcar que o acesso foi solicitado
                APP_STATE.accessRequested = true;
                UTILS.saveConfig();
            } else {
                throw new Error(result.error || 'Erro ao enviar solicitação');
            }

        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            UTILS.showNotification(error.message || 'Erro ao enviar solicitação. Tente novamente.', 'error');
        } finally {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
            submitBtn.disabled = false;
        }
    }

    // Verificar acesso aos templates
    async checkTemplateAccess() {
        // ✅ CORREÇÃO: Administradores têm acesso imediato
        const userEmail = 'eder.ramos@educador.edu.es.gov.br'; // Em produção, pegar do usuário logado
        if (CONFIG.adminEmails && CONFIG.adminEmails.includes(userEmail)) {
            return true;
        }
        
        // Para outros usuários, verificar se solicitaram acesso
        return APP_STATE.accessRequested || APP_STATE.hasAccess;
    }

    // Utilitários
    showLoading(message = 'Processando...') {
        // Poderia implementar um overlay de loading aqui
        console.log('Loading:', message);
    }

    hideLoading() {
        // Remover overlay de loading se implementado
        console.log('Loading completo');
    }

    // Limpar estado da aplicação
    clearAppState() {
        APP_STATE = {
            supervisorName: "",
            selectedSchools: [],
            currentDocumentType: "",
            formData: {},
            hasAccess: false,
            configCompleted: false,
            accessRequested: false,
            generatedDocument: null
        };
        UTILS.clearConfig();
    }
        // ✅ CORREÇÃO: Método para mostrar modal de download
    showDownloadModal() {
        console.log('📁 Mostrando modal de download...');
        const modal = document.getElementById('download-modal');
        modal.classList.remove('hidden');
        
        // Adicionar evento para fechar modal
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal(modal);
        }
    }

    // ✅ CORREÇÃO: Método para fechar modais
    closeModal(modal) {
        console.log('❌ Fechando modal...');
        modal.classList.add('hidden');
    }

    // ✅ CORREÇÃO: Método para mostrar modal de acesso
    showAccessModal() {
        console.log('🔑 Mostrando modal de acesso...');
        const modal = document.getElementById('access-modal');
        modal.classList.remove('hidden');
        
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal(modal);
        }
    }

    // ✅ CORREÇÃO: Método para lidar com clique fora dos modais
    handleOutsideClick(e) {
        // Fechar dropdown de escolas
        const schoolsDropdown = document.getElementById('schools-list');
        if (schoolsDropdown && schoolsDropdown.classList.contains('show') && 
            !e.target.closest('.multi-select')) {
            schoolsDropdown.classList.remove('show');
        }
        
        // Fechar modais ao clicar fora
        if (e.target.classList.contains('modal')) {
            this.closeModal(e.target);
        }
    }
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.supervisaoApp = new SupervisaoApp();
    
    // Adicionar estilos dinâmicos se necessário
    if (!document.querySelector('.dynamic-styles')) {
        const dynamicStyles = document.createElement('style');
        dynamicStyles.className = 'dynamic-styles';
        dynamicStyles.textContent = `
            .btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .btn:disabled:hover {
                transform: none !important;
                box-shadow: none !important;
            }
            
            .fa-spin {
                animation: fa-spin 1s infinite linear;
            }
            
            @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Melhorar visualização dos campos readonly */
            input[readonly], textarea[readonly] {
                background-color: var(--cinza-claro);
                color: var(--cinza-escuro);
                cursor: not-allowed;
            }

            /* Estilos para loading states */
            .loading {
                position: relative;
                pointer-events: none;
            }

            .loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid var(--cinza);
                border-top: 2px solid var(--azul);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(dynamicStyles);
    }
});

// ✅ CORREÇÃO: Service Worker comentado para evitar erros
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso: ', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha no registro do ServiceWorker: ', error);
            });
    });
}
*/
// ✅ SOLUÇÃO DE EMERGÊNCIA - Configuração manual dos botões
console.log('🔧 Configurando navegação manual...');

// Função para configurar navegação manual
function setupManualNavigation() {
    console.log('🎯 Iniciando configuração manual de navegação...');
    
    // Botão Entrar
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', function() {
            console.log('🚪 Botão Entrar clicado!');
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('config-screen').classList.remove('hidden');
        });
        console.log('✅ Botão Entrar configurado');
    }
    
    // Botão Voltar (Configuração → Boas-vindas)
    const backToWelcome = document.getElementById('back-to-welcome');
    if (backToWelcome) {
        backToWelcome.addEventListener('click', function() {
            console.log('↩️ Botão Voltar clicado!');
            document.getElementById('config-screen').classList.add('hidden');
            document.getElementById('welcome-screen').classList.remove('hidden');
        });
        console.log('✅ Botão Voltar configurado');
    }
    
    // Botão Configurações (Principal → Configuração)
    const configBtn = document.getElementById('config-btn');
    if (configBtn) {
        configBtn.addEventListener('click', function() {
            console.log('⚙️ Botão Configurações clicado!');
            document.getElementById('main-screen').classList.add('hidden');
            document.getElementById('config-screen').classList.remove('hidden');
        });
        console.log('✅ Botão Configurações configurado');
    }
    
    console.log('🎉 Navegação manual configurada com sucesso!');
}

// Aguardar o DOM carregar e então configurar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupManualNavigation);
} else {
    setupManualNavigation();
}
