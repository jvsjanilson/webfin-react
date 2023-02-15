
function validaDocumento() {
    var invalidos = [[],[]];

    for (var i = 0; i < 10; i++) {
        invalidos[0].push(''.padStart(11, i.toString()));
        invalidos[1].push(''.padStart(14, i.toString()));
    }

	return {
        valid: function(documento) {
            documento = documento.replace(/\D/ig, '');
            return documento.length == 11 ? this.validCpf(documento) : this.validCnpj(documento);
        }
        ,
        validCpf: function(cpf) {
            if ( !cpf || cpf.length != 11 || invalidos[0].includes(cpf) ) return false
			var soma = 0
		    var resto
			for (var i = 1; i <= 9; i++)
				soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
			resto = (soma * 10) % 11
		    if ((resto == 10) || (resto == 11))  resto = 0
		    if (resto != parseInt(cpf.substring(9, 10)) ) return false
			soma = 0
		    for (var i = 1; i <= 10; i++)
		    	soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
		    resto = (soma * 10) % 11
		    if ((resto == 10) || (resto == 11))  resto = 0
		    if (resto != parseInt(cpf.substring(10, 11) ) ) return false
		    return true
		},
		validCnpj: function(cnpj) {
		    if ( !cnpj || cnpj.length != 14	 || invalidos[1].includes(cnpj)) return false
		    var tamanho = cnpj.length - 2
		    var numeros = cnpj.substring(0,tamanho)
		    var digitos = cnpj.substring(tamanho)
		    var soma = 0
		    var pos = tamanho - 7
		    for (var i = tamanho; i >= 1; i--) {
		      soma += numeros.charAt(tamanho - i) * pos--
		      if (pos < 2) pos = 9
		    }
		    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
		    if (resultado != digitos.charAt(0)) return false;
		    tamanho = tamanho + 1
		    numeros = cnpj.substring(0,tamanho)
		    soma = 0
		    pos = tamanho - 7
		    for (var i = tamanho; i >= 1; i--) {
		      soma += numeros.charAt(tamanho - i) * pos--
		      if (pos < 2) pos = 9
		    }
		    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
		    if (resultado != digitos.charAt(1)) return false
		    return true;
		}
	}
}