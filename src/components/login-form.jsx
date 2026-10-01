import { useState } from "react";

export const LoginForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  console.log(form);
  return (
    <form>
      <input name={"username"} value={form.username} onChange={handleChange} />
      <input name="password" value={form.password} onChange={handleChange} />
      <button>Submit</button>
    </form>
  );
};
