import * as Yup from 'yup';

const EstadoSchema = Yup.object().shape({
    uf: Yup.string()
      .max(2, 'Tamanho máximo do UF é 2 caracteres.')
      .required('O campo UF é obrigatório'),
    nome: Yup.string()
      .max(60, 'Tamanho máximo do Nome é 60 caracteres.')
      .required('O campo Nome é obrigatório.'),
  });
export default EstadoSchema