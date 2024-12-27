tinymce.init({
    selector: "#conteudoCurso",
    language: 'pt_BR',
    plugins: [
        'advlist',
        'autolink',
        'link',
        'image',
        'lists',
        'preview',
        'searchreplace',
        'wordcount',
        'fullscreen',
        'insertdatetime',
        'media',
        'save',
        'table',
        'emoticons',
    ]
})


function dataAtualBR(){
    
    var dataAtual = new Date();

    var ano = dataAtual.getFullYear(); 
    var mes = dataAtual.getMonth() + 1; 
    var dia = dataAtual.getDate(); 

    var diaStr = dia.toString().padStart(2, '0');
    var mesStr = mes.toString().padStart(2, '0');

    var dataCompletaBR = diaStr + "/" + mesStr + "/" + ano;

    return dataCompletaBR
}

function dataCompletaIso(){
    
    var dataAtual = new Date();

    var ano = dataAtual.getFullYear(); 
    var mes = dataAtual.getMonth() + 1; 
    var dia = dataAtual.getDate(); 

    var diaStr = dia.toString().padStart(2, '0');
    var mesStr = mes.toString().padStart(2, '0');

    var dataCompletaIso = ano + "-" + mes + "-" + dia;

    return dataCompletaIso
}

$("#dataCriacaoCurso").val(dataAtualBR())

const urlParams = new URLSearchParams(window.location.search);
const idCurso = urlParams.get('id');

if(idCurso){
    document.title = 'Edição de Curso';

    $("#atualizarCurso").show()
    $("#cadastrarCurso").hide()
    $('#atualizarCurso').removeClass('btn-success').addClass('btn-warning');


    axios.get("/curso/"+idCurso)
    .then(function(response){
        var curso = response.data
        $("#tituloCurso").val(curso.titulo),
        $("#categoriaCurso").val(curso.idCategoria),
        $("#instrutorCurso").val(curso.idInstrutor),
        $("#imagemCurso").val(curso.imagemCurso),
        $("#descricaoCurso").val(curso.descricao),
        $("#requisitosCurso").val(curso.requisitos),
        $('#conteudoCurso').val(curso.conteudoAprendizado),
        $("#miniDescricaoCurso").val(curso.descricaoMini),
        $("#linkCurso").val(curso.linkCurso)
    })
    .catch(function(error){
        console.log("Erro ao carregar curso" + error)
    }) 

    $("#atualizarCurso").click(function(){
        var dadosCurso = {
            tituloCurso: $("#tituloCurso").val(),
            categoriaCurso: $("#categoriaCurso").val(),
            instrutorCurso: $("#instrutorCurso").val(),
            imagemCurso: $("#imagemCurso").val(),
            descricaoCurso: $("#descricaoCurso").val(),
            requisitosCursos: $("#requisitosCurso").val(),
            conteudoCurso: tinymce.get('conteudoCurso').getContent(),
            miniDescricaoCurso: $("#miniDescricaoCurso").val(),
            linkCurso: $("#linkCurso").val(),
            dataCriacaoCurso: dataCompletaIso(),
            idCurso: idCurso
        }

        axios.put("/curso/"+idCurso, dadosCurso)
        .then(function(response){
            window.location.href = '/gerenciar/cursos'
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Curso editado com sucesso!!!",
                showConfirmButton: false,
                timer: 1500
            }) 
        }).catch(function(err){
            console.log(err.response.data)
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Erro ao cadastrar o curso!!!" + err.response.data ,
                showConfirmButton: false,
                timer: 3000
            }) 
    
        })
    })

    


}else{


    $("#cadastrarCurso").click(function(){
        var dadosCurso = {
                            tituloCurso: $("#tituloCurso").val(),
                            categoriaCurso: $("#categoriaCurso").val(),
                            instrutorCurso: $("#instrutorCurso").val(),
                            imagemCurso: $("#imagemCurso").val(),
                            descricaoCurso: $("#descricaoCurso").val(),
                            requisitosCursos: $("#requisitosCurso").val(),
                            conteudoCurso: tinymce.get('conteudoCurso').getContent(),
                            miniDescricaoCurso: $("#miniDescricaoCurso").val(),
                            linkCurso: $("#linkCurso").val(),
                            dataCriacaoCurso: dataCompletaIso()
                        }
    
    
                    
        axios.post("/cadastrar/curso", dadosCurso)
        .then(function(response){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Curso cadastrado com sucesso!!!",
                showConfirmButton: false,
                timer: 1500
            }) 
            window.location.href = '/cursos'
    
        }).catch(function(err){
            console.log(err.response.data)
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Erro ao cadastrar o curso!!!" + err.response.data ,
                showConfirmButton: false,
                timer: 3000
            }) 
    
        })
    })
    
}


