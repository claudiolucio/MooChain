/* eslint-disable linebreak-style */
// Remove the unused import statement for React
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./loginPage.tsx"; // Importe a página de login
import Dashboard from "./dashboard.tsx"; // Importe o Dashboard
import ManageVakinha from "./ManageVakinha.tsx"; // Importe o ManageVakinha

function App() {
  const { isAuthenticated, isLoading } = useAuth0(); // Use o hook useAuth0 para autenticação

  // Mostre uma tela de carregamento enquanto o estado de autenticação está sendo carregado
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Se o usuário não estiver autenticado, mostre a página de login
  if (!isAuthenticated) {
    return <LoginPage />;
  }


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-vakinha/:vaquinhaId" element={<ManageVakinha vaquinhaId={1} walletAddress='placeholder' />} />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;
