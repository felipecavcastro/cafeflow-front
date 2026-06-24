import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mensagem, setMensagem] = useState('')

  const lidarComLogin = async (e) => {
    e.preventDefault()
    setMensagem('Conectando ao servidor Java...')

    try {
      // Dispara os dados digitados direto para a sua API Spring Boot!
      const resposta = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (resposta.ok) {
        const token = await resposta.text()
        localStorage.setItem('token', token) // Guarda o Token JWT com segurança no navegador
        setMensagem('✅ Login realizado com sucesso! Token salvo.')
      } else {
        setMensagem('❌ Usuário ou senha incorretos!')
      }
    } catch (erro) {
      setMensagem('❌ Erro: Certifique-se de que o seu Java está ligado!')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>☕ CafeFlow</h1>
        <p>Acesse o sistema de reservas</p>

        <form onSubmit={lidarComLogin}>
          <div className="input-group">
            <label>E-mail (Username)</label>
            <input
              type="email"
              placeholder="Ex: nomade@cafe.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Entrar</button>
        </form>

        {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
      </div>
    </div>
  )
}

export default App
