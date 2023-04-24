import { Link, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleSubmitLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      setUser(response.data);
      alert("login successful!");
      setRedirect(true);
    } catch (e) {
      alert(e, "Login Failed!!");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmitLogin}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="primary">Login</button>

          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="underline text-black">
              Register Now!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
