import css from './Login1.module.css'
import Input from "../../components/Input/Input.jsx";
import Titulo from "../Titulo/Titulo.jsx";
import Botao from "../Botao/Botao.jsx";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";

const API_URL = 'http://10.92.3.125:5000';

export default function Login1() {
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    // Verificar se tem email pendente (apenas para DOADORES)
    useEffect(() => {
        const emailPendente = localStorage.getItem('emailConfirmacao');
        if (emailPendente) {
            setError('Você precisa confirmar seu email antes de fazer login!');
            setTimeout(() => {
                navigate('/confirmar-email');
            }, 2000);
        }
    }, [navigate]);

    function alterarCPF(e) {
        let valor = e.currentTarget.value
        valor = valor.replace(/\D/g, '')
        setCpf(valor)
    }

    function alterarSenha(e) {
        setSenha(e.target.value)
    }

    async function realizarLogin(e) {
        e.preventDefault();

        // Verifica novamente se tem email pendente (apenas para DOADORES)
        const emailPendente = localStorage.getItem('emailConfirmacao');
        if (emailPendente) {
            setError('Você precisa confirmar seu email antes de fazer login!');
            setTimeout(() => {
                navigate('/confirmar-email');
            }, 2000);
            return;
        }

        if (!cpf || !senha) {
            setError('Preencha todos os campos!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let retorno = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    cpf_cnpj: cpf,
                    senha: senha,
                })
            })

            const data = await retorno.json();

            if (retorno.ok && data.token) {
                // Salva os dados no localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('nome', data.nome);

                // Busca informações do usuário para saber o tipo e status
                const userInfo = await buscarUsuarioPorCPF(cpf);

                if (userInfo) {
                    localStorage.setItem('tipo_usuario', userInfo.tipo);

                    // Se for ONG (tipo 2), verifica aprovação
                    if (userInfo.tipo === 2) {
                        if (userInfo.aprovacao === 1) {
                            // ONG aprovada - vai para dashboard
                            navigate('/dashboard');
                        } else {
                            // ONG não aprovada - vai para acesso restrito
                            navigate('/acesso-restrito');
                        }
                    } else {
                        // Doador ou Admin - vai para dashboard
                        navigate('/dashboard');
                    }
                } else {
                    navigate('/dashboard');
                }
            } else {
                // Verifica se o erro é por email não confirmado (apenas para doadores)
                if (data.error && data.error.includes('Verifique o e-mail')) {
                    setError('E-mail não confirmado! Redirecionando para confirmação...');
                    setTimeout(() => {
                        navigate('/confirmar-email');
                    }, 2000);
                } else {
                    setError(data.error || 'Erro ao fazer login');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            setError('Erro de conexão com o servidor!');
        } finally {
            setLoading(false);
        }
    }

    async function buscarUsuarioPorCPF(cpf_cnpj) {
        try {
            const retorno = await fetch(`${API_URL}/buscar_usuario_por_cpf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cpf_cnpj: cpf_cnpj })
            });

            const data = await retorno.json();
            if (retorno.ok && data.usuario) {
                return data.usuario;
            }
            return null;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    return (
        <div className={"container-fluid " + css.secao}>
            <div>
                <Mensagem tipo={"erro"} texto={error} onClose={() => setError('')} />
            </div>
            <div className="row g-0">
                <div className={"col-md-6 col-md-6 " + css.colunaFormulario}>
                    <div className={css.conteudoFormulario}>
                        <Titulo titulo={'Bem-vindo de volta!'} cor={'azul-claro'} />

                        <form className={css.formulario} onSubmit={realizarLogin}>
                            <div className={css.campo}>
                                <Input
                                    label={"CPF/CNPJ"}
                                    type={"text"}
                                    input={cpf}
                                    alterarInput={alterarCPF}
                                    placeholder={"Digite seu CPF ou CNPJ"}
                                    required={true}
                                    maxLength={14}
                                />
                            </div>

                            <div className={css.campo}>
                                <Input
                                    alterarInput={alterarSenha}
                                    input={senha}
                                    label={"Senha"}
                                    type={"password"}
                                    placeholder={"Digite sua senha"}
                                    required={true}
                                />
                                <a href="/esqueciSenha" className={css.link}>Esqueci minha senha</a>
                            </div>

                            <div className={css.areaBotao}>
                                <Botao
                                    acao={realizarLogin}
                                    cor={'amarelo'}
                                    texto={loading ? 'Entrando...' : 'Login'}
                                />
                            </div>

                            <div className={css.cadastro}>
                                <p className={css.p}>Ainda não está no Doar+?</p>
                                <Botao pagina={'/cadastroDoador'} cor={'vazadoamarelo'} texto={'Cadastre-se'} />
                            </div>
                        </form>
                    </div>
                </div>

                <div className={"col-md-6 " + css.colunaImagem}>
                    <img
                        className={css.imagem}
                        src="/cachorro_macaco.png"
                        alt="Cachorro com um macaco de pelúcia"
                    />
                </div>
            </div>
        </div>
    )
}