import Titulo from "../Titulo/Titulo.jsx";
import css from "./AcessoRestrito1.module.css"
import Botao from "../Botao/Botao.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function AcessoRestrito1() {
    const navigate = useNavigate();
    const nome = localStorage.getItem('nome');

    async function Logout() {
        const token = localStorage.getItem('token');
        await fetch('http://10.92.3.125:5000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        localStorage.removeItem("token");
        localStorage.removeItem("nome");

        navigate("/login");
    }

    useEffect(function () {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate("/login");
        }
    }, [])

    return (
        <div className={css.inicio}>
            <Titulo titulo={'Olá, ' + nome} cor={'azul-claro'} texto={'Essa página é restrita, sendo somente acessada com validação'}/>
            <div>
                <Botao texto={'Logout'} cor={'vermelho'} acao={Logout}/>
            </div>
        </div>
    )
}