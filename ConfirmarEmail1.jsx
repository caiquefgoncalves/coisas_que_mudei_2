import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './ConfirmarEmail1.module.css';
import Input from "../../components/Input/Input.jsx";
import Titulo from "../Titulo/Titulo.jsx";
import Botao from "../Botao/Botao.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";

const API_URL = 'http://10.92.3.125:5000';

export default function ConfirmarEmail1() {
    const navigate = useNavigate();
    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [email, setEmail] = useState('');

    useEffect(() => {

        const savedEmail = localStorage.getItem('emailConfirmacao');
        if (!savedEmail) {
            setMensagem({ tipo: 'erro', texto: 'Nenhum cadastro pendente. Faça o cadastro primeiro!' });
            setTimeout(() => {
                navigate('/cadastroDoador');
            }, 2000);
            return;
        }
        setEmail(savedEmail);
    }, [navigate]);

    // Impede o usuário de sair da página sem confirmar
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (localStorage.getItem('emailConfirmacao')) {
                e.preventDefault();
                e.returnValue = 'Você precisa confirmar seu email para fazer login. Tem certeza que deseja sair?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    async function handleConfirmarCodigo() {
        if (!codigo) {
            setMensagem({ tipo: 'erro', texto: 'Digite o código de confirmação' });
            return;
        }

        if (codigo.length !== 6) {
            setMensagem({ tipo: 'erro', texto: 'O código deve ter 6 dígitos' });
            return;
        }

        setLoading(true);
        setMensagem({ tipo: '', texto: '' });

        try {
            const retorno = await fetch(`${API_URL}/confirmar_email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo_digitado: codigo })
            });

            const data = await retorno.json();

            if (retorno.ok) {
                setMensagem({ tipo: 'sucesso', texto: 'E-mail confirmado com sucesso! Redirecionando para o login...' });

                localStorage.removeItem('emailConfirmacao');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMensagem({ tipo: 'erro', texto: data.error || data.message || 'Código incorreto!' });
            }
        } catch (error) {
            console.error('Erro:', error);
            setMensagem({ tipo: 'erro', texto: 'Erro de conexão com o servidor!' });
        } finally {
            setLoading(false);
        }
    }

    function handleVoltarCadastro() {

        localStorage.removeItem('emailConfirmacao');
        navigate('/cadastroDoador');
    }

    return (
        <div className={"container-fluid " + css.secao}>
            <Mensagem
                tipo={mensagem.tipo}
                texto={mensagem.texto}
                onClose={() => setMensagem({ tipo: '', texto: '' })}
            />

            <div className="row">
                <div className={"col-md-7 " + css.padding}>
                    <Titulo
                        titulo={'Confirme seu E-mail'}
                        cor={'azul-claro'}
                        texto={`Enviamos um código de 6 dígitos para o e-mail: ${email}`}
                    />
                    <div className={"d-flex flex-column align-items-start justify-content-center gap-5"}>
                        <div className={"d-flex flex-column align-items-center justify-content-center gap-4"}>
                            <div className={"d-flex flex-column align-items-start justify-content-center gap-3 " + css.width}>
                                <Input
                                    label={"Código de confirmação"}
                                    type={"text"}
                                    placeholder={"Digite o código de 6 dígitos"}
                                    required={true}
                                    maxLength={6}
                                    soNumeros={true}
                                    input={codigo}
                                    alterarInput={(e) => setCodigo(e.target.value)}
                                />
                            </div>

                            <div className={"d-flex align-items-end justify-content-center gap-5"}>
                                <Botao
                                    cor={'amarelo'}
                                    texto={loading ? 'Confirmando...' : 'Confirmar e-mail'}
                                    acao={handleConfirmarCodigo}
                                />
                                <Botao
                                    cor={'vazadoamarelo'}
                                    texto={'Voltar ao cadastro'}
                                    acao={handleVoltarCadastro}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-5 d-flex justify-content-end"}>
                    <img className={css.imagem} src='/cachorro_macaco.png' alt="Cachorro com um macaco de pelúcia"/>
                </div>
            </div>
        </div>
    );
}