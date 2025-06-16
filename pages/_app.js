// pages/_app.js
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../styles/globals.css"
import Layout from "../components/Layout"

export default function App({ Component, pageProps }) {
  // pageProps.user doit venir de votre authentif si vous enregistrez user  
  return (
    <Layout user={pageProps.user}>
      <Component {...pageProps}/>
    </Layout>
  )
}
