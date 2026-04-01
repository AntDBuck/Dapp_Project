import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllArticlesPage from "./pages/AllArticlesPage";
import NoPage from "./pages/noPage";
import TestPage from "./pages/TestPage";
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
            <Route path='/test' element={<TestPage contract={contract} account={account} />} />
        </Routes>
    );
};

export default AppRoutes;