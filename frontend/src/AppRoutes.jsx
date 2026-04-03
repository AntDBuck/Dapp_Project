import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllArticlesPage from "./pages/AllArticlesPage";
import NoPage from "./pages/noPage";
import CreateArticlePage from "./pages/CreateArticlePage";

function AppRoutes({ contract, account })
{
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route 
                path='/all-articles' 
                element={<AllArticlesPage contract={contract} account={account} />} 
            />
            <Route 
                path='/create-article' 
                element={<CreateArticlePage contract={contract} account={account}/>}  
            />
            <Route path='*' element={<NoPage />} />
        </Routes>
    );
};

export default AppRoutes;