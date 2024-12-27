const elements = document.querySelectorAll('#descricaoP')
const LIMITE = 130


for (let p of elements) {
    const acimaLimite = p.innerText.length > LIMITE
    const pontosOuVazio = acimaLimite ? '...' : ''
    p.innerText = p.innerText.substring(0, LIMITE) + pontosOuVazio
}


function carregarBarraProgresso() {
    var progressBars = document.querySelectorAll('.progressBar');

    progressBars.forEach(function(progressBar) {
        var progresso = parseFloat(progressBar.getAttribute('data-progress')); // Converter para número

        // Verificar se progresso é um número válido
        if (!isNaN(progresso)) {
            animateProgressBar(progressBar, progresso);
        } else {
            console.error('Valor inválido para data-progress:', progresso);
        }
    });
};

function animateProgressBar(progressBar, progresso) {
    var value = 0;
    var interval = setInterval(function() {
        if (value >= progresso) {
            clearInterval(interval);
        } else {
            value++;
            updateProgressBar(progressBar, value);
        }
    }, 20);
}

function updateProgressBar(progressBar, value) {
    progressBar.style.width = value + '%';
    progressBar.innerHTML = value + '%';
}





function dropDownCategorias() {
    const selectElement = document.getElementById('selectCategorias');
    axios.get('http://localhost:8080/categorias')
        .then(function(response) {
            const categorias = response.data;
            categorias.forEach(function(categoria) {
                const option = document.createElement('option');
                option.value = categoria.id; 
                option.text = categoria.title; 
                selectElement.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar categorias:', error);
        });
}

function dropDownInstrutores() {
    const selectElement = document.getElementById('selectInstrutores');
    axios.get('http://localhost:8080/meuAprendizado/instrutores')
        .then(function(response) {
            const instrutores = response.data;
            instrutores.forEach(function(instrutor) {
                const option = document.createElement('option');
                option.value = instrutor.id; 
                option.text = instrutor.nomeCompleto; 
                selectElement.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar instrutores:', error);
        });
}



axios.get('/avaliacao/estatisticas/:idCurso' + 8)
        .then(function(response){
            if (response.length > 0) {
                var avaliacaoUsuario = response[0]; 

                $("#star3Label").html("teste")
            } else {
                // elementoAvaliacao.text('Este curso ainda não foi avaliado');
            }
        }).catch(function(err){
            console.error('Erro ao obter avaliações do curso');
        })




dropDownCategorias();
dropDownInstrutores();
carregarBarraProgresso();

const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");

let filteredCursos = [];

inputBox.onkeyup = (e) => {
  let userData = e.target.value;

  if (userData) {
    axios.get('/meuAprendizado/filtro')
    .then(response => {
      let cursos = response.data; // Ajuste conforme a estrutura do seu JSON de retorno
      filteredCursos = [];

      if (cursos) {
        filteredCursos = cursos.filter(curso => {
          return curso.titulo.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });

        let emptyArray = filteredCursos.map(curso => {
          return `<li data-id="${curso.id}">${curso.titulo}</li>`;
        });

        searchWrapper.classList.add("active"); // Mostrar caixa de sugestão
        showSuggestions(emptyArray);

        let allList = suggBox.querySelectorAll("li");
        allList.forEach(item => {
          item.addEventListener("click", function() {
            select(this);
          });
        });
      } else {
        searchWrapper.classList.remove("active"); // Esconder caixa de sugestão
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
  } else {
    searchWrapper.classList.remove("active"); // Esconder caixa de sugestão
  }
};

let selectedId;

const select = (element) => {
  let selectData = element.textContent;
  selectedId = element.dataset.id;
  inputBox.value = selectData;

  // Encontrar o curso selecionado a partir do ID
  const selectedCurso = filteredCursos.find(curso => curso.id == selectedId);

  if (selectedCurso) {
    atualizarListaCursos([selectedCurso]);
  } else {
    console.error('Curso não encontrado.');
  }

/*   console.log('Selected:', selectData, selectedId);
 */
  searchWrapper.classList.remove("active"); // Esconder caixa de sugestão
};

const showSuggestions = (list) => {
  let listData;
  if (!list.length) {
    userValue = inputBox.value;
    listData = `<li>${userValue}</li>`;
  } else {
    listData = list.join('');
  } 
  suggBox.innerHTML = listData;
};


$("#botaoBuscar").click(function(){
    const tipoOrdenacao = $("#filtroCursoOrdem").val()
    const categoria = $("#selectCategorias").val()
    const progresso = $("#selectProgresso").val()
    const instrutor = $("#selectInstrutores").val()

    console.log(progresso)


    let url = '/meuAprendizado/filtro';
    let params = [];

    if (tipoOrdenacao) params.push(`tipoOrdenacao=${tipoOrdenacao}`);
    if (categoria) params.push(`categoria=${categoria}`);
    if (instrutor) params.push(`instrutor=${instrutor}`);
    if (progresso) params.push(`progresso=${progresso}`);


    if (params.length > 0) {
        url += '?' + params.join('&');
    }

    axios.get(url)
        .then(response => {
            atualizarListaCursos(response.data);

        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
    
    })

function atualizarListaCursos(cursos) {
    var elemento = document.getElementById('testeee');
    
    
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild)
    } 

    if(cursos <= 0){
        var cursoElement = document.createElement('div');
        cursoElement.innerHTML = `<h3 style="margin: 0px 0px 10px 10px"> Nenhum resultado encontrado </h3>`
        elemento.appendChild(cursoElement)

    }
       
    cursos.forEach(curso => {
        var cursoElement = document.createElement('div');
        cursoElement.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'align-self-center', 'curso');
        cursoElement.setAttribute('data-ultimo-acesso', curso.ultimoAcesso || '');
        cursoElement.innerHTML = `
            <div class="container containerPlantacaoDentro text-center ">
            <div class="row ">
                <img class="imagem" src="${curso.imagemCurso}" alt="">
            </div>
            <div class="row">
                <h3>${curso.titulo} </h3>
            </div>
            <div class="row">
                <p>${curso.nomeInstrutor}</p>
            </div>
               <div class="progress-container">
                    <div class="progress-bar progressBar" data-progress="${ curso.totalAulasCurso > 0 ? Math.floor((curso.aulasAssistidas / curso.totalAulasCurso) * 100) : 0 }"></div>
                </div>          
            <div class="row align-items-start">
                <div class="col-6">
                            <div class="starsLista">
                                <input type="radio" value="5" ${ curso.mediaAvaliacoes >= 5 ? 'checked' : '' }><label>★</label>
                                <input type="radio" value="4" ${ curso.mediaAvaliacoes >= 4 && curso.mediaAvaliacoes < 5 ? 'checked' : '' }><label>★</label>
                                <input type="radio" value="3" ${ curso.mediaAvaliacoes >= 3 && curso.mediaAvaliacoes < 4 ? 'checked' : '' }><label>★</label>
                                <input type="radio" value="2" ${ curso.mediaAvaliacoes >= 2 && curso.mediaAvaliacoes < 3 ? 'checked' : '' }><label>★</label>
                                <input type="radio" value="1" ${ curso.mediaAvaliacoes >= 1 && curso.mediaAvaliacoes < 2 ? 'checked' : '' }><label>★</label>
                            </div>         
                    </div>
                <div class="col-6">
                    <a class=" btn btn-warning btn-sm botao" href="/assistir/curso/${curso.titulo}">Ver Mais</a>
                </div>
            </div>
            <div class="row">
                <p class="avaliacao">Deixe uma avaliação</p>
            </div>
        </div>
     </div>`;

     elemento.appendChild(cursoElement)
     carregarBarraProgresso()
       
    });

}

$("#botaoRedefinir").click(function(){
    $("#filtroCursoOrdem").val(0)
    $("#selectCategorias").val(0)
    $("#selectProgresso").val(0)
    $("#selectInstrutores").val(0)
    $("#botaoBuscar").click()
    $("#inputNome").val("")

    $('#myModal').modal('show');

})


    const stars = document.querySelectorAll('.stars label');
    const ratingValue = document.getElementById('rating');
    var avaliacao 

    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const input = document.getElementById(star.getAttribute('for'));
        avaliacaoCurso(input.value)
      });

      star.addEventListener('mouseleave', () => {
        const checkedStar = document.querySelector('.stars input:checked');
        if (checkedStar) {
            avaliacaoCurso(checkedStar.value);
          } else {
            ratingValue.textContent = ""; 
          }
      });

      star.addEventListener('click', () => {
        const input = document.getElementById(star.getAttribute('for'));
        input.checked = true;
      });
    });



$(".avaliacao").click(function(){
    var idCurso = $(this).attr('id-curso')
    $("#idCurso").val(idCurso)

    axios.get("/curso/avaliacao/usuario/"+idCurso)
    .then(function(response){
      if(response.data.length > 0){
        $("#cadastrarAvaliacao").html("Editar Avaliação")
        var avaliacaoUsuario = response.data[0]
        avaliacaoCurso(avaliacaoUsuario.avaliacao.toString())
        $('#comentarioAvaliacao').val(avaliacaoUsuario.comentarioAvaliacao)


      }else{
        $("#cadastrarAvaliacao").html("Enviar Avaliação")
        $('#comentarioAvaliacao').val("")
        limparAvaliacao()

      }
    })
    .catch(function(err){
        console.log(err)
    })
})

$("#cadastrarAvaliacao").click(function(){

    var dadosAvaliacao = {
        idCurso: $("#idCurso").val() ,
        avaliacao: avaliacao,
        comentarioAvaliacao: $('#comentarioAvaliacao').val(),
        dataAvaliacao:dataCompletaIso() ,
        statusAvaliacao: 1 ,  
    }

    var condicao

    if(dadosAvaliacao.avaliacao == null){
        condicao = false
    }else{
        condicao = true
    }

    if(condicao){
     axios.post("/curso/avaliacao", dadosAvaliacao)
     .then(function(response){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Sucesso!!!",
            text:"Avaliação feita com sucesso",
            showConfirmButton: false,
            timer: 1500
        })
        $("#fecharModalAvaliacao").click()
     }).catch(function(error){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Erro!!!",
            text:"Houve um erro ao fazer a avaliação. Tente novamente mais tarde.",
            showConfirmButton: false,
            timer: 1500
        })
        console.log(error)
     })
    }else{
        Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Alerta!!!",
            text:"Preencha todos os campos para fazer a avaliação!!",
            showConfirmButton: false,
            timer: 1500
        })  
    }
    })


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

function avaliacaoCurso(valor){
    switch(valor){
        case "1":
            ratingValue.textContent = "Não gostei nem um pouco" 
            avaliacao = 1
            break
        case "2":
            ratingValue.textContent = "Não gostei" 
            avaliacao = 2
            break
        case "3":
            ratingValue.textContent = "Acho que poderia melhorar em alguns pontos" 
            avaliacao = 3
            break
        case "4":
            ratingValue.textContent = "Gostei" 
            avaliacao = 4
            break
        case "5":
            ratingValue.textContent = "Gostei muito, excelente" 
            avaliacao = 5
            break
    }

    stars.forEach(star => {
        const input = document.getElementById(star.getAttribute('for'));
        if (input.value == valor) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });

}

function limparAvaliacao() {
    stars.forEach(star => {
        const input = document.getElementById(star.getAttribute('for'));
        input.checked = false;
    });

    ratingValue.textContent = "";
    avaliacao = null;
}
