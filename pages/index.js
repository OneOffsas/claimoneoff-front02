export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-violet-600 to-blue-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl text-center animate-fade-in">
        <img src="/logo.png" alt="ClaimOneOff" className="mx-auto w-32 h-32 mb-6" />
        <h1 className="text-4xl font-extrabold mb-4 text-violet-800">ClaimOneOff</h1>
        <p className="text-lg mb-8 text-gray-700">Le portail de gestion de litiges logistiques e-commerce <b>design</b>, <b>rapide</b> et <b>performant</b>.<br/> Connecte-toi pour accéder à ta plateforme.</p>
        <div className="flex justify-center gap-6">
          <a href="/login" className="bg-gradient-to-r from-violet-700 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition">Se connecter</a>
          <a href="/register" className="bg-white border-2 border-violet-700 text-violet-800 px-8 py-3 rounded-xl font-bold text-lg hover:bg-violet-50 shadow-xl transition">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}
