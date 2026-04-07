import css from './CadastroOng1.module.css'
import Titulo from "../Titulo/Titulo.jsx";
import BotaoAlternar from "../BotaoAlternar/BotaoAlternar.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import Select from "../Select/Select.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";

export default function CadastroOng1() {
    const [nome, setNome] = useState('')
    const [descBreve, setDescBreve] = useState('')
    const [descLonga, setDescLonga] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [categoria, setCategoria] = useState('')
    const [codBanco, setCodBanco] = useState('')
    const [numAgencia, setNumAgencia] = useState('')
    const [numConta, setNumConta] = useState('')
    const [tipoConta, setTipoConta] = useState('')
    const [fotoPerfil, setFotoPerfil] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate();

    function alterarNome(e) {
        setNome(e.target.value)
    }

    function alterarDescBreve(e) {
        setDescBreve(e.target.value)
    }

    function alterarDescLonga(e) {
        setDescLonga(e.target.value)
    }

    function alterarLocalizacao(e) {
        setLocalizacao(e.target.value)
    }

    function alterarCategoria(e) {
        setCategoria(e.target.value)
    }

    function alterarTipoConta(e) {
        setTipoConta(e.target.value)
    }

    function alterarCNPJ(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setCnpj(valor)
    }

    function alterarTelefone(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setTelefone(valor)
    }

    function alterarEmail(e) {
        setEmail(e.currentTarget.value)
    }

    function alterarCodBanco(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setCodBanco(valor)
    }

    function alterarNumAgencia(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setNumAgencia(valor)
    }

    function alterarNumConta(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setNumConta(valor)
    }

    function alterarSenha(e) {
        setSenha(e.target.value)
    }

    function alterarConfirmarSenha(e) {
        setConfirmarSenha(e.target.value)
    }

    function alterarFotoPerfil(e) {
        setFotoPerfil(e.target.files[0])
    }

    async function criarOng() {
        // Limpa mensagens anteriores
        setError('')
        setSuccess('')

        // Validações
        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem!')
            return
        }

        if (!email || !email.includes('@')) {
            setError('Digite um e-mail válido!')
            return
        }

        if (!telefone) {
            setError('Digite um telefone para contato!')
            return
        }

        if (!cnpj) {
            setError('Digite o CNPJ da ONG!')
            return
        }

        const form = new FormData();
        form.append('nome', nome)
        form.append('cpf_cnpj', cnpj)
        form.append('telefone', telefone)
        form.append('email', email)
        form.append('senha', senha)
        form.append('confirmar_senha', confirmarSenha)
        form.append('tipo', 2) // Tipo 2 para ONG

        // Campos específicos da ONG
        form.append('descricao_breve', descBreve)
        form.append('descricao_longa', descLonga)
        form.append('localizacao', localizacao)
        form.append('categoria', categoria)
        form.append('cod_banco', codBanco)
        form.append('num_agencia', numAgencia)
        form.append('num_conta', numConta)
        form.append('tipo_conta', tipoConta)

        if (fotoPerfil) {
            form.append('foto_perfil', fotoPerfil)
        }

        try {
            let retorno = await fetch('http://10.92.3.125:5000/criar_usuarios', {
                method: 'POST',
                credentials: 'include',
                body: form
            })

            retorno = await retorno.json();

            if (retorno.message) {
                setSuccess('ONG cadastrada com sucesso! Aguarde a aprovação do administrador para fazer login.')
                // Redireciona para o login após 3 segundos
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            } else {
                setError(retorno.error || 'Erro ao cadastrar ONG')
            }
        } catch (error) {
            console.error('Erro:', error)
            setError('Erro de conexão com o servidor!')
        }
    }

    return(
        <section className={css.containerSection}>
            <div>
                <Mensagem tipo={"erro"} texto={error} />
                <Mensagem tipo={"sucesso"} texto={success} />
            </div>
            <div className={css.organizar}>
                <Titulo titulo={'Venha fazer parte da mudança!'} cor={'laranja'}/>
                <BotaoAlternar ong={true}/>
            </div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input
                            label={'Nome'}
                            type={'text'}
                            placeholder={'Digite o nome da ONG'}
                            required={true}
                            input={nome}
                            alterarInput={alterarNome}
                        />
                        <Input
                            label={'Descrição breve'}
                            type={'text'}
                            placeholder={'Descrição breve sobre sua ONG'}
                            required={true}
                            maxLength={30}
                            input={descBreve}
                            alterarInput={alterarDescBreve}
                        />
                        <Input
                            label={'Senha'}
                            type={'password'}
                            placeholder={'Crie uma senha'}
                            required={true}
                            input={senha}
                            alterarInput={alterarSenha}
                        />
                        <Input
                            label={'Localização'}
                            type={'text'}
                            placeholder={'Digite sua localização'}
                            required={true}
                            input={localizacao}
                            alterarInput={alterarLocalizacao}
                        />
                        <Input
                            label={'Código do banco'}
                            type={'text'}
                            placeholder={'Digite o código do banco'}
                            required={true}
                            maxLength={3}
                            soNumeros={true}
                            input={codBanco}
                            alterarInput={alterarCodBanco}
                        />
                        <Input
                            label={'Número da conta'}
                            type={'text'}
                            placeholder={'Digite o número da conta'}
                            required={true}
                            soNumeros={true}
                            input={numConta}
                            maxLength={12}
                            alterarInput={alterarNumConta}
                        />
                        <Input
                            label={'CNPJ'}
                            type={'text'}
                            placeholder={'Digite o CNPJ'}
                            required={true}
                            maxLength={14}
                            soNumeros={true}
                            input={cnpj}
                            alterarInput={alterarCNPJ}
                        />
                        <Input
                            label={'Telefone'}
                            type={'text'}
                            placeholder={'Digite o telefone'}
                            required={true}
                            maxLength={11}
                            soNumeros={true}
                            input={telefone}
                            alterarInput={alterarTelefone}
                        />
                    </div>
                    <div className={css.campos}>
                        <Input
                            tamanho={'Big'}
                            label={'Descrição longa'}
                            type={'text'}
                            placeholder={'Descrição longa sobre sua ONG'}
                            required={true}
                            minLength={50}
                            maxLength={200}
                            input={descLonga}
                            alterarInput={alterarDescLonga}
                        />
                        <Input
                            label={'Confirmar senha'}
                            type={'password'}
                            placeholder={'Confirme sua senha'}
                            required={true}
                            input={confirmarSenha}
                            alterarInput={alterarConfirmarSenha}
                        />
                        <Select
                            label={'Categoria'}
                            options={['Escolha uma categoria', 'Animal', 'Escolar', 'Comida', 'Outro']}
                            input={categoria}
                            alterarInput={alterarCategoria}
                        />
                        <Input
                            label={'Número da agência'}
                            type={'text'}
                            placeholder={'Digite o número da sua agência'}
                            required={true}
                            soNumeros={true}
                            input={numAgencia}
                            maxLength={4}
                            alterarInput={alterarNumAgencia}
                        />
                        <Select
                            label={'Tipo de conta'}
                            options={['Escolha um tipo de conta', 'Conta-corrente', 'Poupança', 'Conta salário', 'Conta digital', 'Conta PJ']}
                            input={tipoConta}
                            alterarInput={alterarTipoConta}
                        />
                        <Input
                            label={'Email'}
                            type={'email'}
                            placeholder={'Digite seu email'}
                            required={true}
                            input={email}
                            alterarInput={alterarEmail}
                        />
                        <Input
                            label={'Foto de perfil'}
                            type={'file'}
                            required={true}
                            alterarInput={alterarFotoPerfil}
                        />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={criarOng} texto={'Cadastre-se'} cor={'rosa'}/>
                </div>
            </div>
        </section>
    )
}