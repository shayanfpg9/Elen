import RootLayout from "../components/temp";

function AdminPanel({ children }) {
  return <RootLayout params={{ locale: "en" }}>{children}</RootLayout>;
}

export default AdminPanel;
