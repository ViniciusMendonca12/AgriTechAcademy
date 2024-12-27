
function limitaTexto(){
    const elements = document.querySelectorAll('#descricaoP')
    const LIMITE = 130
        for (let p of elements) {
            const acimaLimite = p.innerText.length > LIMITE
            const pontosOuVazio = acimaLimite ? '...' : ''
            p.innerText = p.innerText.substring(0, LIMITE) + pontosOuVazio
        }

}

limitaTexto()

document.addEventListener('DOMContentLoaded', function() {
    const courses = document.querySelectorAll('#botaoVerMais');
    
    courses.forEach(course => {
        course.addEventListener('click', function() {
            const courseId = this.getAttribute('data-id');
            $("#listaAulasCurso").html('')
            axios.get("/informacoes-curso/"+courseId)
            .then(function(data){
                var curso = data.data
                $("#tituloCursoModal").html(curso.titulo)
                $("#linkVideoModal").attr("src", curso.linkCurso);
                $("#descricaoMiniModal").html(curso.descricaoMini);
                $("#criadoPorModal").html("Criado por: "+ curso.nomeCompleto);
                $("#ultimaAtualizacaoModal").html("Última atualização: " + formataDataISO(curso.ultimaAtualizacao));

                notaAvaliacao = curso.mediaAvaliacoes
                $("#containerEstrelas").html(`
                <div class="starsLista marginEstrelas">
                    <input type="radio" value="5" ${notaAvaliacao >= 5 ? 'checked' : ''}><label>★</label>
                    <input type="radio" value="4" ${notaAvaliacao >= 4 && notaAvaliacao < 5 ? 'checked' : ''}><label>★</label>
                    <input type="radio" value="3" ${notaAvaliacao >= 3 && notaAvaliacao < 4 ? 'checked' : ''}><label>★</label>
                    <input type="radio" value="2" ${notaAvaliacao >= 2 && notaAvaliacao < 3 ? 'checked' : ''}><label>★</label>
                    <input type="radio" value="1" ${notaAvaliacao >= 1 && notaAvaliacao < 2 ? 'checked' : ''}><label>★</label>
                </div>
                `)

                if(notaAvaliacao == null){
                    $("#notaAvaliacaoModal").html("0")

                }else{
                    $("#notaAvaliacaoModal").html(notaAvaliacao + ".0")

                }
                
                $("#quantidadeAvaliacoesModal").html(`(${curso.totalAvaliacoes} avaliações)`);

                $("#quantidadeAlunosModal").html(curso.quantidadeAlunos + " alunos");

                if(curso.duracaoTotalCurso == null){
                    $("#horasCursoModal").html("0 horas de vídeo sob demanda")

                }else{
                    $("#horasCursoModal").html(curso.duracaoTotalCurso +" horas de vídeo sob demanda")

                }

                $("#requisitosModal").html(curso.requisitos);
                $("#descricaoCompletaModal").html(curso.descricao);
                $("#conteudoAprendizadoModal").html(curso.conteudoAprendizado);
                $("#informacoesConteudoCursoModal").html(`${curso.totalAulasCurso} aulas • Duração total: ${curso.duracaoTotalCurso ? curso.duracaoTotalCurso : 0} horas`)


                axios.get("/curso/aulas/"+curso.id)
                .then(function(response){
                    var aulas = response.data
                    console.log(aulas)
                    aulas.forEach(aula =>{
                        console.log(aula.tituloAula)
                        $("#listaAulasCurso").append(`<li><p class="paragrafoMedio">${aula.tituloAula}</p></li>`)
                    })
                }).catch(function(error){

                })


            }).catch(function(error){
                console.log("Erro ao carregar o ver mais"+ error)
            }) 
            
            $("#adicionarMeusCursos").click(function(){
            
                var dadosObterCurso = {
                    idCurso: courseId,
                    dataAquisicao: dataAtualIso(),
                    ultimoAcesso: dataAtualIso()
                }

                axios.post('/obter-curso', dadosObterCurso)
                .then(function(response){
                    Swal.fire({
                        title: "Curso adquirido com sucesso!!! ",
                        text: "Deseja ir para a tela meus cursos?",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sim",
                        cancelButtonText: "Não"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = 'http://localhost:8080/meu-aprendizado';

                        }
                      });
                }).catch(function(error){
                    console.log(error)
                    Swal.fire({
                        title: "Erro ao adquirir curso ",
                        text: error.response.data,
                        icon: "error"
                    })
                })

            })
        });
    });
            
});

    
function formataDataISO(dataISO){

    const data = new Date(dataISO);
    
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear().toString();
    
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    return dataFormatada
    
}

function dataAtualIso(){
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    return dataFormatada
}