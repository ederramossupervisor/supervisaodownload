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
        name: "Escola de Interesse",  
        type: "dropdown", 
        required: true,
        placeholder: "Selecione a escola de interesse",
        options: "Escola de Interesse", 
        autoFill: {
            field: "Município da Escola de Interesse",  // ✅ Nome corrigido
            source: "school", 
            property: "city"
        }
    },
    { 
        name: "Município da Escola de Interesse",  // ✅ Nome corrigido
        type: "text", 
        required: true,
        readOnly: true,
        placeholder: "Cidade preenchida automaticamente"
    },
    { 
        name: "Nome do Professor",  // ✅ Nome corrigido (era "Nome do professor")
        type: "text", 
        required: true,
        placeholder: "Digite o nome completo do professor"
    },
    { 
        name: "Número Funcional",  
        type: "text", 
        required: true,
        placeholder: "Digite o número funcional do professor"
    },
    { 
        name: "Nome da Escola",  // ✅ Escola atual (mantém o nome padrão)
        type: "text", 
        required: true,
        placeholder: "Digite o nome da escola atual do professor"
    },
    { 
        name: "Nome do Município",  // ✅ Cidade da escola atual (mantém o nome padrão)
        type: "text", 
        required: true,
        placeholder: "Digite a cidade da escola atual"
    },
    { 
        name: "Data",  
        type: "date", 
        required: true,
        defaultValue: "today",
        placeholder: "Data do documento"
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
    atividade_pesquisa: [
    { 
        name: "Nome do Projeto",  // ✅ Campo para nome do projeto
        type: "text", 
        required: true,
        placeholder: "Digite o nome do projeto"
    },
    { 
        name: "Nome da Escola",  // ✅ Dropdown de escolas
        type: "dropdown", 
        required: true,
        placeholder: "Selecione a escola",
        autoFill: {
            field: "Nome do Município",  // Se quiser preencher cidade automaticamente
            source: "school",
            property: "city"
        }
    },
    { 
        name: "Nome do Município",  // ✅ Cidade da escola (opcional)
        type: "text", 
        required: false,
        readOnly: true,
        placeholder: "Cidade preenchida automaticamente"
    },
    { 
        name: "Etapa de Ensino",  // ✅ Dropdown de etapas
        type: "dropdown", 
        required: true,
        placeholder: "Selecione a etapa de ensino"
    },
    { 
        name: "Data",  // ✅ Data do documento
        type: "date", 
        required: true,
        defaultValue: "today",
        placeholder: "Data do documento"
    },
    { 
        name: "Nome do Supervisor",  // ✅ Supervisor (auto)
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
    pca: [
    { 
        name: "Nome do Professor",  // ✅ Nome do professor
        type: "text", 
        required: true,
        placeholder: "Digite o nome completo do professor"
    },
    { 
        name: "Número Funcional",  // ✅ Número funcional
        type: "text", 
        required: true,
        placeholder: "Digite o número funcional"
    },
    { 
        name: "Área do Conhecimento",  // ✅ Dropdown de áreas
        type: "dropdown", 
        required: true,
        placeholder: "Selecione a área do conhecimento"
    },
    { 
        name: "Nome da Escola",  // ✅ Dropdown de escolas
        type: "dropdown", 
        required: true,
        placeholder: "Selecione a escola"
    },
    { 
        name: "Data",  // ✅ Data do documento
        type: "date", 
        required: true,
        defaultValue: "today",
        placeholder: "Data do documento"
    },
    { 
        name: "Nome do Supervisor",  // ✅ Supervisor (auto)
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
    coordenacao_escolar: [
    {
        name: "Número do Processo",
        type: "text",
        required: true,
        placeholder: "Ex.: 2026-NQ15FP"
    },
    {
        name: "Nome da Escola",
        type: "dropdown",
        required: true,
        placeholder: "Selecione a escola"
        // (sem autoFill de município, pois o texto não exige cidade)
    },
    {
        name: "Nome do Servidor",
        type: "text",
        required: true,
        placeholder: "Digite o nome completo do(a) servidor(a)"
    },
    {
        name: "Turno",
        type: "dropdown",
        required: true,
        placeholder: "Selecione o turno"
    },
    {
        name: "Data",
        type: "date",
        required: true,
        defaultValue: "today"
    },
    {
        name: "Supervisor Escolar",
        type: "text",
        required: true,
        readOnly: true,
        autoFill: {
            source: "config",
            property: "supervisorName"
        },
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

    // ✅ Preencher opções de dropdown - VERSÃO CORRIGIDA
    populateDropdown: function(selectElement, fieldName) {
        console.log(`🔍 Populando dropdown: ${fieldName}`);
        
        const options = DROPDOWN_OPTIONS[fieldName] || [];
        console.log(`📋 Opções disponíveis para ${fieldName}:`, options.length);
        
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

        // ✅ ATUALIZADO: Filtrar para QUALQUER dropdown de escola
        const escolaFields = ["Nome da Escola", "Escola de Interesse"];
        if (escolaFields.includes(fieldName) && APP_STATE.selectedSchools.length > 0) {
            console.log(`🎯 Filtrando ${fieldName} por escolas selecionadas:`, APP_STATE.selectedSchools);
            
            Array.from(selectElement.options).forEach(option => {
                if (option.value && !APP_STATE.selectedSchools.includes(option.value)) {
                    option.style.display = 'none';
                }
            });
        }
        
        console.log(`✅ Dropdown ${fieldName} populado com ${options.length} opções`);
    },

    // ✅ Configurar auto-preenchimento de campos - VERSÃO CORRIGIDA
    setupAutoFill: function(field, inputElement) {
        if (!field.autoFill) return;

        const autoFillConfig = field.autoFill;
        
        console.log(`🔍 Configurando auto-fill para: ${field.name}`);
        console.log(`📋 Configuração:`, autoFillConfig);

        if (autoFillConfig.source === 'config') {
            // Preencher com dados da configuração
            if (autoFillConfig.property === 'supervisorName') {
                inputElement.value = APP_STATE.supervisorName || '';
                console.log(`✅ Preenchido ${field.name}: ${inputElement.value}`);
            }
            
        } else if (autoFillConfig.source === 'school' && autoFillConfig.field) {
            // ✅ CORREÇÃO: O inputElement é o SELECT (Escola de Interesse)
            // O autoFillConfig.field é o campo DESTINO (Escola de Interesse (Cidade))
            
            console.log(`🎯 Escola: ${field.name} → Cidade: ${autoFillConfig.field}`);
            
            // Adicionar evento de change ao SELECT (inputElement)
            inputElement.addEventListener('change', function() {
                console.log(`🔄 Escola alterada: ${this.value}`);
                
                const selectedSchool = UTILS.getSchoolData(this.value);
                console.log(`📋 Dados da escola:`, selectedSchool);
                
                if (selectedSchool) {
                    // Encontrar o campo de cidade pelo nome exato
                    const targetFieldName = autoFillConfig.field;
                    const targetInput = document.querySelector(`[name="${targetFieldName}"]`);
                    
                    console.log(`📍 Procurando campo: ${targetFieldName}`, targetInput);
                    
                    if (targetInput) {
                        targetInput.value = selectedSchool[autoFillConfig.property] || '';
                        console.log(`✅ Auto-preenchido: ${targetFieldName} = ${targetInput.value}`);
                    } else {
                        console.warn(`⚠️ Campo de destino não encontrado: ${targetFieldName}`);
                    }
                } else {
                    console.warn(`⚠️ Escola não encontrada: ${this.value}`);
                }
            });
            
            // ✅ PREENCHER IMEDIATAMENTE SE JÁ HOUVER VALOR
            if (inputElement.value) {
                console.log(`⚡ Preenchendo valor inicial: ${inputElement.value}`);
                const selectedSchool = UTILS.getSchoolData(inputElement.value);
                if (selectedSchool) {
                    const targetInput = document.querySelector(`[name="${autoFillConfig.field}"]`);
                    if (targetInput) {
                        targetInput.value = selectedSchool[autoFillConfig.property] || '';
                        console.log(`✅ Preenchido inicialmente: ${targetInput.value}`);
                    }
                }
            }
            
        } else if (autoFillConfig.source === 'serie' && autoFillConfig.field) {
            // Configurar evento para quando série for selecionada
            console.log(`🎯 Série: ${field.name} → Etapa: ${autoFillConfig.field}`);
            
            inputElement.addEventListener('change', function() {
                const etapaField = document.querySelector(`[name="${autoFillConfig.field}"]`);
                if (etapaField && this.value) {
                    const etapa = SERIE_TO_ETAPA[this.value] || '';
                    etapaField.value = etapa;
                    console.log(`✅ Etapa preenchida: ${etapa}`);
                }
            });
            
            // Preencher imediatamente se já houver valor
            if (inputElement.value) {
                const etapaField = document.querySelector(`[name="${autoFillConfig.field}"]`);
                if (etapaField && inputElement.value) {
                    const etapa = SERIE_TO_ETAPA[inputElement.value] || '';
                    etapaField.value = etapa;
                }
            }
        }
        
        console.log(`✅ Auto-fill configurado para: ${field.name}`);
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
