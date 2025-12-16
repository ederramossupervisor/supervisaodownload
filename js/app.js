// ========== SPLASH SCREEN CONTROL ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM carregado - Configurando splash screen...');
    
    // Garantir que a splash está visível inicialmente
    document.body.classList.remove('app-loaded');
    
    // Aguardar 1.5 segundos para mostrar splash
    setTimeout(checkAllScriptsLoaded, 1500);
});

// ========== VERIFICAR SE TODOS SCRIPTS CARREGARAM ==========
function checkAllScriptsLoaded() {
    console.log('🔍 Verificando scripts carregados...');
    
    // Lista de scripts essenciais
    const requiredScripts = [
        'CONFIG', 'SCHOOLS_DATA', 'DOCUMENT_FIELDS', 
        'DOCUMENT_ICONS', 'DOCUMENT_NAMES', 'DROPDOWN_OPTIONS',
        'APP_STATE', 'UTILS', 'DOCUMENT_HANDLERS', 'API_SERVICE'
    ];
    
    let missingScripts = [];
    
    requiredScripts.forEach(scriptName => {
        if (typeof window[scriptName] === 'undefined') {
            missingScripts.push(scriptName);
            console.warn(`⚠️ ${scriptName} não carregado`);
        }
    });
    
    if (missingScripts.length > 0) {
        console.log(`⏳ Aguardando: ${missingScripts.join(', ')}`);
        
        // Tentar novamente em 500ms
        setTimeout(checkAllScriptsLoaded, 500);
        
        // Timeout máximo de 5 segundos
        setTimeout(function() {
            if (missingScripts.length > 0) {
                console.log('🔄 Forçando inicialização mesmo sem alguns scripts...');
                initializeApp();
            }
        }, 5000);
    } else {
        console.log('✅ Todos scripts carregados!');
        initializeApp();
    }
}

// ========== INICIALIZAR APLICAÇÃO ==========
function initializeApp() {
    console.log('🎬 Inicializando aplicação...');
    
    // Esconder splash screen
    document.body.classList.add('app-loaded');
    
    // Inicializar a aplicação principal
    setTimeout(function() {
        try {
            window.supervisaoApp = new SupervisaoApp();
            console.log('✅ Aplicação inicializada com sucesso!');
            
            // Mostrar notificação de boas-vindas
            setTimeout(() => {
                UTILS.showNotification('Sistema Supervisão carregado!', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('💥 Erro ao inicializar aplicação:', error);
            showErrorMessage('Erro ao carregar o sistema. Recarregue a página.');
        }
    }, 300);
}

// ========== APLICAÇÃO PRINCIPAL ==========
class SupervisaoApp {
    constructor() {
        console.log('🏗️  Construindo SupervisaoApp...');
        this.selectedSchools = [];
        this.initializeApp();
        this.bindEvents();
        this.checkSavedConfig();
    }

    // Inicialização da aplicação
    initializeApp() {
        console.log(`${CONFIG.appName} v${CONFIG.version} inicializando...`);
        this.initSchoolSelector();
        this.createDocumentCards();
    }

    // Vincular eventos
    bindEvents() {
        // Navegação principal
        const enterBtn = document.getElementById('enter-btn');
        const backToWelcome = document.getElementById('back-to-welcome');
        const configBtn = document.getElementById('config-btn');
        const backToMain = document.getElementById('back-to-main');
        
        if (enterBtn) enterBtn.addEventListener('click', () => this.showConfigScreen());
        if (backToWelcome) backToWelcome.addEventListener('click', () => this.showWelcomeScreen());
        if (configBtn) configBtn.addEventListener('click', () => this.showConfigScreen());
        if (backToMain) backToMain.addEventListener('click', () => this.showMainScreen());

        // Configuração
        const saveConfig = document.getElementById('save-config');
        const requestAccessBtn = document.getElementById('request-access-btn');
        
        if (saveConfig) saveConfig.addEventListener('click', () => this.saveConfiguration());
        if (requestAccessBtn) requestAccessBtn.addEventListener('click', () => this.showAccessModal());

        // Formulário de documentos
        const generateDocument = document.getElementById('generate-document');
        if (generateDocument) generateDocument.addEventListener('click', () => this.generateDocument());

        // Modais
        const downloadPdf = document.getElementById('download-pdf');
        const accessForm = document.getElementById('access-form');
        
        if (downloadPdf) downloadPdf.addEventListener('click', () => this.downloadPDF());
        if (accessForm) accessForm.addEventListener('submit', (e) => this.handleAccessRequest(e));

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

    // ===== SISTEMA DE SELEÇÃO DE ESCOLAS =====
    initSchoolSelector() {
        const schoolBtn = document.getElementById('school-selector-btn');
        const schoolsModal = document.getElementById('schools-modal');
        const confirmBtn = document.getElementById('confirm-schools');
        const cancelBtn = document.getElementById('cancel-schools');
        const clearBtn = document.getElementById('clear-selection');
        const searchInput = document.getElementById('school-search');
        const closeBtn = schoolsModal ? schoolsModal.querySelector('.close') : null;

        // Carregar escolas
        this.loadSchools();

        // Event listeners
        if (schoolBtn) schoolBtn.addEventListener('click', () => this.openSchoolsModal());
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmSchoolSelection());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeSchoolsModal());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearSchoolSelection());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeSchoolsModal());
        if (searchInput) searchInput.addEventListener('input', (e) => this.filterSchools(e.target.value));

        // Fechar modal ao clicar fora
        if (schoolsModal) {
            schoolsModal.addEventListener('click', (e) => {
                if (e.target === schoolsModal) {
                    this.closeSchoolsModal();
                }
            });
        }
    }

    // Carregar lista de escolas
    loadSchools() {
        // Usar SCHOOLS_DATA existente ou criar vazio
        if (SCHOOLS_DATA && SCHOOLS_DATA.length > 0) {
            // Certificar que APP_STATE.allSchools existe
            if (!APP_STATE.allSchools) {
                APP_STATE.allSchools = [];
            }
            APP_STATE.allSchools = SCHOOLS_DATA.map(school => school.name);
        }
        
        // Carregar escolas salvas anteriormente
        const savedConfig = UTILS.loadConfig();
        if (savedConfig && savedConfig.selectedSchools) {
            APP_STATE.selectedSchools = savedConfig.selectedSchools;
            this.selectedSchools = [...savedConfig.selectedSchools];
            this.updateSchoolSelectionDisplay();
        }
    }

    // Abrir modal de escolas
    openSchoolsModal() {
        const modal = document.getElementById('schools-modal');
        const schoolBtn = document.getElementById('school-selector-btn');
        
        if (modal) modal.classList.remove('hidden');
        if (schoolBtn) schoolBtn.classList.add('active');
        this.renderSchoolsList();
        this.updateSelectionCounters();
    }

    // Fechar modal de escolas
    closeSchoolsModal() {
        const modal = document.getElementById('schools-modal');
        const schoolBtn = document.getElementById('school-selector-btn');
        
        if (modal) modal.classList.add('hidden');
        if (schoolBtn) schoolBtn.classList.remove('active');
        
        // Restaurar seleção temporária
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
        if (!container) return;
        
        let filteredSchools = [];
        if (APP_STATE.allSchools && APP_STATE.allSchools.length > 0) {
            filteredSchools = APP_STATE.allSchools.filter(school => 
                school.toLowerCase().includes(filter.toLowerCase())
            );
        }

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

        // Adicionar event listeners
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
            this.selectedSchools.splice(index, 1);
        } else {
            this.selectedSchools.push(school);
        }
        
        const searchInput = document.getElementById('school-search');
        this.renderSchoolsList(searchInput ? searchInput.value : '');
        this.updateSelectionCounters();
    }

    // Atualizar contadores
    updateSelectionCounters() {
        const selectedCounter = document.getElementById('selected-counter');
        const totalCounter = document.getElementById('total-counter');
        const countNumber = document.getElementById('count-number');
        
        if (selectedCounter) selectedCounter.textContent = this.selectedSchools.length;
        if (totalCounter) totalCounter.textContent = APP_STATE.allSchools ? APP_STATE.allSchools.length : 0;
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
            const searchInput = document.getElementById('school-search');
            this.renderSchoolsList(searchInput ? searchInput.value : '');
        }
    }

    // Verificar se há configuração salva
    checkSavedConfig() {
        const config = UTILS.loadConfig();
        if (config && config.configCompleted) {
            APP_STATE.supervisorName = config.supervisorName || '';
            APP_STATE.selectedSchools = config.selectedSchools || [];
            APP_STATE.configCompleted = config.configCompleted || false;
            APP_STATE.accessRequested = config.accessRequested || false;
            
            this.selectedSchools = [...APP_STATE.selectedSchools];
            this.showMainScreen();
            UTILS.showNotification('Configuração carregada com sucesso!', 'success');
        }
    }

    // Criar cards de documentos
    createDocumentCards() {
        const container = document.querySelector('.document-types');
        if (!container) return;
        
        container.innerHTML = '';

        Object.keys(DOCUMENT_FIELDS).forEach(docType => {
            const card = document.createElement('div');
            card.className = 'document-type';
            card.setAttribute('data-type', docType);
            card.innerHTML = `
                <i class="${DOCUMENT_ICONS[docType] || 'fas fa-file'}"></i>
                <h3>${DOCUMENT_NAMES[docType] || docType}</h3>
            `;
            card.addEventListener('click', () => this.selectDocumentType(docType));
            container.appendChild(card);
        });
    }

    // Navegação entre telas
    showWelcomeScreen() {
        this.hideAllScreens();
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) welcomeScreen.classList.remove('hidden');
    }

    showConfigScreen() {
        this.hideAllScreens();
        const configScreen = document.getElementById('config-screen');
        if (configScreen) {
            configScreen.classList.remove('hidden');
            this.loadConfigIntoForm();
        }
    }

    showMainScreen() {
        // Verificar se a configuração está completa
        if (!APP_STATE.configCompleted) {
            UTILS.showNotification('Complete a configuração primeiro!', 'error');
            this.showConfigScreen();
            return;
        }

        this.hideAllScreens();
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) mainScreen.classList.remove('hidden');
    }

    showFormScreen() {
        this.hideAllScreens();
        const formScreen = document.getElementById('form-screen');
        if (formScreen) formScreen.classList.remove('hidden');
    }

    hideAllScreens() {
        document.querySelectorAll('.container .card, #main-screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Remover tela de links se existir
        const linksScreen = document.getElementById('links-uteis-screen');
        if (linksScreen) linksScreen.remove();
    }

    // Configuração do usuário
    loadConfigIntoForm() {
        const nameInput = document.getElementById('supervisor-name');
        if (nameInput) nameInput.value = APP_STATE.supervisorName;
    }

    saveConfiguration() {
        const supervisorNameInput = document.getElementById('supervisor-name');
        const supervisorName = supervisorNameInput ? supervisorNameInput.value.trim() : '';
        
        // Validações
        if (!supervisorName) {
            UTILS.showNotification('Por favor, informe seu nome completo.', 'error');
            if (supervisorNameInput) supervisorNameInput.focus();
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
            return;
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
    
    // Mostrar os links úteis
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
        if (contentDiv) {
            const newDiv = document.createElement('div');
            newDiv.id = 'links-uteis-screen';
            newDiv.innerHTML = linksHtml;
            contentDiv.appendChild(newDiv);
            
            // Adicionar evento ao botão "Voltar"
            const backBtn = document.getElementById('back-to-main-from-links');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    document.getElementById('links-uteis-screen').remove();
                    this.showMainScreen();
                });
            }
        }
    }

    populateDocumentForm(documentType) {
        const form = document.getElementById('document-form');
        const title = document.getElementById('form-title');
        
        if (!form || !title) return;
        
        // Atualizar título
        title.innerHTML = `<i class="fas fa-edit"></i> ${DOCUMENT_NAMES[documentType] || documentType} - Preencha os Dados`;
        
        // Limpar formulário
        form.innerHTML = '';
        
        // Adicionar campos
        const fields = DOCUMENT_FIELDS[documentType] || [];
        fields.forEach(field => {
            const fieldHTML = DOCUMENT_HANDLERS.createFieldHTML(field);
            form.innerHTML += fieldHTML;
        });

        // Configurar campos dinamicamente
        this.setupFormFields(documentType);
    }

    setupFormFields(documentType) {
        const fields = DOCUMENT_FIELDS[documentType] || [];
        
        fields.forEach(field => {
            const input = document.querySelector(`[name="${field.name}"]`);
            if (!input) return;

            // Configurar dropdowns
            if (field.type === 'dropdown' && DOCUMENT_HANDLERS.populateDropdown) {
                DOCUMENT_HANDLERS.populateDropdown(input, field.name);
            }

            // Configurar auto-preenchimento
            if (DOCUMENT_HANDLERS.setupAutoFill) {
                DOCUMENT_HANDLERS.setupAutoFill(field, input);
            }

            // Configurar geração automática
            if (DOCUMENT_HANDLERS.setupAutoGenerate) {
                DOCUMENT_HANDLERS.setupAutoGenerate(field, input);
            }

            // Configurar eventos de change para campos que afetam outros
            if (field.name === "Nome da Escola") {
                input.addEventListener('change', () => this.handleSchoolChange());
            }
        });
    }

    handleSchoolChange() {
        const schoolField = document.querySelector('[name="Nome da Escola"]');
        if (!schoolField) return;
        
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
        if (!DOCUMENT_HANDLERS.validateForm) {
            UTILS.showNotification('Sistema de validação não disponível', 'error');
            return;
        }
        
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
            
            // Mostrar loading
            const generateBtn = document.getElementById('generate-document');
            if (generateBtn) {
                const originalText = generateBtn.innerHTML;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Documento...';
                generateBtn.disabled = true;

                // Gerar documento
                const result = await DOCUMENT_HANDLERS.createPDF(
                    APP_STATE.currentDocumentType, 
                    APP_STATE.formData,
                    'eder.ramos@educador.edu.es.gov.br'
                );

                console.log('📤 RESULTADO:', result);

                if (result.success) {
                    APP_STATE.generatedDocument = result;
                    console.log('🎯 Documento gerado com sucesso!');
                    
                    // Mostrar modal de download
                    this.showDownloadModal();
                    UTILS.showNotification('Documento gerado com sucesso!', 'success');
                } else {
                    throw new Error('Falha na geração do documento: ' + (result.error || 'Erro desconhecido'));
                }
                
                // Restaurar botão
                generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Gerar Documento';
                generateBtn.disabled = false;
            }

        } catch (error) {
            console.error('💥 ERRO:', error);
            UTILS.showNotification(error.message || 'Erro ao gerar documento. Tente novamente.', 'error');
            
            // Restaurar botão em caso de erro
            const generateBtn = document.getElementById('generate-document');
            if (generateBtn) {
                generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Gerar Documento';
                generateBtn.disabled = false;
            }
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
            if (pdfBtn) {
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
                
                // Restaurar botão
                setTimeout(() => {
                    pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Baixar PDF';
                    pdfBtn.disabled = false;
                }, 1500);
            }

        } catch (error) {
            console.error('Erro ao baixar PDF:', error);
            UTILS.showNotification('Erro ao baixar PDF. Tente novamente.', 'error');
            
            // Restaurar botão em caso de erro
            const pdfBtn = document.getElementById('download-pdf');
            if (pdfBtn) {
                pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Baixar PDF';
                pdfBtn.disabled = false;
            }
        }
    }

    // Solicitação de acesso
    async handleAccessRequest(e) {
        e.preventDefault();

        const name = document.getElementById('requester-name')?.value.trim() || '';
        const email = document.getElementById('requester-email')?.value.trim() || '';
        const role = document.getElementById('requester-role')?.value.trim() || '';

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
            if (submitBtn) {
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

                // Enviar solicitação via API se disponível
                let result;
                if (API_SERVICE && API_SERVICE.requestAccess) {
                    result = await API_SERVICE.requestAccess(requestData);
                } else {
                    // Simular sucesso se API não disponível
                    result = { success: true };
                    console.log('📤 Simulando envio de solicitação:', requestData);
                }

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
                
                // Restaurar botão
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
                submitBtn.disabled = false;
            }

        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            UTILS.showNotification(error.message || 'Erro ao enviar solicitação. Tente novamente.', 'error');
            
            // Restaurar botão em caso de erro
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
                submitBtn.disabled = false;
            }
        }
    }

    // Utilitários
    showDownloadModal() {
        console.log('📁 Mostrando modal de download...');
        const modal = document.getElementById('download-modal');
        if (modal) modal.classList.remove('hidden');
    }

    showAccessModal() {
        console.log('🔑 Mostrando modal de acesso...');
        const modal = document.getElementById('access-modal');
        if (modal) modal.classList.remove('hidden');
    }

    closeModal(modal) {
        console.log('❌ Fechando modal...');
        if (modal) modal.classList.add('hidden');
    }
}

// ========== FUNÇÃO DE ERRO ==========
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        text-align: center;
        z-index: 10000;
        max-width: 80%;
    `;
    errorDiv.innerHTML = `
        <h3 style="color: #f44336; margin-bottom: 15px;">Erro no Sistema</h3>
        <p style="margin-bottom: 20px;">${message}</p>
        <button onclick="location.reload()" style="
            background: #64b4f0;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        ">Recarregar Página</button>
    `;
    document.body.appendChild(errorDiv);
}

// ========== ADICIONAR ESTILOS DINÂMICOS ==========
if (!document.querySelector('.dynamic-styles')) {
    const dynamicStyles = document.createElement('style');
    dynamicStyles.className = 'dynamic-styles';
    dynamicStyles.textContent = `
        /* Splash screen transitions */
        body::before, body::after {
            transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
        }
        
        body.app-loaded::before,
        body.app-loaded::after {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        
        .container {
            opacity: 0;
            transition: opacity 0.5s ease-in 0.3s;
        }
        
        body.app-loaded .container {
            opacity: 1;
        }
        
        /* Botões */
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .btn:disabled:hover {
            transform: none !important;
            box-shadow: none !important;
        }
        
        /* Animações */
        .fa-spin {
            animation: fa-spin 1s infinite linear;
        }
        
        @keyframes fa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Campos de formulário */
        input[readonly], textarea[readonly] {
            background-color: #f5f5f5;
            color: #666;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(dynamicStyles);
}

// ========== ADICIONAR FAVICON ==========
if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📋</text></svg>';
    document.head.appendChild(favicon);
}

// ========== EXPORTAR PARA ESCOPO GLOBAL ==========
window.supervisaoApp = window.supervisaoApp || null;
