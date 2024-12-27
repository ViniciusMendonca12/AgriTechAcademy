/* import axiosInstance from './axiosConfig';
 */

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
dropDownCategorias();


const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");

let filteredCursos = [];

inputBox.onkeyup = (e) => {
  let userData = e.target.value;

  if (userData) {
    axios.get('/gerenciar/cursos/filtro')
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

/*   console.log('Selected:', selectData, selectedId);*/

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
 
    let url = '/gerenciar/cursos/filtro';
    let params = [];

    if (tipoOrdenacao) params.push(`tipoOrdenacao=${tipoOrdenacao}`);
    if (categoria) params.push(`categoria=${categoria}`);
    

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
        cursoElement.id = "cursoCard"
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
            <div class="row justify-content-center">
                <div class="col-12"> 
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Guia de ações
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button class="dropdown-item" id="cadastrarAula" type="button">Cadastrar Aula</button>
                            <button class="dropdown-item" id="editarCurso" type="button">Editar Curso</button>
                            <button class="dropdown-item" id="monitorarAvaliações" type="button">Monitorar Avaliações</button>
                            <button class="dropdown-item" id="excluirCurso" type="button">Excluir Curso</button>

                        </div>
                </div>
        </div>
     </div>`;

     elemento.appendChild(cursoElement)
            
    });

}

$("#botaoRedefinir").click(function(){
    $("#filtroCursoOrdem").val(2)
    $("#selectCategorias").val(0)
    $("#botaoBuscar").click()
    $("#inputNome").val("")


})


$(".cadastrarAula").click(function(){
    var tituloCurso = $(this).attr("titulo-curso");
    window.location.href = "/gerenciador/aulas/" + tituloCurso
 

})


$(".excluirCurso").click(function(){
    var idCurso = $(this).attr("id-curso");

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Deseja realmente deletar esse curso?",
      text: "Você e mais nenhum usuário poderá assistir ele novamente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Não, cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete("/curso/"+idCurso)
        .then(function(response) {
        window.location.reload(); 
        })
        .catch(function(error) {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Erro ao deletar curso!!!",
            text:"Tente novamente mais tarde!",
            showConfirmButton: false,
            timer: 1500
        })   
    });
       
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Seu curso está a salvo :)",
          icon: "error"
        });
      }
    });

})



$(".editarCurso").click(function(){
    var idCurso = $(this).attr("id-curso");
    window.location.href = "/cadastro/curso?id="+ idCurso
    

})