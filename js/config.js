// Configurações e dados do sistema
const CONFIG = {
    adminEmail: 'eder.ramos@educador.edu.es.gov.br',
    appName: 'Sistema Supervisão',
    version: '1.0.0',
    webAppUrl: '// ⚙️ CONFIGURAÇÕES DO SISTEMA SUPERVISÃO
const CONFIG = {
  adminEmail: 'eder.ramos@educador.edu.es.gov.br',
  
  // 📝 IDs DOS TEMPLATES DO GOOGLE DOCS
  templates: {
    justificativa: '1xvyzC4I8mgyr7aB6-6a-yXnHCi8Y2xR5Lguc52oghh8',
    cuidador: '1VuVvEs1CH85Mu3MlXfc4zm4AmTKhg_KdFKFzLnRmBYQ',
    eletivas: '1lpfaeheN1QllsDeURg1n5mYOuu51fLBfsWzTs7myyFw',
    manifestacao: '1l8_HzQG967QIUgTmNY9bZbkZ36X03d9R5lISlUmc5bE',
    parecer: '1qTV1vMv-s7o2QNsfKbt2NBpHd_BT1C9zG8aqZ2_AIO0',
    projeto: '1n71xrQqbqSJDFl0PK6ppkUEKZqpfFwaueTqfc0fWI3k',
    regularizacao_aee: '1y2cyJsyYRhEntSEF7vrfHDKZSMjJ8ae270ofJcNWVPA',
    viagem_pedagogica: '1OEUYL-_htSNadXhn-5xWqupYCxO6KchVk2FbIx8eV0o'
  },
  
  admins: ['eder.ramos@educador.edu.es.gov.br'],
  authorizedUsers: [] // Será preenchido automaticamente
};

function doPost(e) {
  console.log('📨 Recebida requisição POST');
  
  let response;
  
  try {
    const request = JSON.parse(e.postData.contents);
    const { action, userEmail } = request;
    
    console.log(`🔧 Ação: ${action}, Usuário: ${userEmail}`);
    
    switch (action) {
      // ✅ ADICIONAR ESTE CASE
      case 'test':
        response = { 
          success: true, 
          message: '✅ API Online - Conectado com sucesso!',
          timestamp: new Date().toISOString(),
          version: '2.0.0'
        };
        break;
      // ↑↑↑ ADICIONAR ACIMA ↑↑↑
        
      case 'generateDocument':
        response = generateDocument(request);
        break;
      case 'requestAccess':
        response = processAccessRequest(request);
        break;
      case 'checkAccess':
        response = { hasAccess: hasAccess(userEmail) };
        break;
      default:
        response = { success: false, error: 'Ação não reconhecida: ' + action };
    }
    
  } catch (error) {
    console.error('💥 Erro:', error);
    response = {
      success: false,
      error: 'Erro interno: ' + error.message
    };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// 🔍 ENDPOINT GET PARA TESTE
function doGet(e) {
  const response = {
    status: '✅ API Online - Sistema Supervisão',
    version: '2.0.0',
    admin: CONFIG.adminEmail,
    timestamp: new Date().toISOString()
  };
  
  // ✅ CORREÇÃO: Sem setHeaders
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
// 🚀 GERAR DOCUMENTO
function generateDocument(request) {
  try {
    const { documentType, formData, userEmail } = request;
    
    // 🔐 VERIFICAR ACESSO
    if (!hasAccess(userEmail)) {
      return {
        success: false,
        error: 'Acesso não autorizado. Solicite acesso ao administrador.'
      };
    }
    
    const templateId = CONFIG.templates[documentType];
    if (!templateId) {
      return { success: false, error: 'Template não encontrado' };
    }
    
    // 📝 CRIAR CÓPIA DO TEMPLATE
    const templateFile = DriveApp.getFileById(templateId);
    const docName = `${documentType}_${new Date().getTime()}_${userEmail.split('@')[0]}`;
    const newDoc = templateFile.makeCopy(docName);
    
    // ✅ COMPARTILHAR DOCUMENTO
    newDoc.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const doc = DocumentApp.openById(newDoc.getId());
    const body = doc.getBody();
    
    // 🔄 SUBSTITUIR PLACEHOLDERS
    replacePlaceholders(body, formData);
    doc.saveAndClose();
    
    // 📄 GERAR PDF
    const pdfBlob = newDoc.getAs('application/pdf');
    const pdfFile = DriveApp.createFile(pdfBlob).setName(`${docName}.pdf`);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      documentId: newDoc.getId(),
      documentUrl: newDoc.getUrl(),
      pdfUrl: pdfFile.getUrl(),
      filename: `${docName}.pdf`,
      message: 'Documento gerado com sucesso!'
    };
    
  } catch (error) {
    console.error('❌ Erro ao gerar documento:', error);
    return {
      success: false,
      error: 'Erro ao gerar documento: ' + error.message
    };
  }
}

// 🔄 SUBSTITUIR PLACEHOLDERS
function replacePlaceholders(body, formData) {
  const replacements = {
    '{{Nome da Escola}}': formData['Nome da Escola'],
    '{{Nome do Município}}': formData['Nome do Município'],
    '{{Nome do Supervisor}}': formData['Nome do Supervisor'],
    '{{Data}}': formatDate(formData['Data']),
    '{{Número do Ofício}}': formData['Número do Ofício'],
    '{{Nome do\\(a\\) Aluno\\(a\\)}}': formData['Nome do(a) Aluno(a)'],
    '{{Série}}': formData['Série'],
    '{{Etapa de Ensino}}': formData['Etapa de Ensino'],
    '{{Diagnóstico}}': formData['Diagnóstico'],
    '{{CID}}': formData['CID'],
    '{{Função}}': formData['Função'],
    '{{Nome indicado}}': formData['Nome indicado'],
    '{{Número Funcional}}': formData['Número Funcional'],
    '{{Nome do Diretor}}': formData['Nome do Diretor'],
    '{{Motivo da contratação}}': formData['Motivo da contratação'],
    '{{Oferta}}': formData['Oferta'],
    '{{Componente Curricular}}': formData['Componente Curricular'],
    '{{Formação}}': formData['Formação'],
    '{{Data do Ofício}}': formatDate(formData['Data do Ofício']),
    '{{Nome do Projeto}}': formData['Nome do Projeto'],
    '{{Local de Visitação}}': formData['Local de Visitação'],
    '{{Relato}}': formData['Relato'],
    '{{Número da Manifestação}}': formData['Número da Manifestação'],
    '{{Nome das Eletivas}}': formData['Nome das Eletivas'],
    '{{Número Edocs}}': formData['Número Edocs']
  };
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    if (value) {
      try {
        body.replaceText(placeholder, value);
      } catch (e) {
        console.warn(`⚠️ Erro ao substituir ${placeholder}`);
      }
    }
  }
}

// 📅 FORMATAR DATA
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return Utilities.formatDate(date, 'America/Sao_Paulo', 'dd/MM/yyyy');
  } catch (e) {
    return dateString;
  }
}

// 🔐 VERIFICAR ACESSO
function hasAccess(userEmail) {
  if (!userEmail) return false;
  
  // ✅ ADMINISTRADORES
  if (CONFIG.admins.includes(userEmail)) return true;
  
  // ✅ EMAILS INSTITUCIONAIS
  const isInstitutional = userEmail.endsWith('@educador.edu.es.gov.br') || 
                         userEmail.endsWith('@edu.es.gov.br');
  if (!isInstitutional) return false;
  
  // ✅ USUÁRIOS AUTORIZADOS
  return CONFIG.authorizedUsers.includes(userEmail);
}

// 📧 PROCESSAR SOLICITAÇÃO DE ACESSO
function processAccessRequest(request) {
  const { name, email, role } = request;
  
  // ✅ ADICIONAR À LISTA DE AUTORIZADOS
  if (!CONFIG.authorizedUsers.includes(email)) {
    CONFIG.authorizedUsers.push(email);
  }
  
  // 📧 ENVIAR EMAIL DE CONFIRMAÇÃO
  const subject = '✅ Acesso Concedido - Sistema Supervisão';
  const body = `Olá ${name},\n\nSeu acesso ao Sistema Supervisão foi concedido!\n\nAgora você pode gerar documentos oficiais.\n\nAtenciosamente,\nSistema Supervisão`;
  
  try {
    MailApp.sendEmail(email, subject, body);
    return {
      success: true,
      message: 'Acesso concedido! Verifique seu email.'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao enviar email: ' + error.message
    };
  }
}

// 🧪 FUNÇÃO DE TESTE
function testAPI() {
  const testData = {
    action: 'test',
    userEmail: 'eder.ramos@educador.edu.es.gov.br'
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  console.log('🧪 Teste API:', result.getContent());
  return result;
}
function testarConexao() {
  const url = 'https://script.google.com/macros/s/AKfycbwJSnD7vWGli6cz20O088ze9pV0zztNJnTEhxcvx0dezfGeTOlVUPpCRg5KbV7-7ISt/exec';
  
  const payload = {
    action: 'test',
    userEmail: 'eder.ramos@educador.edu.es.gov.br'
  };
  
  const options = {
    method: 'POST',
    payload: JSON.stringify(payload),
    contentType: 'application/json'
  };
  
  const response = UrlFetchApp.fetch(url, options);
  console.log('✅ Resposta:', response.getContentText());
  return response.getContentText();
}',
    adminEmails: ['eder.ramos@educador.edu.es.gov.br', 'seu-email@edu.es.gov.br']
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

// Templates disponíveis (URLs dos Google Docs)
const TEMPLATES = {
    justificativa: "https://docs.google.com/document/d/1xvyzC4I8mgyr7aB6-6a-yXnHCi8Y2xR5Lguc52oghh8/edit",
    cuidador: "https://docs.google.com/document/d/1VuVvEs1CH85Mu3MlXfc4zm4AmTKhg_KdFKFzLnRmBYQ/edit",
    eletivas: "https://docs.google.com/document/d/1lpfaeheN1QllsDeURg1n5mYOuu51fLBfsWzTs7myyFw/edit",
    manifestacao: "https://docs.google.com/document/d/1l8_HzQG967QIUgTmNY9bZbkZ36X03d9R5lISlUmc5bE/edit",
    parecer: "https://docs.google.com/document/d/1qTV1vMv-s7o2QNsfKbt2NBpHd_BT1C9zG8aqZ2_AIO0/edit",
    projeto: "https://docs.google.com/document/d/1n71xrQqbqSJDFl0PK6ppkUEKZqpfFwaueTqfc0fWI3k/edit",
    regularizacao_aee: "https://docs.google.com/document/d/1y2cyJsyYRhEntSEF7vrfHDKZSMjJ8ae270ofJcNWVPA/edit",
    viagem_pedagogica: "https://docs.google.com/document/d/1OEUYL-_htSNadXhn-5xWqupYCxO6KchVk2FbIx8eV0o/edit"
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
    accessRequested: false
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
        const userEmail = 'eder.ramos@educador.edu.es.gov.br'; // Em produção, pegar do usuário logado
        if (CONFIG.adminEmails && CONFIG.adminEmails.includes(userEmail)) {
            return true;
        }
        
        // Para outros usuários, verificar se solicitaram acesso
        return APP_STATE.accessRequested || APP_STATE.hasAccess;
    },

    // Enviar solicitação de acesso
    sendAccessRequest: function(requestData) {
        // Em produção, isso enviaria um email para o administrador
        console.log('Solicitação de acesso enviada:', requestData);
        
        // Simular envio bem-sucedido
        return new Promise((resolve) => {
            setTimeout(() => {
                // Aqui enviaria um email para CONFIG.adminEmail
                console.log(`Email enviado para ${CONFIG.adminEmail} com os dados da solicitação`);
                resolve(true);
            }, 1000);
        });
    },

    // Gerar documento (simulação)
    generateDocument: function(documentType, formData) {
        console.log(`Gerando documento: ${documentType}`, formData);
        
        // Em produção, isso se conectaria ao Google Apps Script
        // para preencher o template e gerar o documento
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const documentId = 'doc_' + Date.now();
                resolve({
                    success: true,
                    documentId: documentId,
                    pdfUrl: `#${documentId}_pdf`,
                    docxUrl: `#${documentId}_docx`,
                    message: 'Documento gerado com sucesso'
                });
            }, 2000);
        });
    },

    // Download de arquivo simulado
    simulateDownload: function(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
