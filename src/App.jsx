import { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [isCadastro, setIsCadastro] = useState(false)
  const [role, setRole] = useState("USER")
  const [logado, setLogado] = useState(!!localStorage.getItem("token"))
  const [mesas, setMesas] = useState([])

  const buscarMesas = async () => {
    const token = localStorage.getItem("token")
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/stations`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (resposta.ok) {
        const dados = await resposta.json()
        setMesas(dados)
      }
    } catch (erro) {
      setMensagem("❌ Erro de conexão ao carregar mesas.")
    }
  }

  const reservarMesa = async (stationId) => {
    const token = localStorage.getItem("token")
    setMensagem("Processando sua reserva...")
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          station: { id: stationId },
          prepaidAmount: 10.0
        })
      })
      if (resposta.ok) {
        setMensagem("✅ Reserva realizada com sucesso!")
        buscarMesas()
      } else {
        const erroTexto = await resposta.text()
        setMensagem(`❌ Erro ao reservar: ${erroTexto || "Verifique as regras."}`)
      }
    } catch (erro) {
      setMensagem("❌ Erro ao se conectar com o servidor Java.")
    }
  }

  useEffect(() => {
    if (logado) { buscarMesas() }
  }, [logado])

  const lidarComLogin = async (e) => {
    e.preventDefault()
    setMensagem("Conectando ao servidor Java...")
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (resposta.ok) {
        const token = await resposta.text()
        localStorage.setItem("token", token)
        setLogado(true)
        setMensagem("")
      } else {
        setMensagem("❌ Usuário ou senha incorretos!")
      }
    } catch (erro) {
      setMensagem("❌ Erro: Certifique-se de que a API na nuvem está online!")
    }
  }

  const lidarComCadastro = async (e) => {
    e.preventDefault()
    setMensagem("Registrando sua conta na nuvem...")
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0, username, password, role }),
      })
      if (resposta.ok) {
        setMensagem("✅ Conta criada com sucesso! Faça seu login.")
        setIsCadastro(false)
        setPassword("")
      } else {
        const erroTexto = await resposta.text()
        setMensagem(`❌ Erro no cadastro: ${erroTexto || "Tente outro e-mail."}`)
      }
    } catch (erro) {
      setMensagem("❌ Erro de conexão com o servidor Java ao cadastrar.")
    }
  }

  const fazerLogout = () => {
    localStorage.removeItem("token")
    setLogado(false)
    setMesas([])
    setMensagem("")
  }

  if (!logado) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>☕ CafeFlow</h1>
          <p>{isCadastro ? "Crie sua conta de cliente" : "Acesse o sistema de reservas"}</p>

          <form onSubmit={isCadastro ? lidarComCadastro : lidarComLogin}>
            <div className="input-group">
              <label>E-mail</label>
              <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {isCadastro && (
              <div className="input-group">
                <label>Tipo de Perfil</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="select-role">
                  <option value="USER">Cliente (USER)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
              </div>
            )}

            <button type="submit">{isCadastro ? "Cadastrar" : "Entrar"}</button>
          </form>

          <div className="alternar-container">
            <button
              className="btn-alternar"
              type="button"
              onClick={() => {
                setIsCadastro(!isCadastro)
                setMensagem("")
              }}
            >
              {isCadastro ? "Já tem conta? Faça Login" : "Não tem conta? Cadastre-se aqui"}
            </button>
          </div>

          {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>☕ CafeFlow - Painel de Mesas</h2>
        <button className="btn-logout" onClick={fazerLogout}>Sair</button>
      </header>
      <main className="dashboard-content">
        <h3>Escolha uma mesa disponível para trabalhar:</h3>
        {mensagem && <p className="mensagem-feedback global-msg">{mensagem}</p>}
        {mesas.length === 0 ? (
          <p className="aviso-vazio">Nenhuma mesa cadastrada no banco de dados.</p>
        ) : (
          <div className="grid-mesas">
            {mesas.map((mesa) => (
              <div key={mesa.id} className={`card-mesa ${mesa.available ? "disponivel" : "ocupada"}`}>
                <h4>Mesa #{mesa.id}</h4>
                <p>Nome/Número: {mesa.name || `Mesa ${mesa.id}`}</p>
                <div className="status-container">
                  <span className="badge-status">
                    {mesa.available ? "🟢 Livre" : "🔴 Ocupada"}
                  </span>
                </div>
                {mesa.available && (
                  <button className="btn-reservar" onClick={() => reservarMesa(mesa.id)}>
                    <span>Reservar Mesa</span>
                    <span>(R$ 10,00)</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
