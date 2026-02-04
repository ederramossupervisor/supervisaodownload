// ✅ INSTÂNCIA DO SERVIÇO DE API
const API_SERVICE = new ApiService();

// Definição dos campos para cada tipo de documento
const DOCUMENT_FIELDS = {
    cuidador: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola",
            autoFill: {
                field: "Nome do Município",
                source: "school",
                property: "city"
            }
        },
        { 
            name: "Nome do Município", 
            type: "text", 
            required: true, 
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Nome do Supervisor", 
            type: "text", 
            required: true, 
            autoFill: {
                source: "config",
                property: "supervisorName"
            },
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Data", 
            type: "date", 
            required: true,
            defaultValue: "today"
        },
        { 
    name: "Número do Ofício", 
    type: "text", 
    required: true,
    placeholder: "Ex.: 013",
    
},
        { 
            name: "Nome do(a) Aluno(a)", 
            type: "text", 
            required: true,
            placeholder: "Digite o nome completo do aluno"
        },
        { 
            name: "Série", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a série",
            autoFill: {
                field: "Etapa de Ensino",
                source: "serie",
                property: "etapa"
            }
        },
        { 
            name: "Etapa de Ensino", 
            type: "text", 
            required: true,
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Diagnóstico", 
            type: "textarea", 
            required: true,
            placeholder: "Descreva o diagnóstico do aluno"
        },
        { 
            name: "CID", 
            type: "text", 
            required: true,
            placeholder: "Ex: F84.0"
        }
    ],

    justificativa: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola"
        },
        { 
            name: "Função", 
            type: "text", 
            required: true,
            placeholder: "Ex: Professor de Matemática"
        },
        { 
            name: "Nome indicado", 
            type: "text", 
            required: true,
            placeholder: "Digite o nome do indicado"
        },
        { 
            name: "Número Funcional", 
            type: "text", 
            required: true,
            placeholder: "Digite o número funcional"
        },
        { 
            name: "Nome do Supervisor", 
            type: "text", 
            required: true,
            autoFill: {
                source: "config",
                property: "supervisorName"
            },
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Data", 
            type: "date", 
            required: true,
            defaultValue: "today"
        }
    ],

    parecer: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola",
            autoFill: {
                field: "Nome do Município",
                source: "school",
                property: "city"
            }
        },
        { 
            name: "Nome do Município", 
            type: "text", 
            required: true,
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Nome do Diretor", 
            type: "text", 
            required: true,
            readOnly: true,
            placeholder: "Preenchido automaticamente",
            autoFill: {
                source: "school",
                property: "director"
            }
        },
        { 
            name: "Função", 
            type: "text", 
            required: true,
            placeholder: "Ex.: Professor de História"
        },
        { 
            name: "Motivo da contratação", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione o motivo"
        },
        { 
            name: "Oferta", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a oferta"
        },
        { 
            name: "Nome indicado", 
            type: "text", 
            required: true,
            placeholder: "Digite o nome do indicado"
        },
        { 
            name: "Componente Curricular", 
            type: "text", 
            required: true,
            placeholder: "Ex: Matemática"
        },
        { 
            name: "Formação", 
            type: "text", 
            required: true,
            placeholder: "Ex.: Licenciatura em Língua Portuguesa"
        },
        { 
            name: "Nome do Supervisor", 
            type: "text", 
            required: true,
            autoFill: {
                source: "config",
                property: "supervisorName"
            },
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        }
    ],

    regularizacao_aee: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola",
            autoFill: {
                field: "Nome do Município",
                source: "school",
                property: "city"
            }
        },
        { 
            name: "Nome do Município", 
            type: "text", 
            required: true,
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Data", 
            type: "date", 
            required: true,
            defaultValue: "today"
        },
        { 
            name: "Número do Ofício", 
            type: "text", 
            required: true,
            placeholder: "Ex.: 027"
            
        },
        { 
            name: "Data do Ofício", 
            type: "date", 
            required: true,
            placeholder: "Data do ofício original"
        },
        { 
            name: "Nome do(a) Aluno(a)", 
            type: "text", 
            required: true,
            placeholder: "Digite o nome completo do aluno"
        },
        { 
            name: "Série", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a série",
            autoFill: {
                field: "Etapa de Ensino",
                source: "serie",
                property: "etapa"
            }
        },
        { 
            name: "Etapa de Ensino", 
            type: "text", 
            required: true,
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Diagnóstico", 
            type: "textarea", 
            required: true,
            placeholder: "Descreva o diagnóstico do aluno"
        },
        { 
            name: "CID", 
            type: "text", 
            required: true,
            placeholder: "Ex: F84.0"
        }
    ],

    viagem_pedagogica: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola"
        },
        { 
            name: "Nome do Supervisor", 
            type: "text", 
            required: true,
            autoFill: {
                source: "config",
                property: "supervisorName"
            },
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Data", 
            type: "date", 
            required: true,
            defaultValue: "today"
        },
        { 
            name: "Nome do Projeto", 
            type: "text", 
            required: true,
            placeholder: "Digite o nome do projeto"
        },
        { 
            name: "Local de Visitação", 
            type: "text", 
            required: true,
            placeholder: "Ex.: Ruínas da Igreja de São José de Queimado"
        }
    ],

    manifestacao: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola"
        },
        { 
            name: "Nome do Supervisor", 
            type: "text", 
            required: true,
            autoFill: {
                source: "config",
                property: "supervisorName"
            },
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Data", 
            type: "date", 
            required: true,
            defaultValue: "today"
        },
        { 
            name: "Relato", 
            type: "textarea", 
            required: true,
            placeholder: "Descreva detalhadamente a manifestação",
            rows: 6
        },
        { 
            name: "Número da Manifestação", 
            type: "text", 
            required: true,
            placeholder: "Digite o número da manifestação"
        }
    ],

    eletivas: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola"
        },
        { 
            name: "Nome do Supervisor", 
            type: "text", 
            required: true,
            autoFill: {
                source: "config",
                property: "supervisorName"
            },
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Data", 
            type: "date", 
            required: true,
            defaultValue: "today"
        },
        { 
            name: "Nome das Eletivas", 
            type: "textarea", 
            required: true,
            placeholder: "Liste as eletivas oferecidas",
            rows: 4
        },
        { 
            name: "Número Edocs", 
            type: "text", 
            required: true,
            placeholder: "Ex.: 2025-00XXX0"
        }
    ],

    projeto: [
        { 
            name: "Nome da Escola", 
            type: "dropdown", 
            required: true,
            placeholder: "Selecione a escola"
        },
        { 
            name: "Nome do Supervisor", 
            type: "text", 
            required: true,
            autoFill: {
                source: "config",
                property: "supervisorName"
            },
            readOnly: true,
            placeholder: "Preenchido automaticamente"
        },
        { 
            name: "Data", 
            type: "date", 
            required: true,
            defaultValue: "today"
        },
        { 
            name: "Nome do Projeto", 
            type: "text", 
            required: true,
            placeholder: "Digite o nome do projeto"
        }
        
    ],
     localizacao_provisoria: [
    { 
        name: "Nome da Escola",  // ✅ Escola de Interesse - SAME PLACEHOLDER
        type: "dropdown", 
        required: true,
        placeholder: "Selecione a ESCOLA DE INTERESSE (nova localização)",
        options: "Nome da Escola",
        autoFill: {
            field: "Nome do Município",  // ✅ Município da Escola de Interesse
            source: "school",
            property: "city"
        }
    },
    { 
        name: "Nome do Município",  // ✅ Município da Escola de Interesse - SAME PLACEHOLDER
        type: "text", 
        required: true,
        readOnly: true,
        placeholder: "Município preenchido automaticamente"
    },
    { 
        name: "Nome indicado",  // ✅ Correto
        type: "text", 
        required: true,
        placeholder: "Digite o nome completo do professor"
    },
    { 
        name: "Número Funcional",  // ✅ Correto
        type: "text", 
        required: true,
        placeholder: "Digite o número funcional do professor"
    },
    { 
        name: "Nome da Escola Atual",  // ⚠️ IMPORTANTE: Campo NOVO para escola atual
        type: "dropdown", 
        required: true,
        placeholder: "Selecione a ESCOLA ATUAL do professor",
        options: "Nome da Escola",
        autoFill: {
            field: "Nome do Município Atual",  // Campo novo para município atual
            source: "school",
            property: "city"
        }
    },
    { 
        name: "Nome do Município Atual",  // ⚠️ IMPORTANTE: Campo NOVO para município atual
        type: "text", 
        required: true,
        readOnly: true,
        placeholder: "Município atual preenchido automaticamente"
    },
    { 
        name: "Data",  // ✅ Correto
        type: "date", 
        required: true,
        defaultValue: "today",
        placeholder: "Data do documento"
    },
    { 
        name: "Nome do Supervisor",  // ✅ Correto
        type: "text", 
        required: true,
        autoFill: {
            source: "config",
            property: "supervisorName"
        },
        readOnly: true,
        placeholder: "Preenchido automaticamente"
    }
],
    links_uteis: [
        // Este array fica vazio porque não teremos campos de formulário
        // Só teremos botões com links
    ]
};

// Mapeamento de série para etapa de ensino
const SERIE_TO_ETAPA = {
    // Anos Iniciais
    "1º ano": "Ensino Fundamental - Anos Iniciais",
    "2º ano": "Ensino Fundamental - Anos Iniciais", 
    "3º ano": "Ensino Fundamental - Anos Iniciais",
    "4º ano": "Ensino Fundamental - Anos Iniciais",
    "5º ano": "Ensino Fundamental - Anos Iniciais",
    
    // Anos Finais
    "6º ano": "Ensino Fundamental - Anos Finais",
    "7º ano": "Ensino Fundamental - Anos Finais",
    "8º ano": "Ensino Fundamental - Anos Finais", 
    "9º ano": "Ensino Fundamental - Anos Finais",
    
    // Ensino Médio
    "1ª série": "Ensino Médio",
    "2ª série": "Ensino Médio",
    "3ª série": "Ensino Médio"
};

// Funções específicas para manipulação de documentos
const DOCUMENT_HANDLERS = {
    // ✅ FUNÇÃO ATUALIZADA PARA SUPORTAR ATRIBUTOS
createFieldHTML: function(field) {
    const fieldId = `field-${field.name.replace(/\s+/g, '-').toLowerCase()}`;
    let fieldHTML = '';
    
    // Construir atributos adicionais
    let additionalAttributes = '';
    if (field.attributes) {
        Object.keys(field.attributes).forEach(attr => {
            additionalAttributes += ` ${attr}="${field.attributes[attr]}"`;
        });
    }

    switch (field.type) {
        case 'dropdown':
            fieldHTML = `
                <select id="${fieldId}" name="${field.name}" 
                        ${field.required ? 'required' : ''}
                        ${additionalAttributes}
                        class="form-field dropdown-field">
                    <option value="">${field.placeholder || `Selecione ${field.name}`}</option>
                </select>
            `;
            break;

        case 'textarea':
            fieldHTML = `
                <textarea id="${fieldId}" name="${field.name}" 
                          ${field.required ? 'required' : ''}
                          ${field.readOnly ? 'readonly' : ''}
                          ${additionalAttributes}
                          rows="${field.rows || 4}"
                          placeholder="${field.placeholder || ''}"
                          class="form-field textarea-field">${field.defaultValue || ''}</textarea>
            `;
            break;

        case 'date':
            const defaultValue = field.defaultValue === 'today' ? 
                new Date().toISOString().split('T')[0] : 
                (field.defaultValue || '');
            
            fieldHTML = `
                <input type="date" id="${fieldId}" name="${field.name}" 
                       ${field.required ? 'required' : ''}
                       ${field.readOnly ? 'readonly' : ''}
                       ${additionalAttributes}
                       value="${defaultValue}"
                       placeholder="${field.placeholder || ''}"
                       class="form-field date-field">
            `;
            break;

        default:
            fieldHTML = `
                <input type="${field.type}" id="${fieldId}" name="${field.name}" 
                       ${field.required ? 'required' : ''}
                       ${field.readOnly ? 'readonly' : ''}
                       ${additionalAttributes}
                       value="${field.defaultValue || ''}"
                       placeholder="${field.placeholder || ''}"
                       class="form-field text-field">
            `;
    }

    return `
        <div class="form-group field-group" data-field-name="${field.name}">
            <label for="${fieldId}">
                ${field.name} 
                ${field.required ? '<span class="required-asterisk">*</span>' : ''}
            </label>
            ${fieldHTML}
            ${field.autoGenerate ? '<small class="field-hint">Este campo será gerado automaticamente</small>' : ''}
        </div>
    `;
},
    // Preencher opções de dropdown
    populateDropdown: function(selectElement, fieldName) {
        const options = DROPDOWN_OPTIONS[fieldName] || [];
        
        // Limpar opções existentes (exceto a primeira)
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }

        // Adicionar novas opções
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });

        // Se for dropdown de escolas, filtrar pelas escolas selecionadas na configuração
        if (fieldName === "Nome da Escola" && APP_STATE.selectedSchools.length > 0) {
            Array.from(selectElement.options).forEach(option => {
                if (option.value && !APP_STATE.selectedSchools.includes(option.value)) {
                    option.style.display = 'none';
                }
            });
        }
    },

    // Configurar auto-preenchimento de campos
    setupAutoFill: function(field, inputElement) {
        if (!field.autoFill) return;

        const autoFillConfig = field.autoFill;

        if (autoFillConfig.source === 'config') {
            // Preencher com dados da configuração
            if (autoFillConfig.property === 'supervisorName') {
                inputElement.value = APP_STATE.supervisorName;
            }
        } else if (autoFillConfig.source === 'school' && autoFillConfig.field) {
            // Configurar evento para quando escola for selecionada
            const schoolField = document.querySelector(`[name="${autoFillConfig.field}"]`);
            if (schoolField) {
                schoolField.addEventListener('change', function() {
                    const selectedSchool = UTILS.getSchoolData(this.value);
                    if (selectedSchool) {
                        inputElement.value = selectedSchool[autoFillConfig.property];
                    }
                });
            }
        } else if (autoFillConfig.source === 'serie' && autoFillConfig.field) {
            // Configurar evento para quando série for selecionada
            inputElement.addEventListener('change', function() {
                const etapaField = document.querySelector(`[name="${autoFillConfig.field}"]`);
                if (etapaField && this.value) {
                    const etapa = SERIE_TO_ETAPA[this.value] || '';
                    etapaField.value = etapa;
                }
            });
        }
    },

    // Configurar geração automática de campos
    setupAutoGenerate: function(field, inputElement) {
        if (!field.autoGenerate) return;

        if (field.name === "Número do Ofício") {
            inputElement.value = UTILS.generateOfficeNumber();
            inputElement.title = "Número gerado automaticamente";
        }
    },

    // Validar formulário completo
    validateForm: function(documentType) {
        const fields = DOCUMENT_FIELDS[documentType];
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            if (field.required) {
                const input = document.querySelector(`[name="${field.name}"]`);
                if (!input || !input.value.trim()) {
                    isValid = false;
                    errors.push(`${field.name} é obrigatório`);
                    
                    // Destacar campo com erro
                    if (input) {
                        input.classList.add('field-error');
                        setTimeout(() => {
                            input.classList.remove('field-error');
                        }, 3000);
                    }
                }
            }
        });

        return {
            isValid: isValid,
            errors: errors
        };
    },

    // Coletar dados do formulário
    collectFormData: function(documentType) {
        const formData = {};
        const fields = DOCUMENT_FIELDS[documentType];

        fields.forEach(field => {
            const input = document.querySelector(`[name="${field.name}"]`);
            if (input) {
                formData[field.name] = input.value.trim();
            }
        });

        return formData;
    },

    // Gerar conteúdo do documento (simulação)
    generateDocumentContent: function(documentType, formData) {
        let content = `DOCUMENTO: ${DOCUMENT_NAMES[documentType]}\n\n`;
        content += "DADOS PREENCHIDOS:\n";
        content += "=".repeat(50) + "\n\n";

        const fields = DOCUMENT_FIELDS[documentType];
        fields.forEach(field => {
            content += `${field.name}: ${formData[field.name] || 'Não informado'}\n`;
        });

        content += "\n" + "=".repeat(50) + "\n";
        content += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
        content += `Sistema Supervisão - ${CONFIG.appName}`;

        return content;
    },

    // ✅ CORRIGIDO: Criar documento PDF real
    createPDF: async function(documentType, formData, userEmail) {
        try {
            // ✅ USA A INSTÂNCIA GLOBAL API_SERVICE
            const result = await API_SERVICE.generateDocument(documentType, formData, userEmail);
            
            if (result.success) {
                return {
                    success: true,
                    filename: `${DOCUMENT_NAMES[documentType]}_${new Date().getTime()}.pdf`,
                    url: result.pdfUrl,
                    documentUrl: result.documentUrl,
                    documentId: result.documentId
                };
            } else {
                throw new Error(result.error || 'Erro ao gerar PDF');
            }
        } catch (error) {
            console.error('Erro ao criar PDF:', error);
            throw error;
        }
    },

    // Criar documento DOCX real (documento editável)
    createDOCX: async function(documentType, formData, userEmail) {
        try {
            const result = await API_SERVICE.generateDocument(documentType, formData, userEmail);
            
            if (result.success) {
                return {
                    success: true,
                    filename: `${DOCUMENT_NAMES[documentType]}_${new Date().getTime()}.docx`, 
                    url: result.documentUrl, // URL do Google Docs (editável)
                    pdfUrl: result.pdfUrl,
                    documentId: result.documentId
                };
            } else {
                throw new Error(result.error || 'Erro ao gerar DOCX');
            }
        } catch (error) {
            console.error('Erro ao criar DOCX:', error);
            throw error;
        }
    },

    // Download de arquivo real (agora recebe URL)
    downloadFile: function(filename, url) {
        // Para Google Drive, abrimos em nova aba ou forçamos download
        const link = document.createElement('a');
        link.href = url;
        
        // Se for URL do Google Drive, adicionar parâmetro para forçar download
        if (url.includes('drive.google.com')) {
            // Converter URL de visualização para URL de download
            const fileId = url.match(/[-\w]{25,}/);
            if (fileId) {
                link.href = `https://drive.google.com/uc?export=download&id=${fileId[0]}`;
            }
        }
        
        link.download = filename;
        link.target = '_blank'; // Abrir em nova aba
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Função para forçar download do Google Drive
    forceGoogleDriveDownload: function(url, filename) {
        // Extrair ID do arquivo do Google Drive
        const match = url.match(/[-\w]{25,}/);
        if (match) {
            const fileId = match[0];
            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Fallback: abrir URL normal
            window.open(url, '_blank');
        }
    },

    // ✅ FUNÇÃO PARA LIMPAR FORMULÁRIO
    clearForm: function() {
        console.log('🧹 Limpando formulário...');
        const form = document.getElementById('document-form');
        if (form) {
            form.reset();
            console.log('✅ Formulário limpo!');
        }
        
        // Limpar também os dados do estado
        APP_STATE.formData = {};
        APP_STATE.currentDocumentType = "";
        APP_STATE.generatedDocument = null;
    }
};

// Adicionar estilos para campos com erro
if (!document.querySelector('.field-error-styles')) {
    const errorStyles = document.createElement('style');
    errorStyles.className = 'field-error-styles';
    errorStyles.textContent = `
        .field-error {
            border-color: #f44336 !important;
            box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2) !important;
            animation: shake 0.5s ease-in-out;
        }
        
        .required-asterisk {
            color: #f44336;
            margin-left: 4px;
        }
        
        .field-hint {
            display: block;
            margin-top: 5px;
            font-size: 0.8rem;
            color: var(--cinza-escuro);
            font-style: italic;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .field-group {
            position: relative;
        }
    `;
    document.head.appendChild(errorStyles);
}
