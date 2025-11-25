// Configurações e dados do sistema
const CONFIG = {
    adminEmail: 'eder.ramos@educador.edu.es.gov.br',
    appName: 'Sistema Supervisão',
    version: '1.0.0',
    webAppUrl: 'https://script.google.com/macros/s/AKfycbwQtkEU1SN2oxDumCb-65oZb_f01eGVXKT2ij5y0hAvoL4zcgmxpDbQFligqBjMArwj/exec',
    adminEmails: ['eder.ramos@educador.edu.es.gov.br']
};

// Dados das escolas
const SCHOOLS_DATA = [
    { name: "CEEFMTI AFONSO CLÁUDIO", city: "Afonso Cláudio", director: "Allan Dyoni Dehete Many" },
    { name: "CEEFMTI ELISA PAIVA", city: "Conceição do Castelo", director: "Rosangela Vargas Davel Pinto" },
    { name: "EEEF DOMINGOS PERIM", city: "Venda Nova do Imigrante", director: "Maristela Broedel" },
    { name: "EEEFM ALTO RIO POSSMOSER", city: "Santa Maria de Jetibá", director: "Adriana da Conceição Tesch" },
    { name: "EEEFM ÁLVARO CASTELO", city: "Brejetuba", director: "Rose Fabrícia Moretto" },
    { name: "EEEFM ELVIRA BARROS", city: "Afonso Cláudio", director: "Andrea Gomes Klug" },
    { name: "EEEFM FAZENDA CAMPORÊS", city: "Brejetuba", director: "Emerson Ungarato" },
    { name: "EEEFM FAZENDA EMÍLIO SCHROEDER", city: "Santa Maria de Jetibá", director: "Jorge Schneider" },
    { name: "EEEFM FIORAVANTE CALIMAN", city: "Venda Nova do Imigrante", director: "Celina Januário Moreira" },
    { name: "EEEFM FREDERICO BOLDT", city: "Santa Maria de Jetibá", director: "David Felberg" },
    { name: "EEEFM GISELA SALLOKER FAYET", city: "Domingos Martins", director: "Maxwel Augusto Neves" },
    { name: "EEEFM GRAÇA ARANHA", city: "Santa Maria de Jetibá", director: "Camilo Pauli Dominicini" },
    { name: "EEEFM JOAQUIM CAETANO DE PAIVA", city: "Laranja da Terra", director: "Miriam Klitzke Seibel" },
    { name: "EEEFM JOSE CUPERTINO", city: "Afonso Cláudio", director: "Cléria Pagotto Ronchi Zanelato" },
    { name: "EEEFM JOSE GIESTAS", city: "Afonso Cláudio", director: "Gederson Vargas Dazilio" },
    { name: "EEEFM JOSÉ ROBERTO CHRISTO", city: "Afonso Cláudio", director: "Andressa Silva Dias" },
    { name: "EEEFM LEOGILDO SEVERIANO DE SOUZA", city: "Brejetuba", director: "Adalberto Carlos Araújo Chaves" },
    { name: "EEEFM LUIZ JOUFFROY", city: "Laranja da Terra", director: "Nilza Abel Gumz" },
    { name: "EEEFM MARIA DE ABREU ALVIM", city: "Afonso Cláudio", director: "Maria das Graças Fabio Costa" },
    { name: "EEEFM MARLENE BRANDÃO", city: "Brejetuba", director: "Paulynne Ayres Tatagiba Gonçalves" },
    { name: "EEEFM PEDRA AZUL", city: "Domingos Martins", director: "Elizabeth Drumond Ambrósio Filgueiras" },
    { name: "EEEFM PONTO DO ALTO", city: "Domingos Martins", director: "Marcelo Ribett" },
    { name: "EEEFM PROFª ALDY SOARES MERÇON VARGAS", city: "Conceição do Castelo", director: "Israel Augusto Moreira Borges" },
    { name: "EEEFM PROF HERMANN BERGER", city: "Santa Maria de Jetibá", director: "Eliane Raasch Bicalho" },
    { name: "EEEFM SÃO JORGE", city: "Brejetuba", director: "Jormi Maria da Silva" },
    { name: "EEEFM SÃO LUÍS", city: "Santa Maria de Jetibá", director: "Valdirene Mageski Cordeiro Magri" },
    { name: "EEEFM TEOFILO PAULINO", city: "Domingos Martins", director: "Delfina Schneider Stein" },
    { name: "EEEM FRANCISCO GUILHERME", city: "Santa Maria de Jetibá", director: "Jonatas André Drescher" },
    { name: "EEEM MATA FRIA", city: "Afonso Cláudio", director: "Jonatas André Drescher" },
    { name: "EEEM SOBREIRO", city: "Laranja da Terra", director: "Jonatas André Drescher" }
];

// Opções para campos dropdown
const DROPDOWN_OPTIONS = {
    "Nome da Escola": SCHOOLS_DATA.map(school => school.name),
    "Motivo da contratação": ["lista esgotada"],
    "Oferta": ["Regular", "EJA/Neeja", "Técnico"],
    "Série": [
        "1º ano", "2º ano", "3º ano", "4º ano", "5º ano", 
        "6º ano", "7º ano", "8º ano", "9º ano", 
        "1ª série", "2ª série", "3ª série"
    ]
};

// Ícones para cada tipo de documento
const DOCUMENT_ICONS = {
    cuidador: "fas fa-user-nurse",
    justificativa: "fas fa-file-signature",
    parecer: "fas fa-gavel",
    regularizacao_aee: "fas fa-universal-access",
    viagem_pedagogica: "fas fa-bus",
    manifestacao: "fas fa-comment-alt",
    eletivas: "fas fa-book-open",
    projeto: "fas fa-project-diagram"
};

// Nomes amigáveis para os documentos
const DOCUMENT_NAMES = {
    cuidador: "Cuidador",
    justificativa: "Justificativa",
    parecer: "Parecer",
    regularizacao_aee: "Regularização AEE",
    viagem_pedagogica: "Viagem Pedagógica",
    manifestacao: "Manifestação",
    eletivas: "Eletivas",
    projeto: "Projeto"
};

// Estado da aplicação
let APP_STATE = {
    supervisorName: "",
    selectedSchools: [],
    currentDocumentType: "",
    formData: {},
    hasAccess: false, 
    configCompleted: false,
    accessRequested: false,
    generatedDocument: null
};

// Funções de utilitário
const UTILS = {
    // Salvar configuração no localStorage
    saveConfig: function() {
        try {
            const config = {
                supervisorName: APP_STATE.supervisorName,
                selectedSchools: APP_STATE.selectedSchools,
                configCompleted: APP_STATE.configCompleted,
                accessRequested: APP_STATE.accessRequested,
                hasAccess: APP_STATE.hasAccess,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('supervisaoConfig', JSON.stringify(config));
            console.log('✅ Configuração salva no localStorage');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar configuração:', error);
            return false;
        }
    },

    // Carregar configuração do localStorage
    loadConfig: function() {
        try {
            const savedConfig = localStorage.getItem('supervisaoConfig');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                APP_STATE.supervisorName = config.supervisorName || "";
                APP_STATE.selectedSchools = config.selectedSchools || [];
                APP_STATE.configCompleted = config.configCompleted || false;
                APP_STATE.accessRequested = config.accessRequested || false;
                APP_STATE.hasAccess = config.hasAccess || false;
                console.log('✅ Configuração carregada do localStorage');
                return true;
            }
            console.log('ℹ️ Nenhuma configuração salva encontrada');
            return false;
        } catch (error) {
            console.error('❌ Erro ao carregar configuração:', error);
            return false;
        }
    },

    // Limpar configuração
    clearConfig: function() {
        try {
            localStorage.removeItem('supervisaoConfig');
            APP_STATE.supervisorName = "";
            APP_STATE.selectedSchools = [];
            APP_STATE.configCompleted = false;
            APP_STATE.accessRequested = false;
            APP_STATE.hasAccess = false;
            console.log('✅ Configuração limpa');
        } catch (error) {
            console.error('❌ Erro ao limpar configuração:', error);
        }
    },

    // Validar email institucional
    validateInstitutionalEmail: function(email) {
        return email.endsWith('@educador.edu.es.gov.br') || email.endsWith('@edu.es.gov.br');
    },

    // Formatar data para o padrão brasileiro
    formatDate: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    },

    // Gerar número de ofício automático (exemplo)
    generateOfficeNumber: function() {
        const now = new Date();
        const year = now.getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `OFÍCIO ${random}/${year}`;
    },

    // Obter dados de uma escola pelo nome
    getSchoolData: function(schoolName) {
        return SCHOOLS_DATA.find(school => school.name === schoolName) || null;
    },

    // Verificar se o usuário tem acesso aos templates
    checkTemplateAccess: function() {
        // ✅ CORREÇÃO: Administradores têm acesso imediato
        const userEmail = 'eder.ramos@educador.edu.es.gov.br';
        if (CONFIG.adminEmails && CONFIG.adminEmails.includes(userEmail)) {
            return true;
        }
        
        // Para outros usuários, verificar se solicitaram acesso
        return APP_STATE.accessRequested || APP_STATE.hasAccess;
    },

    // Mostrar notificação
    showNotification: function(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Adicionar estilos da notificação
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    border-left: 4px solid var(--azul);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { border-left-color: var(--verde); }
                .notification-error { border-left-color: #f44336; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification i { font-size: 1.2rem; }
                .notification-success i { color: var(--verde); }
                .notification-error i { color: #f44336; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
};

// Adicionar estilos para a animação de saída da notificação
if (!document.querySelector('.notification-animations')) {
    const animationStyles = document.createElement('style');
    animationStyles.className = 'notification-animations';
    animationStyles.textContent = `
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(animationStyles);
}
