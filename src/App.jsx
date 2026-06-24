import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mensagem, setMensagem] = useState('')

  // Estados novos para controlar as telas e carregar as mesas
  const [logado, setLogado] = useState(!!localStorage.getItem('token'))
  const [mesas, setMesas] = useState([])

  // Função para buscar as mesas direto da API Java
  const buscarMesas = async () => {
    const token = localStorage.getItem('token')

    try {
      const resposta = await fetch('http://localhost:8080/stations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Envia o token para o segurança do Spring
        }
      })

      if (resposta.ok) {
        const dados = await resposta.json()
        setMesas(dados)
      } else {
        setMensagem('❌ Não foi possível carregar as mesas.')
      }
    } catch (erro) {
      setMensagem('❌ Erro de conexão com o servidor.')
    }
  }

  // Roda automaticamente assim que o componente carrega na tela
  useEffect(() => {
    if (logado) {
      buscarMesas()
    }
  }, [logado])

  const lidarComLogin = async (e) => {
    e.preventDefault()
    setMensagem('Conectando ao servidor Java...')

    try {
      const resposta = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (resposta.ok) {
        const token = await resposta.text()
        localStorage.setItem('token', token)
        setLogado(true)
        setMensagem('')
      } else {
        setMensagem('❌ Usuário ou senha incorretos!')
      }
    } catch (erro) {
      setMensagem('❌ Erro: Certifique-se de que o seu Java está ligado!')
    }
  }

  const fazerLogout = () => {
    localStorage.removeItem('token')
    setLogado(false)
    setMesas([])
  }

  // TELA 1: Se não estiver logado, exibe o Formulário de Login
  if (!logado) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>☕ CafeFlow</h1>
          <p>Acesse o sistema de reservas</p>
          <form onSubmit={lidarComLogin}>
            <div className="input-group">
              <label>E-mail</label>
              <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Entrar</button>
          </form>
          {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
        </div>
      </div>
    )
  }

  // TELA 2: Se estiver logado, exibe o Painel Principal com as Mesas em tempo real
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>☕ CafeFlow - Painel de Mesas</h2>
        <button className="btn-logout" onClick={fazerLogout}>Sair</button>
      </header>

      <main className="dashboard-content">
        <h3>Escolha uma mesa disponível para trabalhar:</h3>

        {mesas.length === 0 ? (
          <p className="aviso-vazio">Nenhuma mesa cadastrada no banco de dados. Crie mesas usando o Swagger!</p>
        ) : (
          <div className="grid-mesas">
            {mesas.map((mesa) => (
              <div key={mesa.id} className={`card-mesa ${mesa.available ? 'disponivel' : 'ocupada'}`}>
                <h4>Mesa #{mesa.id}</h4>
                <p>Nome/Número: {mesa.name || `Mesa ${mesa.id}`}</p>
                <span className="badge-status">
                  {mesa.available ? '🟢 Livre' : '🔴 Ocupada'}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
