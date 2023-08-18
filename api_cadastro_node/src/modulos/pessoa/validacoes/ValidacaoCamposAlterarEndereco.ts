import ValidacaoErro from '@compartilhada/erros/ValidacaoErro';
import Endereco from '../entidades/Endereco';

export default function validacaoCamposAlterarEndereço(enderecos: Endereco[]) {
  for (const endereco of enderecos) {
    const {
      codigoEndereco,
      codigoPessoa,
      codigoBairro,
      nomeRua,
      numero,
      complemento,
      cep,
    } = endereco;

    if (!codigoPessoa) {
      throw new ValidacaoErro(
        'O Campo codigoPessoa é obrigatório! Por favor, preencha o campo!',
        400,
        'codigoPessoa',
      );
    }
    if (!codigoBairro) {
      throw new ValidacaoErro(
        'O Campo codigoBairro é obrigatório! Por favor, preencha o campo!',
        400,
        'codigoBairro',
      );
    }
    if (!nomeRua) {
      throw new ValidacaoErro(
        'O Campo nomeRua é obrigatório! Por favor, preencha o campo!',
        400,
        'nomeRua',
      );
    }
    if (!numero) {
      throw new ValidacaoErro(
        'O Campo numero é obrigatório! Por favor, preencha o campo!',
        400,
        'numero',
      );
    }
    if (!complemento) {
      throw new ValidacaoErro(
        'O Campo complemento é obrigatório! Por favor, preencha o campo!',
        400,
        'complemento',
      );
    }
    if (!cep) {
      throw new ValidacaoErro(
        'O Campo cep é obrigatório! Por favor, preencha o campo!',
        400,
        'cep',
      );
    }

    if (
      (codigoEndereco && typeof codigoEndereco !== 'number') ||
      codigoEndereco <= 0
    ) {
      throw new ValidacaoErro(
        'O campo codigoEndereco deve ser um número inteiro positivo!',
        400,
        'codigoEndereco',
      );
    }

    if (typeof codigoPessoa !== 'number' || codigoPessoa <= 0) {
      throw new ValidacaoErro(
        'O campo codigoPessoa deve ser um número inteiro positivo!',
        400,
        'codigoPessoa',
      );
    }

    if (typeof codigoBairro !== 'number' || codigoBairro <= 0) {
      throw new ValidacaoErro(
        'O campo codigoBairro deve ser um número inteiro positivo!',
        400,
        'codigoBairro',
      );
    }

    if (typeof nomeRua !== 'string') {
      throw new ValidacaoErro(
        'O campo nomeRua deve ser preenchido corretamente! (texto)',
        400,
        'nomeRua',
      );
    }

    if (typeof numero !== 'string' || numero.length > 10) {
      throw new ValidacaoErro(
        'O campo nomeRua deve ser preenchido corretamente! (texto - máximo 10 caracteres)',
        400,
        'numero',
      );
    }

    if (typeof complemento !== 'string' || complemento.length > 20) {
      throw new ValidacaoErro(
        'O campo complemento deve ser preenchido corretamente! (texto - máximo 20 caracteres)',
        400,
        'complemento',
      );
    }

    if (typeof cep !== 'string') {
      throw new ValidacaoErro(
        'O campo cep deve ser preenchido corretamente! (texto)',
        400,
        'cep',
      );
    }

    const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
    if (!cepRegex.test(cep)) {
      throw new ValidacaoErro(
        'O campo cep deve conter um formato válido! (00000-000)',
        400,
        'cep',
      );
    }
  }
}
