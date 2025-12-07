class SupervisaoApp {
    constructor() {
        this.selectedSchools = [];
        this.initializeApp();
        this.bindEvents();
        this.checkSavedConfig();
    }

    initializeApp() {
        console.log(`${CONFIG.appName} v${CONFIG.version} inicializando...`);
        this.initSchoolSelector();
        this.createDocumentCards();
    }

    bindEvents() {
        document.getElementById('enter-btn').addEventListener('click', () => this.showConfigScreen());
        document.getElementById('back-to-welcome').addEventListener('click', () => this.showWelcomeScreen());
        document.getElementById('config-btn').addEventListener('click', () => this.showConfigScreen());
        document.getElementById('back-to-main').addEventListener('click', () => this.showMainScreen());
        document.getElementById('back-form').addEventListener('click', () => this.showMainScreen());

        document.getElementById('save-config').addEventListener('click', () => this.saveConfiguration());
        document.getElementById('request-access-btn').addEventListener('click', () => this.showAccessModal());

        document.getElementById('generate-document').addEventListener('click', () => this.generateDocument());

        document.getElementById('download-pdf').addEventListener('click', () => this.downloadPDF());
        document.getElementById('access-form').addEventListener('submit', (e) => this.handleAccessRequest(e));

        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    // SISTEMA DE SELEÇÃO DE ESCOLAS (mantido igual)
    initSchoolSelector() {
        const schoolBtn = document.getElementById('school-selector-btn');
        const schoolsModal = document.getElementById('schools-modal');
        const confirmBtn = document.getElementById('confirm-schools');
        const cancelBtn = document.getElementById('cancel-schools');
        const clearBtn = document.getElementById('clear-selection');
        const searchInput = document.getElementById('school-search');
        const closeBtn = schoolsModal.querySelector('.close');

        this.loadSchools();

        schoolBtn.addEventListener('click', () => this.openSchoolsModal());
        confirmBtn.addEventListener('click', () => this.confirmSchoolSelection());
        cancelBtn.addEventListener('click', () => this.closeSchoolsModal());
        clearBtn.addEventListener('click', () => this.clearSchoolSelection());
        closeBtn.addEventListener('click', () => this.closeSchoolsModal());
        searchInput.addEventListener('input', (e) => this.filterSchools(e.target.value));

        schoolsModal.addEventListener('click', (e) => {
            if (e.target === schoolsModal) {
                this.closeSchoolsModal();
            }
        });
    }

    loadSchools() {
        APP_STATE.allSchools = SCHOOLS_DATA.map(school => school.name);
        
        const savedConfig = UTILS.loadConfig();
        if (savedConfig && savedConfig.schools) {
            APP_STATE.selectedSchools = savedConfig.schools;
            this.selectedSchools = [...savedConfig.schools];
            this.updateSchoolSelectionDisplay();
        }
    }

    openSchoolsModal() {
        const modal = document.getElementById('schools-modal');
        const schoolBtn = document.getElementById('school-selector-btn');
        
        modal.classList.remove('hidden');
        schoolBtn.classList.add('active');
        this.renderSchoolsList();
        this.updateSelectionCounters();
    }

    closeSchoolsModal() {
        const modal = document.getElementById('schools-modal');
        const schoolBtn = document.getElementById('school-selector-btn');
        
        modal.classList.add('hidden');
        schoolBtn.classList.remove('active');
        this.selectedSchools = [...APP_STATE.selectedSchools];
    }

    confirmSchoolSelection() {
        APP_STATE.selectedSchools = [...this.selectedSchools];
        this.updateSchoolSelectionDisplay();
        this.closeSchoolsModal();
    }

    clearSchoolSelection() {
        this.selectedSchools = [];
        this.renderSchoolsList();
        this.updateSelectionCounters();
    }

    filterSchools(searchTerm) {
        this.renderSchoolsList(searchTerm);
    }

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

        container.querySelectorAll('.school-checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                const school = item.dataset.school;
                this.toggleSchoolSelection(school);
            });
        });
    }

    toggleSchoolSelection(school) {
        const index = this.selectedSchools.indexOf(school);
        
        if (index > -1) {
            this.selectedSchools.splice(index, 1);
        } else {
            this.selectedSchools.push(school);
        }
        
        this.renderSchoolsList(document.getElementById('school-search').value);
        this.updateSelectionCounters();
    }

    updateSelectionCounters() {
        const selectedCounter = document.getElementById('selected-counter');
        const totalCounter = document.getElementById('total-counter');
        const countNumber = document.getElementById('count-number');
        
        if (selectedCounter) selectedCounter.textContent = this.selectedSchools.length;
        if (totalCounter) totalCounter.textContent = APP_STATE.allSchools.length;
        if (countNumber) countNumber.textContent = this.selectedSchools.length;
    }

    updateSchoolSelectionDisplay() {
        const previewContainer = document.getElementById('selected-schools-preview');
        const selectorText = document.getElementById('school-selector-text');
        
        if (selectorText) {
            if (APP_STATE.selectedSchools.length === 0) {
                selectorText.textContent = 'Selecionar Escolas';
            } else if (APP_STATE.selectedSchools.length === 1) {
                selectorText.textContent = '1 escola selecionada';
            } else {
                selectorText.textContent = `${APP_STATE.selectedSchools.length} escolas selecionadas`;
            }
        }
        
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

    removeSchoolFromPreview(school) {
        const index = APP_STATE.selectedSchools.indexOf(school);
        if (index > -1) {
            APP_STATE.selectedSchools.splice(index, 1);
            this.selectedSchools.splice(index, 1);
            this.updateSchoolSelectionDisplay();
            this.renderSchoolsList(document.getElementById('school-search').value);
        }
    }

    checkSavedConfig() {
        if (UTILS.loadConfig() && APP_STATE.configCompleted) {
            this.showMainScreen();
            UTILS.showNotification('Configuração carregada com sucesso!', 'success');
        }
    }

    // ✅ MODIFICAÇÃO PRINCIPAL: CARD COM BOTÕES DIRETO
    createDocumentCards() {
        const container = document.querySelector('.document-types');
        container.innerHTML = '';

        Object.keys(DOCUMENT_FIELDS).forEach(docType => {
            const card = document.createElement('div');
            card.className = 'document-type';
            card.setAttribute('data-type', docType);
            
            // CASO ESPECIAL: LINKS ÚTEIS COM BOTÕES DIRETO NO CARD
            if (docType === 'links_uteis') {
                card.innerHTML = `
                    <div class="links-card-inner">
                        <div class="card-header">
                            <i class="${DOCUMENT_ICONS[docType]}"></i>
                            <h3>${DOCUMENT_NAMES[docType]}</h3>
                        </div>
                        <div class="card-links-container">
                            <p class="card-links-description">Acesso rápido aos sistemas:</p>
                            <div class="card-links-grid">
                                ${this.createCardLinks()}
                            </div>
                        </div>
                    </div>
                `;
                
                // Não adiciona evento de clique - os botões já estão visíveis
            } else {
                // Cards normais (abrem formulário)
                card.innerHTML = `
                    <i class="${DOCUMENT_ICONS[docType]}"></i>
                    <h3>${DOCUMENT_NAMES[docType]}</h3>
                `;
                card.addEventListener('click', () => this.selectDocumentType(docType));
            }
            
            container.appendChild(card);
        });
    }

    // ✅ NOVA FUNÇÃO: Criar botões dentro do card
    createCardLinks() {
        return Object.entries(USEFUL_LINKS).map(([nome, url]) => `
            <button class="card-link-btn" onclick="window.open('${url}', '_blank', 'noopener,noreferrer')" 
                    title="${url}">
                <i class="fas fa-external-link-alt"></i>
                <span>${nome}</span>
            </button>
        `).join('');
    }

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
        if (!APP_STATE.configCompleted) {
            UTILS.showNotification('Complete a configuração primeiro!', 'error');
            this.showConfigScreen();
            return;
        }

        this.hideAllScreens();
        document.getElementById('main-screen').classList.remove('hidden');
        document.getElementById('generate-document').classList.remove('hidden');
    }

    showFormScreen() {
        this.hideAllScreens();
        document.getElementById('form-screen').classList.remove('hidden');
        
        const generateBtn = document.getElementById('generate-document');
        if (generateBtn) {
            generateBtn.classList.remove('hidden');
        }
    }

    hideAllScreens() {
        document.querySelectorAll('.container .card, #main-screen').forEach(screen => {
            screen.classList.add('hidden');
        });
    }

    loadConfigIntoForm() {
        document.getElementById('supervisor-name').value = APP_STATE.supervisorName;
    }

    saveConfiguration() {
        const supervisorName = document.getElementById('supervisor-name').value.trim();
        
        if (!supervisorName) {
            UTILS.showNotification('Por favor, informe seu nome completo.', 'error');
            document.getElementById('supervisor-name').focus();
            return;
        }

        if (APP_STATE.selectedSchools.length === 0) {
            UTILS.showNotification('Selecione pelo menos uma escola.', 'error');
            return;
        }

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

    selectDocumentType(documentType) {
        console.log(`📄 Documento selecionado: ${documentType}`);
        
        // ✅ LINKS ÚTEIS: Não abre formulário (botões já estão no card)
        if (documentType === 'links_uteis') {
            UTILS.showNotification('Os links já estão disponíveis no card!', 'info');
            return;
        }
        
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
        DOCUMENT_HANDLERS.populateDocumentForm(documentType);
    }

    setupFormFields(documentType) {
        const fields = DOCUMENT_FIELDS[documentType];
        
        fields.forEach(field => {
            const input = document.querySelector(`[name="${field.name}"]`);
            if (!input) return;

            if (field.type === 'dropdown') {
                DOCUMENT_HANDLERS.populateDropdown(input, field.name);
            }

            DOCUMENT_HANDLERS.setupAutoFill(field, input);
            DOCUMENT_HANDLERS.setupAutoGenerate(field, input);

            if (field.name === "Nome da Escola") {
                input.addEventListener('change', () => this.handleSchoolChange());
            }
        });
    }

    handleSchoolChange() {
        const schoolField = document.querySelector('[name="Nome da Escola"]');
        const selectedSchool = UTILS.getSchoolData(schoolField.value);
        
        if (selectedSchool) {
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
        if (APP_STATE.currentDocumentType === 'links_uteis') {
            UTILS.showNotification('Esta funcionalidade não se aplica a Links Úteis.', 'info');
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

        APP_STATE.formData = DOCUMENT_HANDLERS.collectFormData(APP_STATE.currentDocumentType);

        try {
            console.log('🔧 === INICIANDO GERAÇÃO DE DOCUMENTO ===');
            console.log('📄 Tipo:', APP_STATE.currentDocumentType);
            console.log('📋 Dados:', APP_STATE.formData);
            
            const generateBtn = document.getElementById('generate-document');
            const originalText = generateBtn.innerHTML;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Documento...';
            generateBtn.disabled = true;

            const userEmail = 'eder.ramos@educador.edu.es.gov.br';
            console.log('📧 Email usado:', userEmail);
            console.log('🌐 Chamando API...');
            
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
                
                this.showDownloadModal();
                UTILS.showNotification('Documento gerado com sucesso!', 'success');
            } else {
                throw new Error('Falha na geração do documento: ' + (result.error || 'Erro desconhecido'));
            }

        } catch (error) {
            console.error('💥 ERRO COMPLETO:', error);
            UTILS.showNotification(error.message || 'Erro ao gerar documento. Tente novamente.', 'error');
        } finally {
            const generateBtn = document.getElementById('generate-document');
            generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Gerar Documento';
            generateBtn.disabled = false;
        }
    }

    async downloadPDF() {
        if (!APP_STATE.generatedDocument) {
            UTILS.showNotification('Nenhum documento gerado para download.', 'error');
            return;
        }

        try {
            const pdfBtn = document.getElementById('download-pdf');
            const originalText = pdfBtn.innerHTML;
            pdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Baixando...';
            pdfBtn.disabled = true;

            DOCUMENT_HANDLERS.downloadFile(
                APP_STATE.generatedDocument.filename,
                APP_STATE.generatedDocument.url
            );

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
            const pdfBtn = document.getElementById('download-pdf');
            pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Baixar PDF';
            pdfBtn.disabled = false;
        }
    }

    async handleAccessRequest(e) {
        e.preventDefault();

        const name = document.getElementById('requester-name').value.trim();
        const email = document.getElementById('requester-email').value.trim();
        const role = document.getElementById('requester-role').value.trim();

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

            const result = await API_SERVICE.requestAccess(requestData);

            if (result.success) {
                UTILS.showNotification('Solicitação enviada com sucesso! O administrador será notificado.', 'success');
                this.closeModal(document.getElementById('access-modal'));
                document.getElementById('access-form').reset();
                
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Verificando carregamento dos scripts...');
    
    setTimeout(() => {
        if (typeof DOCUMENT_FIELDS === 'undefined') {
            console.error('❌ DOCUMENT_FIELDS não carregado!');
            console.log('📋 Scripts carregados:', {
                CONFIG: typeof CONFIG,
                SCHOOLS_DATA: typeof SCHOOLS_DATA, 
                DOCUMENT_FIELDS: typeof DOCUMENT_FIELDS,
                ApiService: typeof ApiService
            });
            return;
        }
        
        if (typeof ApiService === 'undefined') {
            console.error('❌ ApiService não carregado!');
            return;
        }
        
        console.log('✅ Todos os scripts carregados - Iniciando aplicação...');
        window.supervisaoApp = new SupervisaoApp();
                   
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

                input[readonly], textarea[readonly] {
                    background-color: var(--cinza-claro);
                    color: var(--cinza-escuro);
                    cursor: not-allowed;
                }
                
                .hidden {
                    display: none !important;
                }
            `;
            document.head.appendChild(dynamicStyles);
        }
    }, 500);
});
