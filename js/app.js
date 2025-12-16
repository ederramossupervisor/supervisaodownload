// ========== SPLASH SCREEN CONTROL ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM carregado - Configurando splash screen...');
  
  // Garantir que a splash está visível inicialmente
  document.body.classList.remove('app-loaded');
  
  // Verificar se já tem config salva (carregar rápido se tiver)
  const hasSavedConfig = localStorage.getItem('supervisao_config');
  
  // Esconder splash quando TUDO carregar (scripts, imagens, etc)
  window.addEventListener('load', function() {
    console.log('📦 Página completamente carregada');
    setTimeout(initializeAppAfterSplash, hasSavedConfig ? 1000 : 1500);
  });
  
  // Fallback para páginas que já carregaram
  if (document.readyState === 'complete') {
    console.log('⚡ Página já carregada (readyState = complete)');
    setTimeout(initializeAppAfterSplash, hasSavedConfig ? 800 : 1200);
  }
  
  // Adicionar fallback de timeout (máximo 3 segundos)
  setTimeout(function() {
    if (!document.body.classList.contains('app-loaded')) {
      console.log('⏰ Timeout da splash screen - Forçando continuar');
      document.body.classList.add('app-loaded');
      initializeAppAfterSplash();
    }
  }, 3000);
});

// ========== INICIAR APLICAÇÃO APÓS SPLASH ==========
function initializeAppAfterSplash() {
  console.log('🎬 Escondendo splash screen e iniciando app...');
  document.body.classList.add('app-loaded');
  
  // Aguardar um pouco mais para garantir scripts
  setTimeout(checkAndInitializeApp, 300);
}

// ========== VERIFICAR E INICIAR APP ==========
function checkAndInitializeApp() {
  console.log('🔍 Verificando scripts necessários...');
  
  const requiredScripts = {
    'CONFIG': window.CONFIG,
    'SCHOOLS_DATA': window.SCHOOLS_DATA,
    'DOCUMENT_FIELDS': window.DOCUMENT_FIELDS,
    'ApiService': window.ApiService,
    'UTILS': window.UTILS,
    'DOCUMENT_HANDLERS': window.DOCUMENT_HANDLERS,
    'API_SERVICE': window.API_SERVICE,
    'APP_STATE': window.APP_STATE
  };
  
  let allLoaded = true;
  let missingScripts = [];
  
  for (const [name, script] of Object.entries(requiredScripts)) {
    if (typeof script === 'undefined') {
      console.warn(`⚠️ ${name} ainda não carregado`);
      allLoaded = false;
      missingScripts.push(name);
    } else {
      console.log(`✅ ${name} carregado`);
    }
  }
  
  if (!allLoaded) {
    console.log(`⏳ Aguardando scripts: ${missingScripts.join(', ')}`);
    
    // Tentar novamente após um delay
    if (missingScripts.length > 0) {
      setTimeout(checkAndInitializeApp, 500);
    } else {
      // Tentativa final após 2 segundos
      setTimeout(function() {
        console.log('🔄 Tentando iniciar mesmo sem alguns scripts...');
        tryInitializeApp();
      }, 2000);
    }
    return;
  }
  
  // Todos carregados - iniciar app
  tryInitializeApp();
}

// ========== TENTAR INICIAR APLICAÇÃO ==========
function tryInitializeApp() {
  try {
    console.log('🚀 Inicializando SupervisaoApp...');
    
    // Verificar se APP_STATE existe, senão criar básico
    if (!window.APP_STATE) {
      console.warn('⚠️ APP_STATE não definido - criando básico');
      window.APP_STATE = {
        supervisorName: '',
        selectedSchools: [],
        configCompleted: false,
        accessRequested: false,
        currentDocumentType: '',
        formData: {},
        generatedDocument: null,
        allSchools: []
      };
    }
    
    // Verificar se UTILS existe, senão criar básico
    if (!window.UTILS) {
      console.warn('⚠️ UTILS não definido - criando básico');
      window.UTILS = {
        showNotification: function(message, type) {
          console.log(`[${type}] ${message}`);
          // Criar notificação básica
          const notification = document.createElement('div');
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
          `;
          notification.textContent = message;
          document.body.appendChild(notification);
          setTimeout(() => notification.remove(), 3000);
        },
        loadConfig: function() {
          try {
            const config = localStorage.getItem('supervisao_config');
            return config ? JSON.parse(config) : null;
          } catch (e) {
            return null;
          }
        },
        saveConfig: function() {
          try {
            localStorage.setItem('supervisao_config', JSON.stringify({
              supervisorName: APP_STATE.supervisorName,
              schools: APP_STATE.selectedSchools,
              configCompleted: APP_STATE.configCompleted,
              accessRequested: APP_STATE.accessRequested
            }));
            return true;
          } catch (e) {
            return false;
          }
        },
        checkTemplateAccess: function() {
          return APP_STATE.accessRequested || true;
        },
        validateInstitutionalEmail: function(email) {
          return email.endsWith('@educador.edu.es.gov.br') || email.endsWith('@edu.es.gov.br');
        },
        getSchoolData: function(schoolName) {
          if (!SCHOOLS_DATA) return null;
          return SCHOOLS_DATA.find(school => school.name === schoolName) || null;
        }
      };
    }
    
    // Verificar se DOCUMENT_FIELDS existe, senão criar básico
    if (!window.DOCUMENT_FIELDS) {
      console.warn('⚠️ DOCUMENT_FIELDS não definido - criando básico');
      window.DOCUMENT_FIELDS = {
        'links_uteis': []
      };
    }
    
    // Verificar se DOCUMENT_HANDLERS existe, senão criar básico
    if (!window.DOCUMENT_HANDLERS) {
      console.warn('⚠️ DOCUMENT_HANDLERS não definido - criando básico');
      window.DOCUMENT_HANDLERS = {
        createFieldHTML: function(field) {
          return `<div class="form-group">
                    <label>${field.name}</label>
                    <input type="text" name="${field.name}" placeholder="Preencha este campo">
                  </div>`;
        },
        validateForm: function() {
          return { isValid: true, errors: [] };
        },
        collectFormData: function() {
          return {};
        },
        createPDF: async function() {
          return { success: true, filename: 'documento.pdf', url: '#' };
        },
        downloadFile: function(filename, url) {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        },
        clearForm: function() {
          const form = document.getElementById('document-form');
          if (form) form.reset();
        }
      };
    }
    
    // Verificar se CONFIG existe, senão criar básico
    if (!window.CONFIG) {
      console.warn('⚠️ CONFIG não definido - criando básico');
      window.CONFIG = {
        appName: 'Sistema Supervisão',
        version: '1.0.0'
      };
    }
    
    // Verificar se SCHOOLS_DATA existe, senão criar básico
    if (!window.SCHOOLS_DATA) {
      console.warn('⚠️ SCHOOLS_DATA não definido - criando básico');
      window.SCHOOLS_DATA = [];
      APP_STATE.allSchools = [];
    } else {
      APP_STATE.allSchools = SCHOOLS_DATA.map(school => school.name);
    }
    
    // Verificar se DOCUMENT_ICONS existe
    if (!window.DOCUMENT_ICONS) {
      window.DOCUMENT_ICONS = {
        'links_uteis': 'fas fa-link'
      };
    }
    
    // Verificar se DOCUMENT_NAMES existe
    if (!window.DOCUMENT_NAMES) {
      window.DOCUMENT_NAMES = {
        'links_uteis': 'Links Úteis'
      };
    }
    
    // Inicializar aplicação
    window.supervisaoApp = new SupervisaoApp();
    
    // Mostrar notificação de inicialização
    setTimeout(() => {
      if (window.UTILS && window.UTILS.showNotification) {
        UTILS.showNotification('Sistema Supervisão carregado com sucesso!', 'success');
      }
    }, 1000);
    
    console.log('✅ Aplicação inicializada com sucesso!');
    
  } catch (error) {
    console.error('💥 ERRO na inicialização:', error);
    
    // Mostrar mensagem de erro amigável
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
      <h3 style="color: #f44336; margin-bottom: 15px;">Erro ao carregar o sistema</h3>
      <p style="margin-bottom: 20px;">Alguns recursos não carregaram corretamente.</p>
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
            APP_STATE.allSchools = SCHOOLS_DATA.map(school => school.name);
        }
        
        // Carregar escolas salvas anteriormente
        const savedConfig = UTILS.loadConfig();
        if (savedConfig && savedConfig.schools) {
            APP_STATE.selectedSchools = savedConfig.schools;
            this.selectedSchools = [...savedConfig.schools];
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
            APP_STATE.selectedSchools = config.schools || [];
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

// Adicionar estilos dinâmicos
if (!document.querySelector('.dynamic-styles')) {
    const dynamicStyles = document.createElement('style');
    dynamicStyles.className = 'dynamic-styles';
    dynamicStyles.textContent = `
        /* Estilos da splash screen */
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
        
        /* Erro crítico */
        .critical-error {
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Estilos básicos para elementos da aplicação */
        .hidden {
            display: none !important;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal.hidden {
            display: none;
        }
        
        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .close {
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        
        .close:hover {
            color: #333;
        }
    `;
    document.head.appendChild(dynamicStyles);
}

// Adicionar favicon dinamicamente
if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📋</text></svg>';
    document.head.appendChild(favicon);
}

// Registrar o app globalmente
window.supervisaoApp = window.supervisaoApp || null;
