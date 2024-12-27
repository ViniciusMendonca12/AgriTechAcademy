
function estiloIcones() {
    const editarAulas = document.querySelectorAll('.bi-pencil');
    const excluirAulas = document.querySelectorAll('.bi-trash');
    const visualizarAulas = document.querySelectorAll('.bi-eye');

    var icones = [
        { elementos: editarAulas, icone: "bi-pencil", novoIcone: "bi-pencil-fill" },
        { elementos: excluirAulas, icone: "bi-trash", novoIcone: "bi-trash-fill" },
        { elementos: visualizarAulas, icone: "bi-eye", novoIcone: "bi-eye-fill" }
    ];

    icones.forEach(icone => {
        icone.elementos.forEach(elemento => {
            elemento.addEventListener('mouseenter', function() {
                elemento.classList.remove(icone.icone);
                elemento.classList.add(icone.novoIcone);
            });

            elemento.addEventListener('mouseleave', function() {
                elemento.classList.remove(icone.novoIcone);
                elemento.classList.add(icone.icone);
            });
        });
    });
}
estiloIcones()


$("#cadastrarAula").click(function(){
    var dados = {
        idCurso: $("#idCurso").val(),
        tituloAula: $("#tituloAula").val(),
        descricaoAula: $("#descricaoAula").val(),
        linkAula: $("#linkAula").val(),
        dataCriacao: gerarDataAtualIso(),
        duracaoAula: $("#duracaoAula").val()
    }
    
    let dadosValidacao = {
        "Título": dados.tituloAula,
        "Descrição": dados.descricaoAula,
        "Link": dados.linkAula,
        "Duração": dados.duracaoAula
    }
      var camposPreenchidos = true
      var campo 

    for (let dado in dadosValidacao) {
        if (dadosValidacao.hasOwnProperty(dado)) {
            if (dadosValidacao[dado] === "") {
                console.log(`O Campo "${dado}" está vazia.`);
                camposPreenchidos = false
                campo = dado
            }
        }
    }

    if(camposPreenchidos){
        axios.post("http://localhost:8080/cadastrar/aula", dados)
             .then(function(response){
                 location.reload()
                 
            }).catch(function(error){
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Erro ao cadastrar aula!!!",
                    text:"Tente novamente mais tarde!",
                    showConfirmButton: false,
                    timer: 1500
                })         
            })
    }else{
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Houve um erro!!",
            text:"Você deve preencher todos oo campo: "+campo,
            showConfirmButton: false,
            timer: 1500
            }) 
    }
})

$(".visualizarAula").click(function(){
   var tituloCurso = $(this).attr('titulo-curso');
   var tituloAula =  $(this).attr('titulo-aula');

    window.location.href = `/assistir/aula/${tituloCurso}/${tituloAula}`


})

$(".excluirAula").click(function(){
    var idAula = $(this).attr('id-aula');
    Swal.fire({
        title: "Deletar aula?",
        text: "Se você aceitar não conseguirá recuperar sua aula!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, deletar!"
      }).then((result) => {
        if (result.isConfirmed) {
            axios.delete("/deletar/aula/"+idAula)
            .then(function(response){
                location.reload()
                
            }).catch(function(error){
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Erro ao deletar aula!!!",
                    text:"Tente novamente mais tarde!",
                    showConfirmButton: false,
                    timer: 1500
                })   
            })
        } 
      });
 })


$(".editarAula").click(function(){
    var idAula = $(this).attr('id-aula');
    $("#cadastrarAula").hide()
    $("#editarAulaSelecionada").show()
    $("#cancelarEdicao").show()
    $("#idAula").val(idAula)

    axios.get("/aula/unica/"+idAula)
    .then(function(response){
        console.log(response)
        var aula = response.data
        $("#idCurso").val(aula.idCurso),
        $("#tituloAula").val(aula.tituloAula),
        $("#descricaoAula").val(aula.descricaoAula),
        $("#linkAula").val(aula.linkAula),
        $("#duracaoAula").val(aula.duracaoAula) 

        
    }).catch(function(error){
        console.log(error) 
    })


})

$("#editarAulaSelecionada").click(function(){
    var idAula = $("#idAula").val()

    var dados = {
        idCurso:       $("#idCurso").val(),
        tituloAula:    $("#tituloAula").val(),
        descricaoAula: $("#descricaoAula").val(),
        linkAula:      $("#linkAula").val(),
        dataCriacao:   gerarDataAtualIso(),
        duracaoAula:   $("#duracaoAula").val()
    }
    
    let dadosValidacao = {
        "Título": dados.tituloAula,
        "Descrição": dados.descricaoAula,
        "Link": dados.linkAula,
        "Duração": dados.duracaoAula
    }
      var camposPreenchidos = true
      var campo 

    for (let dado in dadosValidacao) {
        if (dadosValidacao.hasOwnProperty(dado)) {
            if (dadosValidacao[dado] === "") {
                console.log(`O Campo "${dado}" está vazia.`);
                camposPreenchidos = false
                campo = dado
            }
        }
    }

    if(camposPreenchidos){
        axios.put("/editar/aula/"+idAula, dados)
        .then(function(response){
            location.reload()

            
        }).catch(function(error){
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Erro ao editar aula!!!",
                text:"Tente novamente mais tarde!",
                showConfirmButton: false,
                timer: 1500
            })   
        })
    }else{
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Houve um erro!!",
            text:"Você deve preencher todos oo campo: "+campo,
            showConfirmButton: false,
            timer: 1500
            }) 
    }


 })

 $("#cancelarEdicao").click(function(){
    $("#editarAulaSelecionada").hide()
    $("#cancelarEdicao").hide()
    $("#cadastrarAula").show()

    $("#idCurso").val("")
    $("#tituloAula").val("")
    $("#descricaoAula").val("")
    $("#linkAula").val(""),
    $("#duracaoAula").val("")

 })
    

function gerarDataAtualIso(){
    var dataAtual = new Date();

    var ano = dataAtual.getFullYear(); 
    var mes = dataAtual.getMonth() + 1; 
    var dia = dataAtual.getDate(); 
    
    var dataCompleta = ano + "-" + mes + "-" + dia;

    return dataCompleta 
}




