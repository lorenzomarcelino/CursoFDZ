document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://localhost:3000';
    let cursos = [];

    window.mostrarProgresso = function() {
        mostrarSeção('progressoContainer');
        exibirProgresso();
    };

    window.mostrarCursos = function() {
        mostrarSeção('cursosContainer');
        exibirCursos();
    };

    window.adicionarCurso = function() {
        mostrarSeção('adicionarCursoContainer');
        // Implemente a lógica para adicionar curso aqui
    };

    window.adicionarAula = function() {
        mostrarSeção('adicionarAulaContainer');
        // Implemente a lógica para adicionar aula aqui
    };

    function mostrarSeção(seção) {
        const todasSecoes = ['progressoContainer', 'cursosContainer', 'moduloContainer', 'aulaContainer', 'adicionarCursoContainer', 'adicionarAulaContainer'];
        todasSecoes.forEach(id => {
            document.getElementById(id).style.display = (id === seção) ? 'block' : 'none';
        });
    }

    function carregarCursos() {
        fetch(`${baseUrl}/dados`)
            .then(response => response.json())
            .then(dados => {
                cursos = dados;
                mostrarProgresso();
            })
            .catch(error => {
                console.error('Erro ao carregar cursos:', error);
            });
    }

    function exibirCursos() {
        const cursosContainer = document.getElementById('cursosContainer');
        cursosContainer.innerHTML = '';
        let cursosUnicos = new Set(cursos.map(curso => curso['Curso']));
    
        // Crie o contêiner de curso apenas uma vez
        const divCursoContainer = document.createElement('div');
        divCursoContainer.className = 'curso-container';
    
        cursosUnicos.forEach(nomeCurso => {
            const divCurso = document.createElement('div');
            divCurso.className = 'curso'; // Remova a classe 'curso-container' daqui
    
            const nomeCursoFormatado = nomeCurso.replace(/ /g, '');
            const imgCurso = document.createElement('img');
            imgCurso.src = `images/${nomeCursoFormatado}.png`;
            imgCurso.alt = `Imagem do curso ${nomeCurso}`;
            imgCurso.style.cursor = 'pointer';
            imgCurso.addEventListener('click', () => exibirModulosOuAulas(nomeCurso));
            divCurso.appendChild(imgCurso);
    
            // Adicione o curso ao contêiner de curso
            divCursoContainer.appendChild(divCurso);
        });
    
        // Adicione o contêiner de curso ao cursosContainer
        cursosContainer.appendChild(divCursoContainer);
    }
    
    function exibirModulosOuAulas(nomeCurso) {
        const aulasDoCurso = cursos.filter(curso => curso['Curso'] === nomeCurso);
        if (aulasDoCurso.length > 0) {
            const modulos = new Set(aulasDoCurso.map(aula => aula['Modulo']));
            
            // Se houver mais de um módulo, exiba os módulos
            if (modulos.size > 1) {
                exibirModulos(nomeCurso);
            } else {
                // Se houver apenas um módulo, exiba as aulas diretamente
                const nomeModuloUnico = Array.from(modulos)[0];
                exibirAulas(nomeCurso, nomeModuloUnico);
            }
        }
    }

    function exibirModulos(nomeCurso) {
        mostrarSeção('moduloContainer');
        const moduloContainer = document.getElementById('moduloContainer');
        moduloContainer.innerHTML = '';
    
        const modulosDoCurso = new Set(cursos.filter(curso => curso['Curso'] === nomeCurso).map(curso => curso['Modulo']));
    
        // Crie o contêiner de módulos apenas uma vez
        const divModuloContainer = document.createElement('div');
        divModuloContainer.className = 'curso-container'; // Use a mesma classe do contêiner de cursos
    
        modulosDoCurso.forEach(modulo => {
            const divModulo = document.createElement('div');
            divModulo.className = 'curso'; // Use a mesma classe dos cursos
    
            const nomeModuloFormatado = modulo.replace(/ /g, '');
            const imgModulo = document.createElement('img');
            imgModulo.src = `images/${nomeModuloFormatado}.png`;
            imgModulo.alt = `Imagem do módulo ${modulo}`;
            imgModulo.style.cursor = 'pointer';
            imgModulo.addEventListener('click', () => exibirAulas(nomeCurso, modulo));
            imgModulo.className = 'modulo'; // Adicione a classe 'modulo' às imagens dos módulos
            divModulo.appendChild(imgModulo);
    
            // Adicione o módulo ao contêiner de módulos
            divModuloContainer.appendChild(divModulo);
        });
    
        // Adicione o contêiner de módulos ao móduloContainer
        moduloContainer.appendChild(divModuloContainer);
    }

    function exibirAulas(nomeCurso, nomeModulo) {
        mostrarSeção('aulaContainer');
        const aulaContainer = document.getElementById('aulaContainer');
        aulaContainer.innerHTML = '';
    
        const linhaVertical = document.createElement('div');
        linhaVertical.className = 'linha-vertical';
        aulaContainer.appendChild(linhaVertical);
    
        const aulasDoModulo = cursos.filter(curso => curso.Curso === nomeCurso && curso.Modulo === nomeModulo);
        
        aulasDoModulo.forEach((aula, index) => {
            const divAula = document.createElement('div');
            divAula.className = 'aula';
    
            divAula.innerHTML = `
                <h3>${aula['Nome da Aula']}</h3>
                <p>Duração: ${aula['Duração']}</p>
                ${aula['Minuto Parado'] ? `<p>Parado em: ${aula['Minuto Parado']}</p>` : ''}
                <button class="edit-btn" onclick="editarAula('${aula['Nome da Aula']}')">Editar</button>
            `;
    
            // O marcador da linha do tempo agora é parte da 'aula'
            const bolinha = document.createElement('div');
            bolinha.className = 'bolinha';
            divAula.appendChild(bolinha);
    
            aulaContainer.appendChild(divAula);
        });
    
        // Após adicionar todas as aulas, ajusta a altura da linha vertical
        setTimeout(() => {
            linhaVertical.style.height = `${aulaContainer.offsetHeight}px`;
        }, 0);
    }

    function editarAula(nomeAula) {
        // Implementação da função de editar aula
        console.log('Editando aula:', nomeAula);
        // Implemente a lógica de edição aqui
    }
    
    function ajustarAlturaLinha() {
        const linhaVertical = document.querySelector('.linha-vertical');
        const aulaContainer = document.getElementById('aulaContainer');
        linhaVertical.style.height = `${aulaContainer.offsetHeight}px`;
        linhaVertical.style.top = '50%';
        linhaVertical.style.transform = 'translateY(-50%)';
    }
    
    // ... quando suas aulas forem adicionadas ...
    ajustarAlturaLinha(); // Isso ajustará a altura da linha
    
    function exibirProgresso() {
        const progressoContainer = document.getElementById('progressoContainer');
        progressoContainer.innerHTML = '';

        cursos.forEach(curso => {
            if (Array.isArray(curso.aulas)) {
                const aulasAssistidas = curso.aulas.filter(aula => aula['Assistida (Sim/Não)'] === 'Sim').length;
                const totalAulas = curso.aulas.length;
                const progresso = (aulasAssistidas / totalAulas * 100).toFixed(2);

                const divProgresso = document.createElement('div');
                divProgresso.className = 'progresso';
                divProgresso.innerHTML = `
                    <h3>${curso.nome}</h3>
                    <p>Progresso: ${progresso}%</p>
                `;
                progressoContainer.appendChild(divProgresso);
            } else {
                console.log(`Curso ${curso.nome} não tem aulas definidas.`);
            }});
    }
    carregarCursos();
});
