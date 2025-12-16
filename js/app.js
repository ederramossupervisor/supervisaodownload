// ========== SPLASH SCREEN CONTROL ==========
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar classe para mostrar a splash
  document.body.classList.remove('app-loaded');
  
  // Esconder splash quando tudo carregar (incluindo imagens)
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.body.classList.add('app-loaded');
      
      // Iniciar a aplicação após a splash
      setTimeout(initializeMainApp, 300);
    }, 1500);
  });
  
  // Fallback: se a página já estiver carregada
  if (document.readyState === 'complete') {
    setTimeout(function() {
      document.body.classList.add('app-loaded');
      initializeMainApp();
    }, 1500);
  }
});

// ========== APLICAÇÃO PRINCIPAL ==========
function initializeMainApp() {
  console.log('🎬 Splash screen escondida - Iniciando aplicação...');
  
  // Verificar se todos os scripts necessários estão carregados
  const requiredScripts = [
    'CONFIG', 'SCHOOLS_DATA', 'DOCUMENT_FIELDS', 'ApiService',
    'UTILS', 'DOCUMENT_HANDLERS', 'API_SERVICE'
  ];
  
  let allLoaded = true;
  requiredScripts.forEach(script => {
    if (typeof window[script] === 'undefined') {
      console.warn(`⚠️ ${script} ainda não carregado`);
      allLoaded = false;
    }
  });
  
  if (!allLoaded) {
    // Aguardar mais um pouco
    setTimeout(initializeMainApp, 500);
    return;
  }
  
  // Inicializar aplicação
  window.supervisaoApp = new SupervisaoApp();
}

// Aplicação principal - Controle de fluxo e eventos
class SupervisaoApp {
    constructor() {
        this.selectedSchools = []; // Para controle temporário no modal
        this.initializeApp();
        this.bindEvents();
        this.checkSavedConfig();
    }

    // Inicialização da aplicação
    initializeApp() {
        console.log(`${CONFIG.appName} v${CONFIG.version} inicializando...`);
        this.initSchoolSelector(); // Novo sistema de seleção
        this.createDocumentCards();
        
        // Mostrar notificação de inicialização
        setTimeout(() => {
            UTILS.showNotification('Sistema Supervisão carregado com sucesso!', 'success');
        }, 1000);
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

        // Formulário de documentos
        document.getElementById('generate-document').addEventListener('click', () => this.generateDocument());

        // Modais
        document.getElementById('download-pdf').addEventListener('click', () => this.downloadPDF());
        document.getElementById('access-form').addEventListener('submit', (e) => this.handleAccessRequest(e));

        // Fechar modais
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Fechar modais ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    // ===== NOVO SISTEMA DE SELEÇÃO DE ESCOLAS =====

    // Inicializar o sistema de seleção de escolas
    initSchoolSelector() {
        const schoolBtn = document.getElementById('school-selector-btn');
        const schoolsModal = document.getElementById('schools-modal');
        const confirmBtn = document.getElementById('confirm-schools');
        const cancelBtn = document.getElementById('cancel-schools');
        const clearBtn = document.getElementById('clear-selection');
        const searchInput = document.getElementById('school-search');
        const closeBtn = schoolsModal.querySelector('.close');

        // Carregar escolas
        this.loadSchools();

        // Event listeners
        schoolBtn.addEventListener('click', () => this.openSchoolsModal());
        confirmBtn.addEventListener('click', () => this.confirmSchoolSelection());
        cancelBtn.addEventListener('click', () => this.closeSchoolsModal());
        clearBtn.addEventListener('click', () => this.clearSchoolSelection());
        closeBtn.addEventListener('click', () => this.closeSchoolsModal());
        searchInput.addEventListener('input', (e) => this.filterSchools(e.target.value));

        // Fechar modal ao clicar fora
        schoolsModal.addEventListener('click', (e) => {
            if (e.target === schoolsModal) {
                this.closeSchoolsModal();
            }
        });
    }

    // Carregar lista de escolas
    loadSchools() {
        // Usar SCHOOLS_DATA existente
        APP_STATE.allSchools = SCHOOLS_DATA.map(school => school.name);
        
        // Carregar escolas salvas anteriormente
        const savedConfig = UTILS.loadConfig();
        if (savedConfig && savedConfig.schools) {
            APP_STATE.selectedSchools = savedConfig.schools;
            this.selectedSchools = [...savedConfig.schools]; // Cópia para controle temporário
            this.updateSchoolSelectionDisplay();
        }
    }

    // Abrir modal de escolas
    openSchoolsModal() {
        const modal = document.getElementById('schools-modal');
        const schoolBtn = document.getElementById('school-selector-btn');
        
        modal.classList.remove('hidden');
        schoolBtn.classList.add('active');
        this.renderSchoolsList();
        this.updateSelectionCounters();
    }

    // Fechar modal de escolas
    closeSchoolsModal() {
        const modal = document.getElementById('schools-modal');
        const schoolBtn = document.getElementById('school-selector-btn');
        
        modal.classList.add('hidden');
        schoolBtn.classList.remove('active');
        
        // Restaurar seleção temporária para o estado atual
        this.selectedSchools = [...APP_STATE.selectedSchools];
    }

    // Confirmar seleção de escolas
    confirmSchoolSelection() {
        APP_STATE.selectedSchools = [...this.selectedSchools];
        this.updateSchoolSelectionDisplay();
        this.closeSchoolsModal();
    }

    // Limpar seleção
    clearSchoolSelection() {
        this.selectedSchools = [];
        this.renderSchoolsList();
        this.updateSelectionCounters();
    }

    // Filtrar escolas
    filterSchools(searchTerm) {
        this.renderSchoolsList(searchTerm);
    }

    // Renderizar lista de escolas
    renderSchoolsList(filter = '') {
        const container = document.getElementById('schools-checklist');
        const filteredSchools = APP_STATE.allSchools.filter(school => 
            school.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredSchools.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Nenhuma escola encontrada</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredSchools.map(school => `
            <div class="school-checkbox-item ${this.selectedSchools.includes(school) ? 'selected' : ''}" 
                 data-school="${school}">
                <div class="school-checkbox"></div>
                <div class="school-name">${school}</div>
            </div>
        `).join('');

        // Adicionar event listeners aos itens
        container.querySelectorAll('.school-checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                const school = item.dataset.school;
                this.toggleSchoolSelection(school);
            });
        });
    }

    // Alternar seleção de escola
    toggleSchoolSelection(school) {
        const index = this.selectedSchools.indexOf(school);
        
        if (index > -1) {
            // Remover se já estiver selecionada
            this.selectedSchools.splice(index, 1);
        } else {
            // Adicionar se não estiver selecionada
            this.selectedSchools.push(school);
        }
        
        this.renderSchoolsList(document.getElementById('school-search').value);
        this.updateSelectionCounters();
    }

    // Atualizar contadores
    updateSelectionCounters() {
        const selectedCounter = document.getElementById('selected-counter');
        const totalCounter = document.getElementById('total-counter');
        const countNumber = document.getElementById('count-number');
        
        if (selectedCounter) selectedCounter.textContent = this.selectedSchools.length;
        if (totalCounter) totalCounter.textContent = APP_STATE.allSchools.length;
        if (countNumber) countNumber.textContent = this.selectedSchools.length;
    }

    // Atualizar display da seleção
    updateSchoolSelectionDisplay() {
        const previewContainer = document.getElementById('selected-schools-preview');
        const selectorText = document.getElementById('school-selector-text');
        
        // Atualizar texto do botão
        if (selectorText) {
            if (APP_STATE.selectedSchools.length === 0) {
                selectorText.textContent = 'Selecionar Escolas';
            } else if (APP_STATE.selectedSchools.length === 1) {
                selectorText.textContent = '1 escola selecionada';
            } else {
                selectorText.textContent = `${APP_STATE.selectedSchools.length} escolas selecionadas`;
            }
        }
        
        // Atualizar preview
        if (previewContainer) {
            if (APP_STATE.selectedSchools.length === 0) {
                previewContainer.innerHTML = '<div class="empty-preview">Nenhuma escola selecionada</div>';
            } else {
                previewContainer.innerHTML = APP_STATE.selectedSchools.map(school => `
                    <div class="school-preview-item">
                        ${school}
                        <i class="fas fa-times" onclick="supervisaoApp.removeSchoolFromPreview('${school}')"></i>
                    </div>
                `).join('');
            }
        }
        
        this.updateSelectionCounters();
    }

    // Remover escola do preview
    removeSchoolFromPreview(school) {
        const index = APP_STATE.selectedSchools.indexOf(school);
        if (index > -1) {
            APP_STATE.selectedSchools.splice(index, 1);
            this.selectedSchools.splice(index, 1);
            this.updateSchoolSelectionDisplay();
            this.renderSchoolsList(document.getElementById('school-search').value);
        }
    }

    // ===== FIM DO NOVO SISTEMA DE SELEÇÃO =====

    // Verificar se há configuração salva
    checkSavedConfig() {
        if (UTILS.loadConfig() && APP_STATE.configCompleted) {
            this.showMainScreen();
            UTILS.showNotification('Configuração carregada com sucesso!', 'success');
        }
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
        // O display das escolas é atualizado automaticamente pelo novo sistema
    }

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
            return;
        }

        // Salvar configuração
        APP_STATE.supervisorName = supervisorName;
        APP_STATE.configCompleted = true;
        
        const saved = UTILS.saveConfig();
        
        if (saved) {
            UTILS.showNotification('Configuração salva com sucesso!', 'success');
            this.showMainScreen();
        } else {
            UTILS.showNotification('Erro ao salvar configuração. Tente novamente.', 'error');
        }
    }

    // Documentos
    selectDocumentType(documentType) {
        // SE for o card "links_uteis", mostrar os botões diretamente
        if (documentType === 'links_uteis') {
            this.showLinksUteisScreen();
            return; // ← Para aqui, não executa o restante
        }
        
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
    
    // === NOVA FUNÇÃO PARA MOSTRAR OS LINKS ===
    showLinksUteisScreen() {
        // Esconder todas as telas
        this.hideAllScreens();
        
        // Criar HTML dos links úteis
        const linksHtml = `
            <div class="card">
                <div class="form-header">
                    <h2><i class="fas fa-link"></i> Links Úteis</h2>
                    <button class="btn btn-secondary" id="back-to-main-from-links">
                        <i class="fas fa-arrow-left"></i> Voltar
                    </button>
                </div>
                
                <div class="links-container" style="margin-top: 20px;">
                    <!-- AGENDA -->
                    <div class="link-item" style="margin-bottom: 15px;">
                        <a href="https://docs.google.com/spreadsheets/d/19qp1JvmUod_iasnI0GwFronxrcYWHp9oVg8T_PXoS48/edit?usp=sharing" 
                           target="_blank" 
                           class="btn btn-secondary" 
                           style="width: 100%; text-align: left; justify-content: flex-start;">
                            <i class="fas fa-calendar-alt" style="margin-right: 10px;"></i>
                            AGENDA
                        </a>
                    </div>
                    
                    <!-- SIGAE -->
                    <div class="link-item" style="margin-bottom: 15px;">
                        <a href="https://sigae.institutounibanco.org.br/" 
                           target="_blank" 
                           class="btn btn-secondary" 
                           style="width: 100%; text-align: left; justify-content: flex-start;">
                            <i class="fas fa-chart-line" style="margin-right: 10px;"></i>
                            SIGAE
                        </a>
                    </div>
                    
                    <!-- Outlook -->
                    <div class="link-item" style="margin-bottom: 15px;">
                        <a href="https://outlook.office.com/mail/" 
                           target="_blank" 
                           class="btn btn-secondary" 
                           style="width: 100%; text-align: left; justify-content: flex-start;">
                            <i class="fas fa-envelope" style="margin-right: 10px;"></i>
                            Outlook
                        </a>
                    </div>
                    
                    <!-- SEGES -->
                    <div class="link-item" style="margin-bottom: 15px;">
                        <a href="https://seges.sedu.es.gov.br/users/sign_in" 
                           target="_blank" 
                           class="btn btn-secondary" 
                           style="width: 100%; text-align: left; justify-content: flex-start;">
                            <i class="fas fa-user-shield" style="margin-right: 10px;"></i>
                            SEGES
                        </a>
                    </div>
                    
                    <!-- DRIVE -->
                    <div class="link-item" style="margin-bottom: 15px;">
                        <a href="https://drive.google.com/drive/home" 
                           target="_blank" 
                           class="btn btn-secondary" 
                           style="width: 100%; text-align: left; justify-content: flex-start;">
                            <i class="fas fa-hdd" style="margin-right: 10px;"></i>
                            DRIVE
                        </a>
                    </div>
                    
                    <!-- EDOCS -->
                    <div class="link-item" style="margin-bottom: 15px;">
                        <a href="https://sso.acesso.gov.br/login?client_id=acessocidadao.es.gov.br&authorization_id=19af64bde0d" 
                           target="_blank" 
                           class="btn btn-secondary" 
                           style="width: 100%; text-align: left; justify-content: flex-start;">
                            <i class="fas fa-file-alt" style="margin-right: 10px;"></i>
                            EDOCS
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar ao conteúdo principal
        const contentDiv = document.querySelector('.content');
        const newDiv = document.createElement('div');
        newDiv.id = 'links-uteis-screen';
        newDiv.innerHTML = linksHtml;
        contentDiv.appendChild(newDiv);
        
        // Adicionar evento ao botão "Voltar"
        document.getElementById('back-to-main-from-links').addEventListener('click', () => {
            document.getElementById('links-uteis-screen').remove();
            this.showMainScreen();
        });
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

            console.log('📤 RESULTADO COMPLETO DA API:', result);

            if (result.success) {
                APP_STATE.generatedDocument = result;
                console.log('🎯 Documento gerado com sucesso!');
                console.log('🔗 Propriedades disponíveis:', Object.keys(result));
                
                // Mostrar modal de download
                this.showDownloadModal();
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

    // Utilitários
    showDownloadModal() {
        console.log('📁 Mostrando modal de download...');
        const modal = document.getElementById('download-modal');
        modal.classList.remove('hidden');
    }

    showAccessModal() {
        console.log('🔑 Mostrando modal de acesso...');
        const modal = document.getElementById('access-modal');
        modal.classList.remove('hidden');
    }

    closeModal(modal) {
        console.log('❌ Fechando modal...');
        modal.classList.add('hidden');
    }
}

// Adicionar estilos dinâmicos
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
    `;
    document.head.appendChild(dynamicStyles);
}
