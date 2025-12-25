import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { HomePage } from './pages/home'
import { BlogPage } from './pages/blog'
import { PostPage } from './pages/post'
import { PortfolioPage } from './pages/portfolio'
import { AboutPage } from './pages/about'
import { NotFoundPage } from './pages/not-found'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

