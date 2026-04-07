import css from './CadastroDoador1.module.css'
import Titulo from "../Titulo/Titulo.jsx";
import BotaoAlternar from "../BotaoAlternar/BotaoAlternar.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";

export default function CadastroDoador1() {
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [fotoPerfil, setFotoPerfil] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();

    function alterarNome(e) {
        setNome(e.target.value)
    }

    function alterarCPF(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setCpf(valor)
    }

    function alterarTelefone(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setTelefone(valor)
    }

    function alterarEmail(e) {
        setEmail(e.currentTarget.value)
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

    async function criarDoador() {
        // Validação de senhas
        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem!')
            return
        }

        // Validação de email
        if (!email || !email.includes('@')) {
            setError('Digite um e-mail válido!')
            return
        }

        const form = new FormData();
        form.append('nome', nome)
        form.append('cpf_cnpj', cpf)
        form.append('telefone', telefone)
        form.append('email', email)
        form.append('senha', senha)
        form.append('confirmar_senha', confirmarSenha)
        form.append('tipo', 0) // 0 para doador

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
                // Salva o email no localStorage para usar na confirmação
                localStorage.setItem('emailConfirmacao', email)
                // Redireciona para confirmar email (não vai direto pro login)
                navigate('/ConfirmarEmail')
            } else {
                setError(retorno.error)
            }
        } catch (error) {
            console.error('Erro:', error)
            setError('Erro de conexão com o servidor!')
        }
    }

    return (
        <section className={css.containerSection}>
            <div>
                <Mensagem tipo={"erro"} texto={error} />
            </div>
            <div className={css.organizar}>
                <Titulo titulo={'Venha fazer parte da mudança!'} cor={'rosa'} />
                <BotaoAlternar ong={false}/>
            </div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input
                            label={'Nome'}
                            type={'text'}
                            placeholder={'Digite seu nome'}
                            required={true}
                            input={nome}
                            alterarInput={alterarNome}
                        />
                        <Input
                            label={'Senha'}
                            type={'password'}
                            placeholder={'Digite sua senha'}
                            required={true}
                            input={senha}
                            alterarInput={alterarSenha}
                        />
                        <Input
                            label={'Telefone'}
                            type={'text'}
                            placeholder={'Digite seu telefone'}
                            required={true}
                            maxLength={11}
                            input={telefone}
                            alterarInput={alterarTelefone}
                        />
                        <Input
                            label={'Email'}
                            type={'email'}
                            placeholder={'Digite seu email'}
                            required={true}
                            input={email}
                            alterarInput={alterarEmail}
                        />
                    </div>
                    <div className={css.campos}>
                        <Input
                            label={'CPF'}
                            type={'text'}
                            placeholder={'Digite seu CPF'}
                            required={true}
                            maxLength={11}
                            input={cpf}
                            alterarInput={alterarCPF}
                        />
                        <Input
                            label={'Confirmar senha'}
                            type={'password'}
                            placeholder={'Confirme sua senha'}
                            required={true}
                            input={confirmarSenha}
                            alterarInput={alterarConfirmarSenha}
                        />
                        <Input
                            label={'Foto de perfil'}
                            type={'file'}
                            tamanho={'Big'}
                            required={true}
                            alterarInput={alterarFotoPerfil}
                        />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={criarDoador} texto={'Cadastre-se'} cor={'rosa'}/>
                </div>
            </div>
        </section>
    )
}