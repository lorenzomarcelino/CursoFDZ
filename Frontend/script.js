document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://localhost:3000'; // Ajuste para a URL do seu servidor backend
    let cursos = [];

    function carregarCursos() {
        fetch(`${baseUrl}/dados`)
            .then(response => response.json())
            .then(dados => {
                cursos = dados;
                exibirCursos();
            })
            .catch(error => {
                console.error('Erro ao carregar cursos:', error);
            });
    }

    function exibirCursos() {
        const moduloContainer = document.getElementById('moduloContainer');
        moduloContainer.innerHTML = ''; // Limpar conteúdo
        // Supondo que cada curso é único e é um objeto dentro de cursos
        cursos.forEach(curso => {
            const divModulo = document.createElement('div');
            divModulo.className = 'modulo';
            divModulo.textContent = curso['Módulo'];
            divModulo.onclick = () => exibirAulas(curso['Módulo']);
            moduloContainer.appendChild(divModulo);
        });
    }

    function exibirAulas(nomeModulo) {
        const aulaContainer = document.getElementById('aulaContainer');
        const moduloContainer = document.getElementById('moduloContainer');
        moduloContainer.style.display = 'none'; // Esconde módulos
        aulaContainer.style.display = 'flex'; // Mostra aulas

        const aulasDoModulo = cursos.filter(curso => curso['Módulo'] === nomeModulo);
        aulaContainer.innerHTML = ''; // Limpar aulas anteriores
        aulasDoModulo.forEach(aula => {
            const divAula = document.createElement('div');
            divAula.className = 'aula';
            divAula.innerHTML = `
                <h4>${aula['Nome da Aula']}</h4>
                <p>Andamento: ${aula['Minuto Parado']}</p>
                <p>Assistida: ${aula['Assistida (Sim/Não)']}</p>
                <button onclick="editarAula('${aula['Nome da Aula']}')">Editar</button>
            `;
            aulaContainer.appendChild(divAula);
        });
    }

    window.editarAula = function(nomeAula) {
        const aulaParaEditar = cursos.find(aula => aula['Nome da Aula'] === nomeAula);
        if (aulaParaEditar) {
            const formHtml = `
                <div class="editForm">
                    <h2>Editando: ${nomeAula}</h2>
                    <label for="assistida">Assistida (Sim/Não):</label>
                    <select id="assistida" name="assistida">
                        <option value="Sim" ${aulaParaEditar['Assistida (Sim/Não)'] === 'Sim' ? 'selected' : ''}>Sim</option>
                        <option value="Não" ${aulaParaEditar['Assistida (Sim/Não)'] === 'Não' ? 'selected' : ''}>Não</option>
                    </select>
                    <label for="minutoParado">Minuto Parado:</label>
                    <input type="text" id="minutoParado" name="minutoParado" value="${aulaParaEditar['Minuto Parado'] || ''}">
                    <button onclick="salvarEdicao('${nomeAula}')">Salvar</button>
                </div>
            `;
            document.getElementById('aulaContainer').innerHTML = formHtml;
        }
    };

    window.salvarEdicao = function(nomeAula) {
        const aulaParaEditar = cursos.find(aula => aula['Nome da Aula'] === nomeAula);
        if (aulaParaEditar) {
            aulaParaEditar['Assistida (Sim/Não)'] = document.getElementById('assistida').value;
            aulaParaEditar['Minuto Parado'] = document.getElementById('minutoParado').value;
            
            fetch(`${baseUrl}/atualizar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aulaParaEditar),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Falha ao salvar a edição.');
            })
            .then(() => {
                alert('Aula atualizada com sucesso!');
                carregarCursos(); // Recarregar a lista de cursos
            })
            .catch(error => {
                alert(error.message);
            });
        }
    };

    carregarCursos(); // Iniciar carregamento dos cursos
});
