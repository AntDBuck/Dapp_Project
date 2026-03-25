import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AllArticlesPage from "./pages/AllArticlespage";
import MyArticlesPage from "./pages/myArticlesPage";
import NoPage from "./pages/noPage";

function AppRoutes()
{
    return (
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/about' element={<AboutPage />}></Route>
            <Route path='/all-articles' element={<AllArticlesPage />}></Route>
            <Route path='/my-articles' element={<MyArticlesPage />}></Route>
            <Route path='*' element={<NoPage />}></Route>
        </Routes>
    );
};

export default AppRoutes;