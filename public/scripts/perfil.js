
axios.get('/perfilUsuario')
    .then(function (data) {
        var usuario = data.data
        $("#nomeUsuario").val(usuario.nomeUsuario)
        $("#emailUsuario").val(usuario.email)
        $("#twitterUsuario").val(usuario.twitter)
        $("#facebookUsuario").val(usuario.facebook)
        $("#githubUsuario").val(usuario.github)
        $("#linkedinUsuario").val(usuario.linkedin)
        $("#profissaoUsuario").val(usuario.profissao)
        $("#bibliografiaUsuario").val(usuario.bibliografia) 
        var img = '<img src="'+ usuario.imagemUsuario+'" alt="Description">';
        $("#imagemPerfilAtual").append(img)   
    })
    .catch(function (error) {
        console.log('Erro ao atualizar o perfil:', error);
        alert('Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.');
    }); 


axios.get('/perfilInstrutor')
    .then(function (data) {
        console.log("sucesso us")
        var instrutor = data.data
        $("#nomeCompletoInstrutor").val(instrutor.nomeCompleto)
        $("#contatoInstrutor").val(instrutor.celular)
        $("#dataNascimentoInstrutor").val(formatarDataBR(instrutor.dataDeNascimento))
        $("#enderecoInstrutor").val(instrutor.endereco)
        $("#documentoInstrutor").val(instrutor.cpf) 
      
    })
    .catch(function (error) {
        console.log('Erro ao atualizar o perfil:', error);
        alert('Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.');
    });


$('#sessaoUsuarioMenu').click(function() {
    $('#sessaoUsuario').show()
    $('#sessaoInstrutor').hide()
    $('#sessaoFotoPerfil').hide()
});

$('#sessaoInstrutorMenu').click(function() {
    $('#sessaoInstrutor').show()
    $('#sessaoUsuario').hide()
    $('#sessaoFotoPerfil').hide()
});

$('#sessaoImagemMenu').click(function() {
    $('#sessaoFotoPerfil').show()
    $('#sessaoUsuario').hide()
    $('#sessaoInstrutor').hide()
});



$("#salvarPerfilUsuario").click(function(){
    var dadosPerfilUsuario = {
        nomeUsuario: $("#nomeUsuario").val(),
        email: $("#emailUsuario").val(),
        twitter: $("#twitterUsuario").val(),
        facebook: $("#facebookUsuario").val(),
        github: $("#githubUsuario").val(),
        linkedin: $("#linkedinUsuario").val(),
        profissao: $("#profissaoUsuario").val(),
        bibliografia: $("#bibliografiaUsuario").val()
   } 
   
   axios.put('/perfilUsuario', dadosPerfilUsuario)
   .then(function (response) {
       Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Perfil salvo com sucesso!!!",
        showConfirmButton: false,
        timer: 1500
        }) 
   })
   .catch(function (error) {
       console.log('Erro ao atualizar o perfil:', error.response);
       alert('Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.');
   });
})
    
 
    


$("#salvarPerfilInstrutor").click(function(){
    var dataDeNascimento = converterDataBRParaISO($("#dataNascimentoInstrutor").val())
    var dadosPerfilInstrutor = {
        cpf: $("#documentoInstrutor").val(),
        endereco: $("#enderecoInstrutor").val(),
        nomeCompleto: $("#nomeCompletoInstrutor").val(),
        celular: $("#contatoInstrutor").val(),
        dataDeNascimento: dataDeNascimento
    } 
    
    axios.put('/perfilInstrutor', dadosPerfilInstrutor)
    .then(function (response) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Perfil salvo com sucesso!!!",
            showConfirmButton: false,
            timer: 1500
        })   
    })
    .catch(function (error) {
        console.log('Erro ao atualizar o perfil:', error);
        alert('Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.');
    });
 
})

$("#salvarFotoUsuario").click(function(){
    var imagem = $("#imagemUsuario").val()

    axios.put("/perfilImagem", {imagemUsuario: imagem}).then(function (response) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Imagem de perfil salva com sucesso!!!",
            showConfirmButton: false,
            timer: 1500
        })   
        window.location.reload()
    })
    .catch(function (error) {
        console.log('Erro ao atualizar o perfil:', error);
        alert('Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente mais tarde.');
    });
})



function formatarDataBR(dataISO) {
    var data = new Date(dataISO);

    var dia = ("0" + data.getUTCDate()).slice(-2); 
    var mes = ("0" + (data.getUTCMonth() + 1)).slice(-2); 
    var ano = data.getUTCFullYear();

    var dataFormatada = dia + "/" + mes + "/" + ano;

    return dataFormatada;
}

function converterDataBRParaISO(dataBR) {
    const [dia, mes, ano] = dataBR.split('/');
    
    if (!dia || !mes || !ano) {
        throw new Error('Formato de data inválido. Use "dd/mm/aaaa".');
    }

    return `${ano}-${mes}-${dia}`;
}

function mascaraCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); 

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    cpf = cpf.slice(0, 13);

    return cpf;
}

function mascaraTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ''); 

    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');

    telefone = telefone.slice(0, 15);

    return telefone;
} 

