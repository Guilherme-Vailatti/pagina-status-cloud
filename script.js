function atualizarStatusServicos() {
    for (let key in localStorage) {
        if (key.startsWith('atualizacaoServico')) {
            let serviceData = JSON.parse(localStorage.getItem(key));
            let servicoId = serviceData.servicoId; 
            let status = serviceData.newStatus;

            updateMainPageStatus(servicoId, status);

            // Remover a atualização após ter sido aplicada
            localStorage.removeItem(key);
        }
    }
}

atualizarStatusServicos();

window.addEventListener('storage', function(event) {
    if (event.key.startsWith('atualizacaoServico')) {
        atualizarStatusServicos();
    }
});

function salvarStatusServico(servicoId, status) {
    let savedStatus = JSON.parse(localStorage.getItem('savedStatus')) || {};
    savedStatus[servicoId] = status;
    localStorage.setItem('savedStatus', JSON.stringify(savedStatus));
}

function updateMainPageStatus(servicoId, status) {
    let statusElement = document.getElementById(`statusServico${servicoId}`);
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = 'status ' + status.toLowerCase();
    } else {
        console.error(`Status não encontrado para o serviço ${servicoId}`);
    }
    
}

function loadSavedStatus() {
    let savedStatus = JSON.parse(localStorage.getItem('savedStatus')) || {};
    
    // Percorre todos os serviços
    for (let servicoId in savedStatus) {
        let status = savedStatus[servicoId];
        let dropdownContent = document.getElementById(`dropdownServico${servicoId}`);
        
        // Verifica se o dropdown correspondente ao serviço foi encontrado
        if (dropdownContent) {
            // Adiciona o status como uma opção no dropdown
            dropdownContent.innerHTML += `<p>${status}</p>`;
            // Atualiza o status na página principal (se necessário)
            updateMainPageStatus(servicoId, status);
        } else {
            console.error(`DropdownServico${servicoId} não encontrado.`);
        }
    }
}

window.addEventListener('statusUpdate', function(event) {
    loadSavedStatus();
});


function getStatusServico(servicoId) {
    return localStorage.getItem(`statusServico${servicoId}`);
}


document.addEventListener('DOMContentLoaded', function() {
    carregarOpcoesDropdown();
});

window.addEventListener('storage', function(event) {
    if (event.key === 'savedOptionsForClients') {
        carregarOpcoesDropdown();
    }
});

function carregarOpcoesDropdown() {
    // Obter as opções salvas especificamente para clientes
    let savedOptionsForClients = JSON.parse(localStorage.getItem('savedOptionsForClients')) || {};

    Object.keys(savedOptionsForClients).forEach(servicoId => {
        let opcoes = savedOptionsForClients[servicoId];
        let dropdown = document.getElementById(`dropdownServico${servicoId}`);
        if (dropdown) {
            // Limpa o dropdown antes de adicionar novos itens
            dropdown.innerHTML = '';
            opcoes.forEach(opcao => {
                let opcaoElemento = document.createElement('p');
                opcaoElemento.textContent = opcao;
                dropdown.appendChild(opcaoElemento);
            });
        }
    });
}



function atualizarDropdownServico(servicoId, selectedOption) {
    let dropdownServico = document.getElementById(`dropdownServico${servicoId}`);
    if (dropdownServico) {
        dropdownServico.innerHTML = `<p>${selectedOption}</p>`; // Define o conteúdo do dropdown com a opção selecionada
    } else {
        console.error(`DropdownServicoundefined não encontrado.`);
    }
}

window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'atualizarDropdown') {
        let servicoId = event.data.servicoId;
        let selectedOption = event.data.selectedOption;
        atualizarDropdownServico(servicoId, selectedOption);
    }
});


// Função para carregar e exibir os textos no dropdown da página principal
function carregarTextosDropdown() {
    // Verifica se há um texto personalizado armazenado
    let textoPersonalizado = localStorage.getItem('textoPersonalizado');
    
    // Se houver um texto personalizado, exibe-o no dropdown
    if (textoPersonalizado) {
        exibirTextoDropdown(textoPersonalizado);
    } else {
        // Caso contrário, verifica se há textos pré-definidos armazenados
        let textosPredefinidos = JSON.parse(localStorage.getItem('textosPredefinidos')) || [];
        
        // Se houver textos pré-definidos, exibe o primeiro no dropdown
        if (textosPredefinidos.length > 0) {
            exibirTextoDropdown(textosPredefinidos[0]);
        }
    }
}

// Função para exibir o texto no dropdown da página principal
function exibirTextoDropdown(texto) {
    let dropdownContent = document.getElementById('dropdownTextos');
    dropdownContent.innerHTML = `<p>${texto}</p>`;
}

// Função para atualizar o dropdown quando ocorrer uma alteração no armazenamento local
function atualizarDropdownAoAlterarLocalStorage(event) {
    // Verifica se a alteração foi relacionada aos status salvos
    if (event.key === 'savedStatus') {
        // Atualiza o dropdown com os novos status salvos
        carregarTextosDropdown();
    }

}

// Carrega os textos no dropdown ao carregar a página
carregarTextosDropdown();

// Adiciona um ouvinte de eventos para detectar alterações no armazenamento local
window.addEventListener('storage', atualizarDropdownAoAlterarLocalStorage);


loadSavedStatus();